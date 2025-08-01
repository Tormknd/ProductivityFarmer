import { useMutation } from "@tanstack/react-query";
import { useApi } from "./client";
import { ChatMessage } from "../types";

export const useChat = () => {
  const api = useApi();
  return useMutation({
    mutationFn: (message: string) => 
      api.post("/chat", { message }).then(r => r.data as ChatMessage)
  });
}; 