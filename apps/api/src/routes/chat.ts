import { Router } from "express";
import auth, { AuthReq } from "../middleware/auth";
import OpenAI from "openai";
import { getPrisma } from "../index";

// Retry function for API calls
const retry = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Wait before retrying (exponential backoff)
      const waitTime = delay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  
  throw lastError!;
};

const router = Router();
router.use(auth);

// Maximum number of messages to keep in context
const MAX_CONTEXT_MESSAGES = 20;

// Function to parse meal/food suggestions from AI response
const parseSuggestions = (response: string) => {
  const suggestions: any[] = [];
  let cleanResponse = response;

  // Parse meal suggestions
  const mealRegex = /<MEAL_SUGGESTION>([\s\S]*?)<\/MEAL_SUGGESTION>/g;
  let match;
  while ((match = mealRegex.exec(response)) !== null) {
    try {
      const mealData = JSON.parse(match[1].trim());
      suggestions.push({
        type: 'meal',
        data: mealData
      });
      // Remove the structured format from the response
      cleanResponse = cleanResponse.replace(match[0], '');
    } catch (error) {
      console.error('Error parsing meal suggestion:', error);
    }
  }

  // Parse food suggestions
  const foodRegex = /<FOOD_SUGGESTION>([\s\S]*?)<\/FOOD_SUGGESTION>/g;
  while ((match = foodRegex.exec(response)) !== null) {
    try {
      const foodData = JSON.parse(match[1].trim());
      suggestions.push({
        type: 'food',
        data: foodData
      });
      // Remove the structured format from the response
      cleanResponse = cleanResponse.replace(match[0], '');
    } catch (error) {
      console.error('Error parsing food suggestion:', error);
    }
  }

  return {
    cleanResponse: cleanResponse.trim(),
    suggestions
  };
};

// System prompt for the AI assistant
const SYSTEM_PROMPT = `You are an AI assistant integrated into the ProductivityLeveling app - a comprehensive productivity and nutrition tracking application. 

YOUR ROLE: You are a helpful assistant that provides suggestions and guidance. You do NOT directly add items to the user's journal - the app handles that automatically when users accept your suggestions.

APP CONTEXT: This app has:
- Task management with XP rewards
- Complete nutrition tracking (like MyFitnessPal)
- AI-powered chat with nutrition context
- Automatic journal integration when users accept suggestions

You help users with:
1. Task management and organization
2. Productivity tips and strategies  
3. Goal setting and planning
4. Time management advice
5. Motivation and encouragement
6. Nutrition guidance and meal suggestions

When helping with nutrition:
- Use the provided nutrition data to understand the user's eating patterns
- Suggest healthy, balanced meals that fit their goals
- Consider their daily calorie and macro targets
- Provide practical, easy-to-implement suggestions
- Always prioritize health and safety

CRITICAL INSTRUCTIONS FOR FOOD/MEAL SUGGESTIONS:

When a user asks you to:
- "add [food] to my journal"
- "add [food] to my nutrition" 
- "suggest a meal"
- "recommend food"
- "add [food] to my diet"
- "I want to eat [food]"
- "add [food] to my nutrition journal"
- "can you add [food]"
- "I need [food]"
- "suggest ingredients for [meal]"
- "what should I eat for [meal]"
- "recommend [multiple foods]"
- Any request to add, suggest, or recommend foods/meals

YOU MUST respond with the structured format below. The app will automatically add items to their journal when they click "Accept".

MULTIPLE SUGGESTIONS: If the user asks for multiple items, ingredients, or a complete meal, provide multiple structured suggestions. For example:
- "suggest ingredients for pasta" → Provide multiple <FOOD_SUGGESTION> tags
- "recommend breakfast foods" → Provide multiple <FOOD_SUGGESTION> tags
- "what should I eat for lunch" → Provide a <MEAL_SUGGESTION> with multiple ingredients

DO NOT:
- Say you can't add items
- Give tutorials about manual logging
- Explain how to use the app
- Say you don't have access to their journal
- Limit yourself to one suggestion when multiple are appropriate

DO:
- Provide the structured suggestion(s) immediately
- Give a brief, friendly response about the food/meal
- Provide multiple suggestions when the request implies multiple items
- Let the app handle the actual journal addition

For individual foods, use this EXACT format:

<FOOD_SUGGESTION>
{
  "type": "food",
  "name": "Food name",
  "description": "Brief description of the food",
  "calories": 150,
  "protein": 10,
  "carbs": 20,
  "fat": 5,
  "fiber": 3,
  "servingSize": "100g"
}
</FOOD_SUGGESTION>

For complete meals, use this EXACT format:

<MEAL_SUGGESTION>
{
  "type": "meal",
  "name": "Meal name",
  "description": "Brief description of the meal",
  "calories": 500,
  "protein": 25,
  "carbs": 60,
  "fat": 15,
  "fiber": 8,
  "mealType": "breakfast|lunch|dinner|snack",
  "ingredients": [
    {
      "name": "Ingredient name",
      "quantity": 100,
      "unit": "g",
      "calories": 150,
      "protein": 10,
      "carbs": 20,
      "fat": 5
    }
  ]
}
</MEAL_SUGGESTION>

EXAMPLES OF CORRECT RESPONSES:
- User: "add apple to my journal" → "Here's a fresh apple for your journal!" + <FOOD_SUGGESTION>
- User: "suggest a healthy breakfast" → "Here's a nutritious breakfast option!" + <MEAL_SUGGESTION>
- User: "I want to eat chicken" → "Great choice! Here's some chicken for you." + <FOOD_SUGGESTION>
- User: "suggest ingredients for pasta" → "Here are some great pasta ingredients!" + multiple <FOOD_SUGGESTION> tags
- User: "recommend breakfast foods" → "Here are some healthy breakfast options!" + multiple <FOOD_SUGGESTION> tags
- User: "what should I eat for lunch" → "Here's a delicious lunch option!" + <MEAL_SUGGESTION> with multiple ingredients

For regular responses (not food/meal requests), provide normal text without the structured format.

Keep responses concise, practical, and actionable. You can suggest creating tasks, setting goals, or improving productivity habits.`;

