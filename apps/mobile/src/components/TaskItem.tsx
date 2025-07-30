import { View, Text, Pressable, Alert } from "react-native";
import { useCompleteTask, useDeleteTask } from "../api/tasks";
import { Task } from "../types";

// Helper function to get importance color
const getImportanceColor = (importance: string) => {
  switch (importance) {
    case 'Low': return '#4CAF50';
    case 'Medium': return '#FFD54F';
    case 'High': return '#FF9800';
    case 'Critical': return '#F44336';
    case 'Epic': return '#9C27B0';
    default: return '#FFD54F';
  }
};

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
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
          <Text style={{ color: '#FFD54F', fontSize: 12, marginRight: 8 }}>
            +{task.xpWeight} XP
          </Text>
          {task.importance && (
            <View style={{
              backgroundColor: getImportanceColor(task.importance) + '20',
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: getImportanceColor(task.importance),
            }}>
              <Text style={{ 
                color: getImportanceColor(task.importance), 
                fontSize: 10, 
                fontWeight: 'bold',
              }}>
                {task.importance}
              </Text>
            </View>
          )}
        </View>
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