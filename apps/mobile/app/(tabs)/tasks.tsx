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
    xpWeight: 10,
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



  // Animate progress bar when XP changes (JS driver only)
  useEffect(() => {
    const targetProgress = (newTask.xpWeight / 50) * 100;
    
    Animated.timing(progressWidth, {
      toValue: targetProgress,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [newTask.xpWeight]);

  // Animate container scale when XP changes (native driver only)
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
  }, [newTask.xpWeight]);

  const handleAddTask = async () => {
    if (!newTask.title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    setIsAdding(true);
    try {
      await addTask.mutateAsync({
        title: newTask.title.trim(),
        xpWeight: newTask.xpWeight,
        due: newTask.due,
        completed: false
      });
      setNewTask({ title: '', xpWeight: 10, due: undefined });
      setIsModalVisible(false);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to add task');
    } finally {
      setIsAdding(false);
    }
  };

  const resetForm = () => {
    setNewTask({ title: '', xpWeight: 10, due: undefined });
    setIsModalVisible(false);
  };

  const clearDueDate = () => {
    setNewTask({ ...newTask, due: undefined });
  };

  const getXPLabel = (xp: number) => {
    if (xp <= 5) return 'Easy';
    if (xp <= 15) return 'Normal';
    if (xp <= 25) return 'Hard';
    if (xp <= 40) return 'Very Hard';
    return 'Epic';
  };

  const getXPColor = (xp: number) => {
    if (xp <= 5) return '#4CAF50';
    if (xp <= 15) return '#FFD54F';
    if (xp <= 25) return '#FF9800';
    if (xp <= 40) return '#F44336';
    return '#9C27B0';
  };

  const getXPIcon = (xp: number) => {
    if (xp <= 5) return '🌱';
    if (xp <= 15) return '⚡';
    if (xp <= 25) return '🔥';
    if (xp <= 40) return '💎';
    return '👑';
  };

  const getXPSound = (xp: number) => {
    if (xp <= 5) return 'Ping!';
    if (xp <= 15) return 'Zap!';
    if (xp <= 25) return 'Boom!';
    if (xp <= 40) return 'Crystal!';
    return 'LEGENDARY!';
  };

  const handleXPChange = (newXP: number) => {
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

    setNewTask({ ...newTask, xpWeight: newXP });
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

            {/* XP Weight - Animated */}
            <View style={{ marginBottom: 24 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <MMORPGIcon name={ICON_NAMES.SWORD} size={20} color="#FFD54F" style={{ marginRight: 8 }} />
                <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>
                  Task Difficulty
                </Text>
              </View>
              
              {/* XP Display - Animated */}
              <Animated.View 
                style={{ 
                  backgroundColor: '#1E1E1E', 
                  padding: 16, 
                  borderRadius: 16, 
                  borderWidth: 2, 
                  borderColor: getXPColor(newTask.xpWeight),
                  marginBottom: 12,
                  transform: [{ scale: containerScale }],
                  shadowColor: getXPColor(newTask.xpWeight),
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MMORPGIcon name={ICON_NAMES.XP} size={24} color={getXPColor(newTask.xpWeight)} style={{ marginRight: 8 }} />
                    <View>
                      <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' }}>
                        {newTask.xpWeight} XP
                      </Text>
                      <Text style={{ color: '#B0BEC5', fontSize: 12 }}>
                        {getXPSound(newTask.xpWeight)}
                      </Text>
                    </View>
                  </View>
                  <View style={{
                    backgroundColor: getXPColor(newTask.xpWeight) + '20',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: getXPColor(newTask.xpWeight),
                  }}>
                    <Text style={{ 
                      color: getXPColor(newTask.xpWeight), 
                      fontSize: 14, 
                      fontWeight: 'bold',
                    }}>
                      {getXPLabel(newTask.xpWeight)}
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
                      backgroundColor: getXPColor(newTask.xpWeight),
                      borderRadius: 6,
                      shadowColor: getXPColor(newTask.xpWeight),
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.5,
                      shadowRadius: 4,
                      elevation: 4,
                    }} 
                  />
                  

                </View>
                
                {/* Level indicators */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                  {[5, 15, 25, 40, 50].map((level) => (
                    <View key={level} style={{ alignItems: 'center' }}>
                      <View style={{
                        width: 4,
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: newTask.xpWeight >= level ? getXPColor(newTask.xpWeight) : '#2A2A2A',
                      }} />
                      <Text style={{ 
                        color: newTask.xpWeight >= level ? getXPColor(newTask.xpWeight) : '#666', 
                        fontSize: 8, 
                        marginTop: 2 
                      }}>
                        {level}
                      </Text>
                    </View>
                  ))}
                </View>
              </Animated.View>

              {/* Quick XP Buttons - Animated */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                {[5, 10, 15, 25, 40].map((xp) => (
                  <Animated.View
                    key={xp}
                    style={{
                      transform: [{ scale: buttonScale }]
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => handleXPChange(xp)}
                      style={{
                        backgroundColor: newTask.xpWeight === xp ? getXPColor(xp) : '#2A2A2A',
                        paddingHorizontal: 12,
                        paddingVertical: 10,
                        borderRadius: 12,
                        minWidth: 50,
                        alignItems: 'center',
                        borderWidth: 2,
                        borderColor: newTask.xpWeight === xp ? getXPColor(xp) : 'transparent',
                        shadowColor: newTask.xpWeight === xp ? getXPColor(xp) : 'transparent',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: newTask.xpWeight === xp ? 0.3 : 0,
                        shadowRadius: 4,
                        elevation: newTask.xpWeight === xp ? 4 : 0,
                      }}
                    >
                      <Text style={{ 
                        color: newTask.xpWeight === xp ? '#FFFFFF' : '#B0BEC5', 
                        fontSize: 14, 
                        fontWeight: 'bold' 
                      }}>
                        {xp}
                      </Text>
                      <MMORPGIcon 
                        name={ICON_NAMES.XP} 
                        size={12} 
                        color={newTask.xpWeight === xp ? '#FFFFFF' : '#666'} 
                        style={{ marginTop: 2 }} 
                      />
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