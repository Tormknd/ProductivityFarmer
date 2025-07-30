import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useTasks, useAddTask } from '../../src/api/tasks';
import TaskItem from '../../src/components/TaskItem';

export default function Tasks() {
  const { data: tasks, isLoading, error } = useTasks();
  const addTask = useAddTask();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [loadingDots, setLoadingDots] = useState('');

  // Animated loading dots
  useEffect(() => {
    if (!isLoading) return;
    
    const interval = setInterval(() => {
      setLoadingDots(prev => {
        if (prev === '') return '.';
        if (prev === '.') return '..';
        if (prev === '..') return '...';
        return '';
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isLoading]);

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    setIsAdding(true);
    try {
      await addTask.mutateAsync({
        title: newTaskTitle.trim(),
        xpWeight: 10, // Default XP weight
        completed: false
      });
      setNewTaskTitle('');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to add task');
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#121212', padding: 20, justifyContent: 'center' }}>
        <Text style={{ color: '#FFD54F', fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>
          Loading tasks{loadingDots}
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, backgroundColor: '#121212', padding: 20, justifyContent: 'center' }}>
        <Text style={{ color: '#FF5252', fontSize: 18, textAlign: 'center' }}>
          Error loading tasks: {error.message}
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#121212' }}>
      <View style={{ padding: 20, paddingBottom: 10 }}>
        <Text style={{ color: '#FFD54F', fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
          Tasks
        </Text>
        
        {/* Add Task Input */}
        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          <TextInput
            style={{
              flex: 1,
              backgroundColor: '#1E1E1E',
              color: '#FFFFFF',
              padding: 12,
              borderRadius: 8,
              marginRight: 10,
              fontSize: 16
            }}
            placeholder="Add a new task..."
            placeholderTextColor="#B0BEC5"
            value={newTaskTitle}
            onChangeText={setNewTaskTitle}
            onSubmitEditing={handleAddTask}
          />
          <TouchableOpacity
            onPress={handleAddTask}
            disabled={isAdding || !newTaskTitle.trim()}
            style={{
              backgroundColor: isAdding || !newTaskTitle.trim() ? '#666' : '#FFD54F',
              padding: 12,
              borderRadius: 8,
              justifyContent: 'center'
            }}
          >
            <Text style={{ 
              color: isAdding || !newTaskTitle.trim() ? '#999' : '#121212', 
              fontWeight: 'bold' 
            }}>
              {isAdding ? '...' : '+'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tasks List */}
      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
        {tasks && tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))
        ) : (
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <Text style={{ color: '#B0BEC5', fontSize: 16, textAlign: 'center' }}>
              No tasks yet. Add your first task above!
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
} 