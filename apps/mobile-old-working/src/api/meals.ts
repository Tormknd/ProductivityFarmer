import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "./client";

export const useMeals = () => {
  const api = useApi();
  return useQuery({ queryKey: ["meals"], queryFn: () => api.get("/meals").then(r => r.data) });
};

export const useAddMeal = () => {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => api.post("/meals", body).then(r => r.data),
    onSuccess: () => qc.invalidateQueries(["meals"])
  });
};
