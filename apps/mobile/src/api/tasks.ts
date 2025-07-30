import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "./client";
import { Task } from "../types";

export const useTasks = () => {
  const api = useApi();
  return useQuery({ 
    queryKey: ["tasks"], 
    queryFn: () => api.get("/tasks").then(r => r.data as Task[]) 
  });
};

export const useAddTask = () => {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<Task>) => api.post("/tasks", body).then(r => r.data as Task),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] })
  });
};

export const useUpdateTask = () => {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string } & Partial<Task>) => 
      api.put(`/tasks/${id}`, body).then(r => r.data as Task),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] })
  });
};

export const useCompleteTask = () => {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.put(`/tasks/${id}/complete`).then(r => r.data as Task),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: ["user"] }); // Refresh user XP
    }
  });
};

export const useDeleteTask = () => {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/tasks/${id}`).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] })
  });
}; 