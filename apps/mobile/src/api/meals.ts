import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "./client";
import { Meal } from "../types";

export const useMeals = () => {
  const api = useApi();
  return useQuery({ 
    queryKey: ["meals"], 
    queryFn: () => api.get("/meals").then(r => r.data as Meal[]) 
  });
};

export const useAddMeal = () => {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<Meal>) => api.post("/meals", body).then(r => r.data as Meal),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["meals"] })
  });
};

export const useDeleteMeal = () => {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/meals/${id}`).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["meals"] })
  });
}; 