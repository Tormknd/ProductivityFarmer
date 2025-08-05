import { useMutation, useQuery } from "@tanstack/react-query";
import { useApi } from "./client";

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface NutritionSuggestion {
  type: 'meal' | 'food';
  data: {
    name: string;
    description: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    mealType?: string;
    servingSize?: string;
    ingredients?: Array<{
      name: string;
      quantity: number;
      unit: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    }>;
  };
}

export interface ChatResponse {
  message: string;
  suggestions: NutritionSuggestion[];
  conversationId: number;
}

export const useChat = () => {
  const api = useApi();
  return useMutation({
    mutationFn: (data: { message: string; useNutritionContext?: boolean }) => 
      api.post("/chat", data).then(r => r.data as ChatResponse),
    retry: 3, // Retry failed requests up to 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
};

export const useChatHistory = () => {
  const api = useApi();
  return useQuery({
    queryKey: ['chat-history'],
    queryFn: () => api.get("/chat/history").then(r => r.data.messages as ChatMessage[])
  });
};

export const useClearChatHistory = () => {
  const api = useApi();
  return useMutation({
    mutationFn: () => api.delete("/chat/history").then(r => r.data)
  });
}; 