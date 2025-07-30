import { View, Text, Pressable, Alert } from "react-native";
import { useCompleteTask, useDeleteTask } from "../api/tasks";
import { Task } from "../types";

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const completeTask = useCompleteTask();
  const deleteTask = useDeleteTask();

  const handleComplete = () => {
    if (!task.completed) {
      completeTask.mutate(task.id);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Task",
      `Are you sure you want to delete "${task.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteTask.mutate(task.id) }
      ]
    );
  };

  return (
    <View style={{ 
      marginBottom: 8, 
      padding: 16, 
      backgroundColor: '#1E1E1E', 
      borderRadius: 16,
      borderLeftWidth: 4,
      borderLeftColor: task.completed ? '#4CAF50' : '#FFD54F'
    }}>
      <Pressable onPress={handleComplete} style={{ flex: 1 }}>
        <Text style={{ 
          color: '#FFFFFF', 
          textDecorationLine: task.completed ? 'line-through' : 'none',
          opacity: task.completed ? 0.6 : 1,
          fontSize: 16
        }}>
          {task.title}
        </Text>
        {task.due && (
          <Text style={{ color: '#B0BEC5', fontSize: 12, marginTop: 4 }}>
            Due: {new Date(task.due).toLocaleDateString()}
          </Text>
        )}
        <Text style={{ color: '#FFD54F', fontSize: 12, marginTop: 4 }}>
          +{task.xpWeight} XP
        </Text>
      </Pressable>
      
      <Pressable 
        onPress={handleDelete}
        style={{
          position: 'absolute',
          right: 8,
          top: 8,
          backgroundColor: '#FF5252',
          borderRadius: 12,
          width: 24,
          height: 24,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' }}>×</Text>
      </Pressable>
    </View>
  );
} 