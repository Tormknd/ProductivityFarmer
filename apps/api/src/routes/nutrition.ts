import { Router } from "express";
import auth, { AuthReq } from "../middleware/auth";
import { getPrisma } from "../index";

const router = Router();
router.use(auth);

// Get user's nutrition summary for a specific date
router.get("/summary/:date", async (req: AuthReq, res) => {
  try {
    const userId = req.user!.id;
    const date = new Date(req.params.date);
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const prisma = getPrisma();

    // Get meals for the day
    const meals = await prisma.meal.findMany({
      where: {
        userId,
        loggedAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        food: true,
      },
    });

    // Calculate totals
    const totals = meals.reduce(
      (acc, meal) => ({
        kcal: acc.kcal + (meal.food.kcal * meal.quantity),
        protein: acc.protein + (meal.food.protein * meal.quantity),
        carbs: acc.carbs + (meal.food.carbs * meal.quantity),
        fat: acc.fat + (meal.food.fat * meal.quantity),
        fiber: acc.fiber + (meal.food.fiber * meal.quantity),
        sugar: acc.sugar + (meal.food.sugar * meal.quantity),
        sodium: acc.sodium + (meal.food.sodium * meal.quantity),
      }),
      { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 }
    );

    // Get user's nutrition goals
    const goals = await prisma.nutritionGoal.findUnique({
      where: { userId },
    });

    res.json({
      date: req.params.date,
      meals,
      totals,
      goals,
    });
  } catch (error) {
    console.error("Error fetching nutrition summary:", error);
    res.status(500).json({ error: "Failed to fetch nutrition summary" });
  }
});

// Get user's nutrition data for the last 30 days (for AI context)
router.get("/monthly-data", async (req: AuthReq, res) => {
  try {
    const userId = req.user!.id;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const prisma = getPrisma();

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

    // Group by date and calculate daily totals
    const dailyData = meals.reduce((acc, meal) => {
      const date = meal.loggedAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = {
          date,
          meals: [],
          totals: { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 },
        };
      }
      
      acc[date].meals.push({
        id: meal.id,
        foodName: meal.food.name,
        quantity: meal.quantity,
        mealType: meal.mealType,
        loggedAt: meal.loggedAt,
      });
      
      acc[date].totals.kcal += meal.food.kcal * meal.quantity;
      acc[date].totals.protein += meal.food.protein * meal.quantity;
      acc[date].totals.carbs += meal.food.carbs * meal.quantity;
      acc[date].totals.fat += meal.food.fat * meal.quantity;
      acc[date].totals.fiber += meal.food.fiber * meal.quantity;
      acc[date].totals.sugar += meal.food.sugar * meal.quantity;
      acc[date].totals.sodium += meal.food.sodium * meal.quantity;
      
      return acc;
    }, {} as Record<string, any>);

    // Get user's nutrition goals
    const goals = await prisma.nutritionGoal.findUnique({
      where: { userId },
    });

    res.json({
      dailyData: Object.values(dailyData),
      goals,
    });
  } catch (error) {
    console.error("Error fetching monthly nutrition data:", error);
    res.status(500).json({ error: "Failed to fetch monthly nutrition data" });
  }
});

// Add a meal
router.post("/meals", async (req: AuthReq, res) => {
  try {
    const userId = req.user!.id;
    const { foodId, quantity, mealType, notes } = req.body;

    if (!foodId || !quantity) {
      return res.status(400).json({ error: "Food ID and quantity are required" });
    }

    const prisma = getPrisma();

    const meal = await prisma.meal.create({
      data: {
        userId,
        foodId,
        quantity: parseFloat(quantity),
        mealType: mealType || "snack",
        notes,
      },
      include: {
        food: true,
      },
    });

    res.json(meal);
  } catch (error) {
    console.error("Error adding meal:", error);
    res.status(500).json({ error: "Failed to add meal" });
  }
});

