import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "./client";

export const useFoods = () => {
  const api = useApi();
  return useQuery({ queryKey: ["foods"], queryFn: () => api.get("/foods").then(r => r.data) });
};

export const useAddFood = () => {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => api.post("/foods", body).then(r => r.data),
    onSuccess: () => qc.invalidateQueries(["foods"])
  });
};
