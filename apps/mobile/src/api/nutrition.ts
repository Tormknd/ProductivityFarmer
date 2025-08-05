import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "./client";

export interface Food {
  id: string;
  name: string;
  barcode?: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  servingSize: string;
  isPublic: boolean;
  createdAt: string;
}

export interface Meal {
  id: string;
  userId: string;
  foodId: string;
  quantity: number;
  mealType: string;
  loggedAt: string;
  notes?: string;
  createdAt: string;
  food: Food;
}

export interface NutritionSummary {
  date: string;
  meals: Meal[];
  totals: {
    kcal: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number;
  };
  goals?: NutritionGoal;
}

export interface NutritionGoal {
  id: string;
  userId: string;
  targetKcal: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  targetFiber: number;
  createdAt: string;
  updatedAt: string;
}

export interface MonthlyNutritionData {
  dailyData: Array<{
    date: string;
    meals: Array<{
      id: string;
      foodName: string;
      quantity: number;
      mealType: string;
      loggedAt: string;
    }>;
    totals: {
      kcal: number;
      protein: number;
      carbs: number;
      fat: number;
      fiber: number;
      sugar: number;
      sodium: number;
    };
  }>;
  goals?: NutritionGoal;
}

// Get nutrition summary for a specific date
export const useNutritionSummary = (date: string) => {
  const api = useApi();
  return useQuery({
    queryKey: ['nutrition-summary', date],
    queryFn: () => api.get(`/nutrition/summary/${date}`).then(r => r.data as NutritionSummary),
    enabled: !!date,
  });
};

// Get monthly nutrition data
export const useMonthlyNutritionData = () => {
  const api = useApi();
  return useQuery({
    queryKey: ['monthly-nutrition'],
    queryFn: () => api.get("/nutrition/monthly-data").then(r => r.data as MonthlyNutritionData),
  });
};

// Add a meal
export const useAddMeal = () => {
  const api = useApi();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { foodId: string; quantity: number; mealType?: string; notes?: string }) =>
      api.post("/nutrition/meals", data).then(r => r.data as Meal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nutrition-summary'] });
      queryClient.invalidateQueries({ queryKey: ['monthly-nutrition'] });
    },
  });
};

// Delete a meal
export const useDeleteMeal = () => {
  const api = useApi();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (mealId: string) =>
      api.delete(`/nutrition/meals/${mealId}`).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nutrition-summary'] });
      queryClient.invalidateQueries({ queryKey: ['monthly-nutrition'] });
    },
  });
};

// Search foods
export const useSearchFoods = (query: string) => {
  const api = useApi();
  return useQuery({
    queryKey: ['foods-search', query],
    queryFn: () => api.get(`/nutrition/foods/search?q=${encodeURIComponent(query)}`).then(r => r.data as Food[]),
    enabled: !!query && query.length > 0,
  });
};

// Add a new food
export const useAddFood = () => {
  const api = useApi();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: {
      name: string;
      kcal: number;
      protein?: number;
      carbs?: number;
      fat?: number;
      fiber?: number;
      sugar?: number;
      sodium?: number;
      servingSize?: string;
    }) => api.post("/nutrition/foods", data).then(r => r.data as Food),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foods-search'] });
    },
  });
};

// Get nutrition goals
export const useNutritionGoals = () => {
  const api = useApi();
  return useQuery({
    queryKey: ['nutrition-goals'],
    queryFn: () => api.get("/nutrition/goals").then(r => r.data as NutritionGoal),
  });
};

// Update nutrition goals
export const useUpdateNutritionGoals = () => {
  const api = useApi();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: {
      targetKcal?: number;
      targetProtein?: number;
      targetCarbs?: number;
      targetFat?: number;
      targetFiber?: number;
    }) => api.put("/nutrition/goals", data).then(r => r.data as NutritionGoal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nutrition-goals'] });
      queryClient.invalidateQueries({ queryKey: ['monthly-nutrition'] });
    },
  });
}; 