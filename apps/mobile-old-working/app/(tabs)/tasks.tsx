import { FlatList, View } from "react-native";
import TaskItem from "@components/TaskItem";
import { useTasks } from "@api/tasks";

export default function Tasks() {
  const { data: tasks = [] } = useTasks();
  return (
    <FlatList
      className="flex-1 bg-[#121212] p-4"
      data={tasks}
      keyExtractor={(t) => t.id}
      renderItem={({ item }) => <TaskItem task={item} />}
    />
  );
}
