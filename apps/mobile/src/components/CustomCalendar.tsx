import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Animated, ScrollView } from 'react-native';
import MMORPGIcon, { ICON_NAMES } from './MMORPGIcons';

interface CustomCalendarProps {
  value?: Date;
  onDateChange: (date: Date) => void;
  onClose: () => void;
  visible: boolean;
}

export default function CustomCalendar({ value, onDateChange, onClose, visible }: CustomCalendarProps) {
  const [selectedDate, setSelectedDate] = useState(value || new Date());
  const [currentMonth, setCurrentMonth] = useState(value || new Date());
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleConfirm = () => {
    onDateChange(selectedDate);
    onClose();
  };

  const handleCancel = () => {
    setSelectedDate(value || new Date());
    onClose();
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    // Ensure we have exactly 42 cells (6 rows × 7 days) for consistent grid
    while (days.length < 42) {
      days.push(null);
    }
    
    return days;
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const changeMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const handleDateSelect = (date: Date) => {
    if (!isPastDate(date)) {
      setSelectedDate(date);
    }
  };

  const getQuickDates = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const thisWeek = new Date(today);
    thisWeek.setDate(thisWeek.getDate() + 7);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 14);

    return [
      { label: 'Today', date: today, icon: ICON_NAMES.TODAY },
      { label: 'Tomorrow', date: tomorrow, icon: ICON_NAMES.TOMORROW },
      { label: 'This Week', date: thisWeek, icon: ICON_NAMES.THIS_WEEK },
      { label: 'Next Week', date: nextWeek, icon: ICON_NAMES.NEXT_WEEK },
    ];
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const days = getDaysInMonth(currentMonth);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleCancel}
    >
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: fadeAnim,
        }}
      >
        <TouchableOpacity
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          onPress={handleCancel}
          activeOpacity={1}
        />
        
        <Animated.View
          style={{
            backgroundColor: '#1E1E1E',
            borderRadius: 20,
            padding: 24,
            width: '95%',
            maxWidth: 400,
            transform: [{
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [100, 0],
              })
            }],
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 10,
          }}
        >
                     {/* Header */}
           <View style={{ 
             flexDirection: 'row', 
             justifyContent: 'space-between', 
             alignItems: 'center',
             marginBottom: 20,
             paddingBottom: 16,
             borderBottomWidth: 1,
             borderBottomColor: '#2A2A2A'
           }}>
             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
               <MMORPGIcon name={ICON_NAMES.CALENDAR} size={24} color="#FFD54F" style={{ marginRight: 8 }} />
               <Text style={{ color: '#FFD54F', fontSize: 20, fontWeight: 'bold' }}>
                 Select Date
               </Text>
             </View>
             <TouchableOpacity onPress={handleCancel}>
               <MMORPGIcon name={ICON_NAMES.CLOSE} size={20} color="#B0BEC5" />
             </TouchableOpacity>
           </View>

          {/* Quick Date Options */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>
              Quick Select
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {getQuickDates().map((option) => (
                  <TouchableOpacity
                    key={option.label}
                    onPress={() => setSelectedDate(option.date)}
                    style={{
                      backgroundColor: selectedDate.toDateString() === option.date.toDateString() 
                        ? '#FFD54F' 
                        : '#2A2A2A',
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      borderRadius: 12,
                      borderWidth: 2,
                      borderColor: selectedDate.toDateString() === option.date.toDateString() 
                        ? '#FFD54F' 
                        : 'transparent',
                      minWidth: 80,
                      alignItems: 'center',
                    }}
                  >
                                         <MMORPGIcon name={option.icon} size={20} color={selectedDate.toDateString() === option.date.toDateString() ? '#121212' : '#B0BEC5'} style={{ marginBottom: 4 }} />
                    <Text style={{ 
                      color: selectedDate.toDateString() === option.date.toDateString() 
                        ? '#121212' 
                        : '#B0BEC5', 
                      fontSize: 12, 
                      fontWeight: 'bold',
                      textAlign: 'center'
                    }}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Month Navigation */}
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: 16
          }}>
            <TouchableOpacity
              onPress={() => changeMonth('prev')}
              style={{
                backgroundColor: '#2A2A2A',
                padding: 12,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#3A3A3A',
              }}
            >
              <Text style={{ color: '#FFD54F', fontSize: 18, fontWeight: 'bold' }}>‹</Text>
            </TouchableOpacity>
            
            <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' }}>
              {getMonthName(currentMonth)}
            </Text>
            
            <TouchableOpacity
              onPress={() => changeMonth('next')}
              style={{
                backgroundColor: '#2A2A2A',
                padding: 12,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#3A3A3A',
              }}
            >
              <Text style={{ color: '#FFD54F', fontSize: 18, fontWeight: 'bold' }}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Calendar Grid */}
          <View style={{ marginBottom: 20 }}>
            {/* Week Days Header */}
            <View style={{ flexDirection: 'row', marginBottom: 8 }}>
              {weekDays.map((day) => (
                <View key={day} style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={{ color: '#B0BEC5', fontSize: 12, fontWeight: 'bold' }}>
                    {day}
                  </Text>
                </View>
              ))}
            </View>

            {/* Calendar Days */}
            <View>
              {Array.from({ length: 6 }, (_, rowIndex) => (
                <View key={rowIndex} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                  {days.slice(rowIndex * 7, (rowIndex + 1) * 7).map((date, colIndex) => (
                    <TouchableOpacity
                      key={colIndex}
                      onPress={() => date && handleDateSelect(date)}
                      disabled={!date || isPastDate(date)}
                      style={{
                        width: '13%',
                        height: 40,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                  {date ? (
                    <View style={{
                      width: 36,
                      height: 36,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 18,
                      backgroundColor: isSelected(date) 
                        ? '#FFD54F' 
                        : isToday(date)
                        ? '#4A4A4A'
                        : 'transparent',
                      borderWidth: isToday(date) ? 2 : 0,
                      borderColor: '#FFD54F',
                    }}>
                      <Text style={{
                        color: isSelected(date) 
                          ? '#121212' 
                          : isPastDate(date)
                          ? '#666666'
                          : '#FFFFFF',
                        fontSize: 14,
                        fontWeight: isSelected(date) || isToday(date) ? 'bold' : 'normal',
                      }}>
                        {date.getDate()}
                      </Text>
                    </View>
                                     ) : (
                     <View style={{ width: 36, height: 36 }} />
                   )}
                     </TouchableOpacity>
                   ))}
                 </View>
               ))}
             </View>
          </View>

          {/* Selected Date Display */}
          <View style={{ 
            backgroundColor: '#2A2A2A', 
            borderRadius: 12, 
            padding: 16,
            marginBottom: 20,
            alignItems: 'center'
          }}>
            <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
              {formatDate(selectedDate)}
            </Text>
            <Text style={{ color: '#B0BEC5', fontSize: 14, textAlign: 'center' }}>
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
          </View>

                     {/* Action Buttons */}
           <View style={{ flexDirection: 'row', gap: 12 }}>
             <TouchableOpacity
               onPress={handleCancel}
               style={{
                 flex: 1,
                 backgroundColor: '#2A2A2A',
                 padding: 16,
                 borderRadius: 12,
                 alignItems: 'center',
                 borderWidth: 1,
                 borderColor: '#3A3A3A',
                 flexDirection: 'row',
                 justifyContent: 'center',
               }}
             >
               <MMORPGIcon name={ICON_NAMES.CANCEL} size={18} color="#B0BEC5" style={{ marginRight: 8 }} />
               <Text style={{ color: '#B0BEC5', fontSize: 16, fontWeight: 'bold' }}>
                 Cancel
               </Text>
             </TouchableOpacity>
             
             <TouchableOpacity
               onPress={handleConfirm}
               style={{
                 flex: 1,
                 backgroundColor: '#FFD54F',
                 padding: 16,
                 borderRadius: 12,
                 alignItems: 'center',
                 flexDirection: 'row',
                 justifyContent: 'center',
               }}
             >
               <MMORPGIcon name={ICON_NAMES.CONFIRM} size={18} color="#121212" style={{ marginRight: 8 }} />
               <Text style={{ color: '#121212', fontSize: 16, fontWeight: 'bold' }}>
                 Confirm
               </Text>
             </TouchableOpacity>
           </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
} 