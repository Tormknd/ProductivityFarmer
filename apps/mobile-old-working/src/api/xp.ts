import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "./client";

export const useXP = () => {
  const api = useApi();
  return useQuery({ queryKey: ["xp"], queryFn: () => api.get("/xp").then(r => r.data) });
};

export const useAddXP = () => {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => api.post("/xp", body).then(r => r.data),
    onSuccess: () => qc.invalidateQueries(["xp"])
  });
};