// Delete a meal
router.delete("/meals/:id", async (req: AuthReq, res) => {
  try {
    const userId = req.user!.id;
    const mealId = req.params.id;

    const prisma = getPrisma();

    const meal = await prisma.meal.findFirst({
      where: {
        id: mealId,
        userId,
      },
    });

    if (!meal) {
      return res.status(404).json({ error: "Meal not found" });
    }

    await prisma.meal.delete({
      where: { id: mealId },
    });

    res.json({ message: "Meal deleted successfully" });
  } catch (error) {
    console.error("Error deleting meal:", error);
    res.status(500).json({ error: "Failed to delete meal" });
  }
});

// Search foods
router.get("/foods/search", async (req: AuthReq, res) => {
  try {
    const userId = req.user!.id;
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: "Search query is required" });
    }

    const prisma = getPrisma();

    const foods = await prisma.food.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { isPublic: true },
          { ownerId: userId },
        ],
      },
      take: 20,
    });

    res.json(foods);
  } catch (error) {
    console.error("Error searching foods:", error);
    res.status(500).json({ error: "Failed to search foods" });
  }
});

// Add a new food
router.post("/foods", async (req: AuthReq, res) => {
  try {
    const userId = req.user!.id;
    const { name, kcal, protein, carbs, fat, fiber, sugar, sodium, servingSize } = req.body;

    if (!name || !kcal) {
      return res.status(400).json({ error: "Name and calories are required" });
    }

    const prisma = getPrisma();

    const food = await prisma.food.create({
      data: {
        name,
        kcal: parseInt(kcal),
        protein: parseFloat(protein || 0),
        carbs: parseFloat(carbs || 0),
        fat: parseFloat(fat || 0),
        fiber: parseFloat(fiber || 0),
        sugar: parseFloat(sugar || 0),
        sodium: parseFloat(sodium || 0),
        servingSize: servingSize || "100g",
        ownerId: userId,
      },
    });

    res.json(food);
  } catch (error) {
    console.error("Error adding food:", error);
    res.status(500).json({ error: "Failed to add food" });
  }
});

// Get or create nutrition goals
router.get("/goals", async (req: AuthReq, res) => {
  try {
    const userId = req.user!.id;
    const prisma = getPrisma();

    let goals = await prisma.nutritionGoal.findUnique({
      where: { userId },
    });

    if (!goals) {
      goals = await prisma.nutritionGoal.create({
        data: {
          userId,
          targetKcal: 2000,
          targetProtein: 150,
          targetCarbs: 250,
          targetFat: 65,
          targetFiber: 25,
        },
      });
    }

    res.json(goals);
  } catch (error) {
    console.error("Error fetching nutrition goals:", error);
    res.status(500).json({ error: "Failed to fetch nutrition goals" });
  }
});

// Update nutrition goals
router.put("/goals", async (req: AuthReq, res) => {
  try {
    const userId = req.user!.id;
    const { targetKcal, targetProtein, targetCarbs, targetFat, targetFiber } = req.body;

    const prisma = getPrisma();

    const goals = await prisma.nutritionGoal.upsert({
      where: { userId },
      update: {
        targetKcal: targetKcal ? parseInt(targetKcal) : undefined,
        targetProtein: targetProtein ? parseFloat(targetProtein) : undefined,
        targetCarbs: targetCarbs ? parseFloat(targetCarbs) : undefined,
        targetFat: targetFat ? parseFloat(targetFat) : undefined,
        targetFiber: targetFiber ? parseFloat(targetFiber) : undefined,
      },
      create: {
        userId,
        targetKcal: targetKcal ? parseInt(targetKcal) : 2000,
        targetProtein: targetProtein ? parseFloat(targetProtein) : 150,
        targetCarbs: targetCarbs ? parseFloat(targetCarbs) : 250,
        targetFat: targetFat ? parseFloat(targetFat) : 65,
        targetFiber: targetFiber ? parseFloat(targetFiber) : 25,
      },
    });

    res.json(goals);
  } catch (error) {
    console.error("Error updating nutrition goals:", error);
    res.status(500).json({ error: "Failed to update nutrition goals" });
  }
});

export default router; 