router.post("/", async (req: AuthReq, res) => {
  try {
    const { message, useNutritionContext = false } = req.body;
    const userId = req.user!.id;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: "Message is required" });
    }

    const prisma = getPrisma();
    
    // Save user message to database
    await prisma.chatMessage.create({
      data: {
        userId,
        role: 'user',
        content: message
      }
    });

    // Get recent conversation history (last MAX_CONTEXT_MESSAGES messages)
    const recentMessages = await prisma.chatMessage.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: MAX_CONTEXT_MESSAGES
    });

    // Build conversation context
    const conversationHistory = recentMessages
      .reverse() // Put back in chronological order
      .map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }));

    // Add nutrition context if requested
    let nutritionContext = "";
    if (useNutritionContext) {
      try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const meals = await prisma.meal.findMany({
          where: {
            userId,
            loggedAt: {
              gte: thirtyDaysAgo,
            },
          },
          include: {
            food: true,
          },
          orderBy: {
            loggedAt: 'desc',
          },
        });

        const goals = await prisma.nutritionGoal.findUnique({
          where: { userId },
        });

        // Create safe nutrition context (no sensitive data)
        const dailyAverages = meals.reduce((acc, meal) => {
          acc.kcal += meal.food.kcal * meal.quantity;
          acc.protein += meal.food.protein * meal.quantity;
          acc.carbs += meal.food.carbs * meal.quantity;
          acc.fat += meal.food.fat * meal.quantity;
          return acc;
        }, { kcal: 0, protein: 0, carbs: 0, fat: 0 });

        const daysWithData = new Set(meals.map(m => m.loggedAt.toISOString().split('T')[0])).size;
        if (daysWithData > 0) {
          dailyAverages.kcal = Math.round(dailyAverages.kcal / daysWithData);
          dailyAverages.protein = Math.round(dailyAverages.protein / daysWithData);
          dailyAverages.carbs = Math.round(dailyAverages.carbs / daysWithData);
          dailyAverages.fat = Math.round(dailyAverages.fat / daysWithData);
        }

        nutritionContext = `Nutrition Context: User has logged ${meals.length} meals over the last 30 days across ${daysWithData} days. Average daily intake: ${dailyAverages.kcal} kcal, ${dailyAverages.protein}g protein, ${dailyAverages.carbs}g carbs, ${dailyAverages.fat}g fat. `;
        
        if (goals) {
          nutritionContext += `Nutrition goals: ${goals.targetKcal} kcal, ${goals.targetProtein}g protein, ${goals.targetCarbs}g carbs, ${goals.targetFat}g fat. `;
        }
      } catch (error) {
        console.error("Error fetching nutrition context:", error);
        // Continue without nutrition context if there's an error
      }
    }

    // Prepare messages for OpenAI
    const messages = [
      { role: 'system' as const, content: SYSTEM_PROMPT + (nutritionContext ? `\n\n${nutritionContext}` : '') },
      ...conversationHistory
    ];

    const openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY 
    });

    // Get AI response with retry functionality
    const completion = await retry(async () => {
      return await openai.chat.completions.create({
        model: "gpt-4o-mini", // Use the cheaper model
        messages,
        max_tokens: 500, // Limit response length
        temperature: 0.7
      });
    }, 3, 1000); // 3 retries with 1s initial delay

    const aiResponse = completion.choices[0].message.content;

    // Parse suggestions from the response
    const { cleanResponse, suggestions } = parseSuggestions(aiResponse || '');
    
    // Debug logging
    console.log('AI Response:', aiResponse);
    console.log('Parsed suggestions:', suggestions);
    console.log('Clean response:', cleanResponse);

    // Save clean AI response to database (without structured format)
    await prisma.chatMessage.create({
      data: {
        userId,
        role: 'assistant',
        content: cleanResponse || 'Sorry, I could not generate a response.'
      }
    });

    res.json({ 
      message: cleanResponse,
      suggestions,
      conversationId: Date.now() // Simple conversation identifier
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: "Failed to process chat message",
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get conversation history
router.get("/history", async (req: AuthReq, res) => {
  try {
    const userId = req.user!.id;
    const prisma = getPrisma();

    const messages = await prisma.chatMessage.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      take: 50 // Get last 50 messages
    });

    res.json({ messages });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
});

// Clear conversation history
router.delete("/history", async (req: AuthReq, res) => {
  try {
    const userId = req.user!.id;
    const prisma = getPrisma();

    await prisma.chatMessage.deleteMany({
      where: { userId }
    });

    res.json({ message: "Chat history cleared" });
  } catch (error) {
    console.error('Error clearing chat history:', error);
    res.status(500).json({ error: "Failed to clear chat history" });
  }
});

export default router;
