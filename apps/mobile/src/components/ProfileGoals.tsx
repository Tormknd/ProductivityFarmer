import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNutritionGoals, useUpdateNutritionGoals } from '../api/nutrition';
import MMORPGIcon, { ICON_NAMES } from './MMORPGIcons';

interface ProfileGoalsProps {
  visible: boolean;
  onClose: () => void;
}

export default function ProfileGoals({ visible, onClose }: ProfileGoalsProps) {
  const { data: goals, isLoading } = useNutritionGoals();
  const updateGoalsMutation = useUpdateNutritionGoals();
  
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    targetKcal: '',
    targetProtein: '',
    targetCarbs: '',
    targetFat: '',
    targetFiber: '',
  });

  // Initialize form data when goals are loaded
  React.useEffect(() => {
    if (goals && !editing) {
      setFormData({
        targetKcal: goals.targetKcal.toString(),
        targetProtein: goals.targetProtein.toString(),
        targetCarbs: goals.targetCarbs.toString(),
        targetFat: goals.targetFat.toString(),
        targetFiber: goals.targetFiber.toString(),
      });
    }
  }, [goals, editing]);

  const handleSave = async () => {
    try {
      await updateGoalsMutation.mutateAsync({
        targetKcal: parseInt(formData.targetKcal) || undefined,
        targetProtein: parseFloat(formData.targetProtein) || undefined,
        targetCarbs: parseFloat(formData.targetCarbs) || undefined,
        targetFat: parseFloat(formData.targetFat) || undefined,
        targetFiber: parseFloat(formData.targetFiber) || undefined,
      });
      
      setEditing(false);
      Alert.alert('Success', 'Nutrition goals updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update nutrition goals');
    }
  };

  const handleCancel = () => {
    if (goals) {
      setFormData({
        targetKcal: goals.targetKcal.toString(),
        targetProtein: goals.targetProtein.toString(),
        targetCarbs: goals.targetCarbs.toString(),
        targetFat: goals.targetFat.toString(),
        targetFiber: goals.targetFiber.toString(),
      });
    }
    setEditing(false);
  };

  if (isLoading) {
    return (
      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
        <View style={{ flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#FFD54F" />
          <Text style={{ color: '#B0BEC5', marginTop: 16 }}>Loading nutrition goals...</Text>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
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
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MMORPGIcon name={ICON_NAMES.NUTRITION} size={24} color="#FFD54F" style={{ marginRight: 8 }} />
            <Text style={{ color: '#FFD54F', fontSize: 20, fontWeight: 'bold' }}>
              Nutrition Goals
            </Text>
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {editing ? (
              <>
                <TouchableOpacity onPress={handleCancel} style={{ marginRight: 12 }}>
                  <Text style={{ color: '#FF5252', fontSize: 16 }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={handleSave}
                  disabled={updateGoalsMutation.isPending}
                  style={{ 
                    backgroundColor: '#4CAF50', 
                    paddingHorizontal: 16, 
                    paddingVertical: 8, 
                    borderRadius: 8 
                  }}
                >
                  {updateGoalsMutation.isPending ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '500' }}>Save</Text>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity onPress={() => setEditing(true)}>
                <MMORPGIcon name={ICON_NAMES.EDIT} size={20} color="#FFD54F" />
              </TouchableOpacity>
            )}
            
            <TouchableOpacity onPress={onClose} style={{ marginLeft: 16 }}>
              <MMORPGIcon name={ICON_NAMES.CLOSE} size={24} color="#B0BEC5" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={{ flex: 1, padding: 20 }}>
          <Text style={{ color: '#B0BEC5', fontSize: 16, marginBottom: 20, lineHeight: 24 }}>
            Set your daily nutrition targets to track your progress and get personalized recommendations.
          </Text>

          {/* Calories */}
          <View style={{ 
            backgroundColor: '#1E1E1E', 
            padding: 16, 
            borderRadius: 12, 
            marginBottom: 16 
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <MMORPGIcon name={ICON_NAMES.GEM} size={20} color="#FF6B35" style={{ marginRight: 8 }} />
              <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' }}>
                Daily Calories
              </Text>
            </View>
            
            {editing ? (
              <TextInput
                style={{
                  backgroundColor: '#2A2A2A',
                  color: '#FFFFFF',
                  padding: 12,
                  borderRadius: 8,
                  fontSize: 16,
                  borderWidth: 1,
                  borderColor: '#FFD54F'
                }}
                value={formData.targetKcal}
                onChangeText={(text) => setFormData(prev => ({ ...prev, targetKcal: text }))}
                placeholder="2000"
                placeholderTextColor="#666"
                keyboardType="numeric"
              />
            ) : (
              <Text style={{ color: '#FFD54F', fontSize: 24, fontWeight: 'bold' }}>
                {goals?.targetKcal || 2000} kcal
              </Text>
            )}
          </View>

          {/* Macros */}
          <View style={{ 
            backgroundColor: '#1E1E1E', 
            padding: 16, 
            borderRadius: 12, 
            marginBottom: 16 
          }}>
            <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
              Macronutrients
            </Text>
            
            {/* Protein */}
            <View style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <View style={{ width: 12, height: 12, backgroundColor: '#4CAF50', borderRadius: 6, marginRight: 8 }} />
                <Text style={{ color: '#B0BEC5', fontSize: 16 }}>Protein</Text>
              </View>
              {editing ? (
                <TextInput
                  style={{
                    backgroundColor: '#2A2A2A',
                    color: '#FFFFFF',
                    padding: 12,
                    borderRadius: 8,
                    fontSize: 16,
                    borderWidth: 1,
                    borderColor: '#4CAF50'
                  }}
                  value={formData.targetProtein}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, targetProtein: text }))}
                  placeholder="150"
                  placeholderTextColor="#666"
                  keyboardType="numeric"
                />
              ) : (
                <Text style={{ color: '#4CAF50', fontSize: 20, fontWeight: 'bold' }}>
                  {goals?.targetProtein || 150}g
                </Text>
              )}
            </View>

            {/* Carbs */}
            <View style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <View style={{ width: 12, height: 12, backgroundColor: '#FFD54F', borderRadius: 6, marginRight: 8 }} />
                <Text style={{ color: '#B0BEC5', fontSize: 16 }}>Carbohydrates</Text>
              </View>
              {editing ? (
                <TextInput
                  style={{
                    backgroundColor: '#2A2A2A',
                    color: '#FFFFFF',
                    padding: 12,
                    borderRadius: 8,
                    fontSize: 16,
                    borderWidth: 1,
                    borderColor: '#FFD54F'
                  }}
                  value={formData.targetCarbs}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, targetCarbs: text }))}
                  placeholder="250"
                  placeholderTextColor="#666"
                  keyboardType="numeric"
                />
              ) : (
                <Text style={{ color: '#FFD54F', fontSize: 20, fontWeight: 'bold' }}>
                  {goals?.targetCarbs || 250}g
                </Text>
              )}
            </View>

            {/* Fat */}
            <View style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <View style={{ width: 12, height: 12, backgroundColor: '#FF6B35', borderRadius: 6, marginRight: 8 }} />
                <Text style={{ color: '#B0BEC5', fontSize: 16 }}>Fat</Text>
              </View>
              {editing ? (
                <TextInput
                  style={{
                    backgroundColor: '#2A2A2A',
                    color: '#FFFFFF',
                    padding: 12,
                    borderRadius: 8,
                    fontSize: 16,
                    borderWidth: 1,
                    borderColor: '#FF6B35'
                  }}
                  value={formData.targetFat}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, targetFat: text }))}
                  placeholder="65"
                  placeholderTextColor="#666"
                  keyboardType="numeric"
                />
              ) : (
                <Text style={{ color: '#FF6B35', fontSize: 20, fontWeight: 'bold' }}>
                  {goals?.targetFat || 65}g
                </Text>
              )}
            </View>

            {/* Fiber */}
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <View style={{ width: 12, height: 12, backgroundColor: '#8BC34A', borderRadius: 6, marginRight: 8 }} />
                <Text style={{ color: '#B0BEC5', fontSize: 16 }}>Fiber</Text>
              </View>
              {editing ? (
                <TextInput
                  style={{
                    backgroundColor: '#2A2A2A',
                    color: '#FFFFFF',
                    padding: 12,
                    borderRadius: 8,
                    fontSize: 16,
                    borderWidth: 1,
                    borderColor: '#8BC34A'
                  }}
                  value={formData.targetFiber}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, targetFiber: text }))}
                  placeholder="25"
                  placeholderTextColor="#666"
                  keyboardType="numeric"
                />
              ) : (
                <Text style={{ color: '#8BC34A', fontSize: 20, fontWeight: 'bold' }}>
                  {goals?.targetFiber || 25}g
                </Text>
              )}
            </View>
          </View>

          {/* Tips */}
          <View style={{ 
            backgroundColor: '#1E1E1E', 
            padding: 16, 
            borderRadius: 12 
          }}>
            <Text style={{ color: '#FFD54F', fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>
              💡 Tips
            </Text>
            <Text style={{ color: '#B0BEC5', fontSize: 14, lineHeight: 20 }}>
              • Protein: 1.2-2.0g per kg of body weight{'\n'}
              • Carbs: 45-65% of total calories{'\n'}
              • Fat: 20-35% of total calories{'\n'}
              • Fiber: 25-30g per day{'\n'}
              • Consult a nutritionist for personalized goals
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
} 