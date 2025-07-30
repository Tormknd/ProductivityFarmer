import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "./client";
import { XPLog } from "../types";
import { User } from "../types";

export const useUser = () => {
  const api = useApi();
  return useQuery({ 
    queryKey: ["user"], 
    queryFn: () => api.get("/auth/me").then(r => r.data as User) 
  });
};

export const useXP = () => {
  const api = useApi();
  return useQuery({ 
    queryKey: ["xp"], 
    queryFn: () => api.get("/xp").then(r => r.data) 
  });
};

export const useXPLogs = () => {
  const api = useApi();
  return useQuery({ 
    queryKey: ["xp", "logs"], 
    queryFn: () => api.get("/xp/logs").then(r => r.data as XPLog[]) 
  });
};

export const useAddXP = () => {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { amount: number; reason: string }) => 
      api.post("/xp", body).then(r => r.data as XPLog),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["xp"] });
      qc.invalidateQueries({ queryKey: ["xp", "logs"] });
    }
  });
}; 