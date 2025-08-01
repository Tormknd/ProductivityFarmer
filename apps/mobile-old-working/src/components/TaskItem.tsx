import { View, Text, Pressable } from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@api/client";

export default function TaskItem({ task }) {
  const api = useApi();
  const qc = useQueryClient();
  const complete = useMutation({
    mutationFn: () => api.put(`/tasks/${task.id}/complete`).then(r => r.data),
    onSuccess: () => qc.invalidateQueries(["tasks"])
  });

  return (
    <Pressable onPress={() => complete.mutate()} className="mb-2 p-4 bg-[#1E1E1E] rounded-2xl">
      <Text className={`text-white ${task.completed ? "line-through" : ""}`}>{task.title}</Text>
    </Pressable>
  );
}
