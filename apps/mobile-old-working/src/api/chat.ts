import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "./client";

export const useChat = () => {
  const api = useApi();
  return useQuery({ queryKey: ["chat"], queryFn: () => api.get("/chat").then(r => r.data) });
};

export const useSendMessage = () => {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => api.post("/chat", body).then(r => r.data),
    onSuccess: () => qc.invalidateQueries(["chat"])
  });
};
