import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "./client";

export const useTasks = () => {
  const api = useApi();
  return useQuery({ queryKey: ["tasks"], queryFn: () => api.get("/tasks").then(r => r.data) });
};

export const useAddTask = () => {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => api.post("/tasks", body).then(r => r.data),
    onSuccess: () => qc.invalidateQueries(["tasks"])
  });
};
