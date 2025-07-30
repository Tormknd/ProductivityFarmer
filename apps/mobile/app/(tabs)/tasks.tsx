import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Modal, Animated } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { useTasks, useAddTask } from '../../src/api/tasks';
import TaskItem from '../../src/components/TaskItem';
import CustomCalendar from '../../src/components/CustomCalendar';
import MMORPGIcon, { ICON_NAMES } from '../../src/components/MMORPGIcons';

export default function Tasks() {
  const { data: tasks, isLoading, error } = useTasks();
  const addTask = useAddTask();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    importance: 'Medium' as string,
    due: undefined as Date | undefined
  });
  const [isAdding, setIsAdding] = useState(false);
  const [loadingDots, setLoadingDots] = useState('');

  // Animation refs - Separate values for different driver types
  const progressWidth = useRef(new Animated.Value(0)).current; // JS driver only
  const containerScale = useRef(new Animated.Value(1)).current; // Native driver only
  const buttonScale = useRef(new Animated.Value(1)).current; // Native driver only

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



  // Animate progress bar when importance changes (JS driver only)
  useEffect(() => {
    const xpValue = getImportanceXP(newTask.importance);
    const targetProgress = (xpValue / 50) * 100;
    
    Animated.timing(progressWidth, {
      toValue: targetProgress,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [newTask.importance]);

  // Animate container scale when importance changes (native driver only)
  useEffect(() => {
    Animated.sequence([
      Animated.timing(containerScale, {
        toValue: 1.02,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(containerScale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [newTask.importance]);

  const handleAddTask = async () => {
    if (!newTask.title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    setIsAdding(true);
    try {
      await addTask.mutateAsync({
        title: newTask.title.trim(),
        importance: newTask.importance,
        due: newTask.due,
        completed: false
      });
      setNewTask({ title: '', importance: 'Medium', due: undefined });
      setIsModalVisible(false);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to add task');
    } finally {
      setIsAdding(false);
    }
  };

  const resetForm = () => {
    setNewTask({ title: '', importance: 'Medium', due: undefined });
    setIsModalVisible(false);
  };

  const clearDueDate = () => {
    setNewTask({ ...newTask, due: undefined });
  };

  const getImportanceLabel = (importance: string) => {
    switch (importance) {
      case 'Low': return 'Low';
      case 'Medium': return 'Medium';
      case 'High': return 'High';
      case 'Critical': return 'Critical';
      case 'Epic': return 'Epic';
      default: return 'Medium';
    }
  };

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

  const getImportanceIcon = (importance: string) => {
    switch (importance) {
      case 'Low': return ICON_NAMES.EASY;
      case 'Medium': return ICON_NAMES.MEDIUM;
      case 'High': return ICON_NAMES.HARD;
      case 'Critical': return ICON_NAMES.EPIC;
      case 'Epic': return ICON_NAMES.LEGENDARY;
      default: return ICON_NAMES.MEDIUM;
    }
  };

  const getImportanceXP = (importance: string) => {
    switch (importance) {
      case 'Low': return 5;
      case 'Medium': return 10;
      case 'High': return 15;
      case 'Critical': return 25;
      case 'Epic': return 40;
      default: return 10;
    }
  };

  const handleImportanceChange = (newImportance: string) => {
    // Animate button press
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setNewTask({ ...newTask, importance: newImportance });
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
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <Text style={{ color: '#FFD54F', fontSize: 24, fontWeight: 'bold' }}>
            Tasks
          </Text>
          <TouchableOpacity
            onPress={() => setIsModalVisible(true)}
            style={{
              backgroundColor: '#FFD54F',
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <Text style={{ color: '#121212', fontSize: 16, fontWeight: 'bold', marginRight: 4 }}>
              +
            </Text>
            <Text style={{ color: '#121212', fontSize: 14, fontWeight: 'bold' }}>
              New Task
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
              No tasks yet. Create your first task!
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Task Creation Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={resetForm}
      >
        <View style={{ flex: 1, backgroundColor: '#121212' }}>
          {/* Header */}
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: '#2A2A2A'
          }}>
            <Text style={{ color: '#FFD54F', fontSize: 24, fontWeight: 'bold' }}>
              Create New Task
            </Text>
            <TouchableOpacity onPress={resetForm}>
              <Text style={{ color: '#B0BEC5', fontSize: 18 }}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <ScrollView style={{ flex: 1, padding: 20 }}>
            {/* Task Title */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
                Task Title *
              </Text>
              <TextInput
                style={{
                  backgroundColor: '#1E1E1E',
                  color: '#FFFFFF',
                  padding: 16,
                  borderRadius: 12,
                  fontSize: 16,
                  borderWidth: 1,
                  borderColor: '#2A2A2A'
                }}
                placeholder="What needs to be done?"
                placeholderTextColor="#B0BEC5"
                value={newTask.title}
                onChangeText={(text) => setNewTask({ ...newTask, title: text })}
                autoFocus
              />
            </View>

            {/* Task Importance - Animated */}
            <View style={{ marginBottom: 24 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <MMORPGIcon name={ICON_NAMES.SWORD} size={20} color="#FFD54F" style={{ marginRight: 8 }} />
                <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>
                  Task Importance
                </Text>
              </View>
              
              {/* Importance Display - Animated */}
              <Animated.View 
                style={{ 
                  backgroundColor: '#1E1E1E', 
                  padding: 16, 
                  borderRadius: 16, 
                  borderWidth: 2, 
                  borderColor: getImportanceColor(newTask.importance),
                  marginBottom: 12,
                  transform: [{ scale: containerScale }],
                  shadowColor: getImportanceColor(newTask.importance),
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MMORPGIcon name={getImportanceIcon(newTask.importance)} size={24} color={getImportanceColor(newTask.importance)} style={{ marginRight: 8 }} />
                    <View>
                      <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' }}>
                        {getImportanceXP(newTask.importance)} XP
                      </Text>
                      <Text style={{ color: '#B0BEC5', fontSize: 12 }}>
                        {getImportanceLabel(newTask.importance)} Priority
                      </Text>
                    </View>
                  </View>
                  <View style={{
                    backgroundColor: getImportanceColor(newTask.importance) + '20',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: getImportanceColor(newTask.importance),
                  }}>
                    <Text style={{ 
                      color: getImportanceColor(newTask.importance), 
                      fontSize: 14, 
                      fontWeight: 'bold',
                    }}>
                      {getImportanceLabel(newTask.importance)}
                    </Text>
                  </View>
                </View>
                
                {/* Animated Progress Bar */}
                <View style={{ 
                  height: 12, 
                  backgroundColor: '#2A2A2A', 
                  borderRadius: 6, 
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  {/* Background gradient */}
                  <View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: 6,
                    backgroundColor: '#1A1A1A',
                  }} />
                  
                  {/* Animated progress */}
                  <Animated.View 
                    style={{ 
                      width: progressWidth.interpolate({
                        inputRange: [0, 100],
                        outputRange: ['0%', '100%'],
                      }),
                      height: '100%', 
                      backgroundColor: getImportanceColor(newTask.importance),
                      borderRadius: 6,
                      shadowColor: getImportanceColor(newTask.importance),
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.5,
                      shadowRadius: 4,
                      elevation: 4,
                    }} 
                  />
                </View>
                
                {/* XP Level indicators */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                  {[5, 15, 25, 40, 50].map((level) => (
                    <View key={level} style={{ alignItems: 'center' }}>
                      <View style={{
                        width: 4,
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: getImportanceXP(newTask.importance) >= level ? getImportanceColor(newTask.importance) : '#2A2A2A',
                      }} />
                      <Text style={{ 
                        color: getImportanceXP(newTask.importance) >= level ? getImportanceColor(newTask.importance) : '#666', 
                        fontSize: 8, 
                        marginTop: 2 
                      }}>
                        {level}
                      </Text>
                    </View>
                  ))}
                </View>
              </Animated.View>

              {/* Quick Importance Buttons - Animated */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                {['Low', 'Medium', 'High', 'Critical', 'Epic'].map((importance) => (
                  <Animated.View
                    key={importance}
                    style={{
                      transform: [{ scale: buttonScale }]
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => handleImportanceChange(importance)}
                      style={{
                        backgroundColor: newTask.importance === importance ? getImportanceColor(importance) : '#2A2A2A',
                        paddingHorizontal: 12,
                        paddingVertical: 10,
                        borderRadius: 12,
                        minWidth: 50,
                        alignItems: 'center',
                        borderWidth: 2,
                        borderColor: newTask.importance === importance ? getImportanceColor(importance) : 'transparent',
                        shadowColor: newTask.importance === importance ? getImportanceColor(importance) : 'transparent',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: newTask.importance === importance ? 0.3 : 0,
                        shadowRadius: 4,
                        elevation: newTask.importance === importance ? 4 : 0,
                      }}
                    >
                      <MMORPGIcon 
                        name={getImportanceIcon(importance)} 
                        size={16} 
                        color={newTask.importance === importance ? '#FFFFFF' : '#666'} 
                        style={{ marginBottom: 2 }} 
                      />
                      <Text style={{ 
                        color: newTask.importance === importance ? '#FFFFFF' : '#B0BEC5', 
                        fontSize: 10, 
                        fontWeight: 'bold',
                        textAlign: 'center'
                      }}>
                        {importance}
                      </Text>
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </View>
            </View>

            {/* Due Date */}
            <View style={{ marginBottom: 24 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <MMORPGIcon name={ICON_NAMES.DEADLINE} size={20} color="#FFD54F" style={{ marginRight: 8 }} />
                <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>
                  Due Date
                </Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  style={{
                    backgroundColor: '#1E1E1E',
                    padding: 16,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: '#2A2A2A',
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Text style={{ color: newTask.due ? '#FFFFFF' : '#B0BEC5', fontSize: 16 }}>
                    {newTask.due ? newTask.due.toLocaleDateString() : 'Set due date'}
                  </Text>
                  <Text style={{ color: '#FFD54F', fontSize: 16 }}>📅</Text>
                </TouchableOpacity>
                
                {newTask.due && (
                  <TouchableOpacity
                    onPress={clearDueDate}
                    style={{
                      backgroundColor: '#FF5252',
                      padding: 16,
                      borderRadius: 12,
                      justifyContent: 'center',
                      alignItems: 'center',
                      minWidth: 50
                    }}
                  >
                    <Text style={{ color: '#FFFFFF', fontSize: 16 }}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>
              
              {/* Quick Date Options */}
              {!newTask.due && (
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                  {[
                    { label: 'Today', days: 0 },
                    { label: 'Tomorrow', days: 1 },
                    { label: 'This Week', days: 7 }
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.label}
                      onPress={() => {
                        const date = new Date();
                        date.setDate(date.getDate() + option.days);
                        setNewTask({ ...newTask, due: date });
                      }}
                      style={{
                        backgroundColor: '#2A2A2A',
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 8
                      }}
                    >
                      <Text style={{ color: '#B0BEC5', fontSize: 12 }}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Create Button */}
            <TouchableOpacity
              onPress={handleAddTask}
              disabled={isAdding || !newTask.title.trim()}
              style={{
                backgroundColor: isAdding || !newTask.title.trim() ? '#666' : '#FFD54F',
                padding: 16,
                borderRadius: 12,
                alignItems: 'center',
                marginTop: 20
              }}
            >
              <Text style={{ 
                color: isAdding || !newTask.title.trim() ? '#999' : '#121212', 
                fontSize: 16,
                fontWeight: 'bold' 
              }}>
                {isAdding ? 'Creating Task...' : 'Create Task'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Custom Date Picker */}
      <CustomCalendar
        value={newTask.due}
        onDateChange={(date: Date) => setNewTask({ ...newTask, due: date })}
        onClose={() => setShowDatePicker(false)}
        visible={showDatePicker}
      />
    </View>
  );
} 