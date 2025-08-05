import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useNutritionSummary, useAddMeal, useDeleteMeal, useSearchFoods, useAddFood, type Food, type Meal } from '../api/nutrition';
import MMORPGIcon, { ICON_NAMES } from './MMORPGIcons';
import { formatNutritionValue } from '../lib/nutrition';

interface NutritionJournalProps {
  date: string;
}

const MEAL_TYPES = [
  { key: 'breakfast', label: 'Breakfast', icon: ICON_NAMES.HOME },
  { key: 'lunch', label: 'Lunch', icon: ICON_NAMES.TIME },
  { key: 'dinner', label: 'Dinner', icon: ICON_NAMES.CALENDAR },
  { key: 'snack', label: 'Snack', icon: ICON_NAMES.POTION },
];

export default function NutritionJournal({ date }: NutritionJournalProps) {
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [showAddFood, setShowAddFood] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('snack');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [quantity, setQuantity] = useState('1');
  const [notes, setNotes] = useState('');

  const { data: nutritionData, isLoading } = useNutritionSummary(date);
  const { data: searchResults, isLoading: searching } = useSearchFoods(searchQuery);
  const addMealMutation = useAddMeal();
  const deleteMealMutation = useDeleteMeal();
  const addFoodMutation = useAddFood();

  const handleAddMeal = async () => {
    if (!selectedFood || !quantity) {
      Alert.alert('Error', 'Please select a food and enter quantity');
      return;
    }

    try {
      await addMealMutation.mutateAsync({
        foodId: selectedFood.id,
        quantity: parseFloat(quantity),
        mealType: selectedMealType,
        notes: notes.trim() || undefined,
      });

      setShowAddMeal(false);
      setSelectedFood(null);
      setQuantity('1');
      setNotes('');
      setSearchQuery('');
    } catch (error) {
      Alert.alert('Error', 'Failed to add meal');
    }
  };

  const handleDeleteMeal = (meal: Meal) => {
    Alert.alert(
      'Delete Meal',
      `Are you sure you want to delete ${meal.food.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteMealMutation.mutate(meal.id),
        },
      ]
    );
  };

  const getMealTypeIcon = (mealType: string) => {
    const mealTypeData = MEAL_TYPES.find(mt => mt.key === mealType);
    return mealTypeData?.icon || ICON_NAMES.POTION;
  };

  const getMealTypeLabel = (mealType: string) => {
    const mealTypeData = MEAL_TYPES.find(mt => mt.key === mealType);
    return mealTypeData?.label || 'Snack';
  };

  const getProgressPercentage = (current: number, target: number) => {
    if (target === 0) return 0;
    return Math.min((current / target) * 100, 100);
  };



  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FFD54F" />
        <Text style={{ color: '#B0BEC5', marginTop: 16 }}>Loading nutrition data...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#121212' }}>
      {/* Header */}
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: 20,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#2A2A2A'
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MMORPGIcon name={ICON_NAMES.NUTRITION} size={24} color="#FFD54F" style={{ marginRight: 8 }} />
          <Text style={{ color: '#FFD54F', fontSize: 24, fontWeight: 'bold' }}>
            Nutrition Journal
          </Text>
        </View>
        
        <TouchableOpacity 
          onPress={() => setShowAddMeal(true)}
          style={{ 
            flexDirection: 'row', 
            alignItems: 'center',
            backgroundColor: '#FFD54F',
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 8
          }}
        >
          <MMORPGIcon name={ICON_NAMES.ADD} size={16} color="#121212" style={{ marginRight: 4 }} />
          <Text style={{ color: '#121212', fontWeight: 'bold', fontSize: 14 }}>
            Add Meal
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1, padding: 20 }}>
        {/* Nutrition Summary */}
        {nutritionData && (
          <View style={{ marginBottom: 24 }}>
            <Text style={{ color: '#FFD54F', fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
              Daily Summary
            </Text>
            
            {/* Calories Progress */}
            <View style={{ marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{ color: '#FFFFFF', fontSize: 16 }}>Calories</Text>
                <Text style={{ color: '#FFFFFF', fontSize: 16 }}>
                  {formatNutritionValue(nutritionData.totals.kcal)} / {formatNutritionValue(nutritionData.goals?.targetKcal || 2000)}
                </Text>
              </View>
              <View style={{ 
                height: 8, 
                backgroundColor: '#2A2A2A', 
                borderRadius: 4,
                overflow: 'hidden'
              }}>
                <View style={{ 
                  height: '100%', 
                  backgroundColor: '#4CAF50',
                  width: `${getProgressPercentage(nutritionData.totals.kcal, nutritionData.goals?.targetKcal || 2000)}%`
                }} />
              </View>
            </View>

            {/* Macros */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{ color: '#4CAF50', fontSize: 18, fontWeight: 'bold' }}>
                  {formatNutritionValue(nutritionData.totals.protein)}g
                </Text>
                <Text style={{ color: '#B0BEC5', fontSize: 12 }}>Protein</Text>
              </View>
              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{ color: '#FF9800', fontSize: 18, fontWeight: 'bold' }}>
                  {formatNutritionValue(nutritionData.totals.carbs)}g
                </Text>
                <Text style={{ color: '#B0BEC5', fontSize: 12 }}>Carbs</Text>
              </View>
              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{ color: '#2196F3', fontSize: 18, fontWeight: 'bold' }}>
                  {formatNutritionValue(nutritionData.totals.fat)}g
                </Text>
                <Text style={{ color: '#B0BEC5', fontSize: 12 }}>Fat</Text>
              </View>
            </View>
          </View>
        )}

        {/* Meals by Type */}
        {MEAL_TYPES.map(mealType => {
          const meals = nutritionData?.meals.filter(m => m.mealType === mealType.key) || [];
          
          return (
            <View key={mealType.key} style={{ marginBottom: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <MMORPGIcon name={mealType.icon} size={20} color="#FFD54F" style={{ marginRight: 8 }} />
                <Text style={{ color: '#FFD54F', fontSize: 18, fontWeight: 'bold' }}>
                  {mealType.label}
                </Text>
                <Text style={{ color: '#B0BEC5', fontSize: 14, marginLeft: 8 }}>
                  ({meals.length} items)
                </Text>
              </View>

              {meals.length === 0 ? (
                <View style={{ 
                  padding: 16, 
                  backgroundColor: '#1E1E1E', 
                  borderRadius: 12,
                  alignItems: 'center'
                }}>
                  <Text style={{ color: '#666', fontSize: 14 }}>
                    No meals logged yet
                  </Text>
                </View>
              ) : (
                meals.map(meal => (
                  <View key={meal.id} style={{ 
                    flexDirection: 'row', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 12,
                    backgroundColor: '#1E1E1E',
                    borderRadius: 12,
                    marginBottom: 8
                  }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '500' }}>
                        {meal.food.name}
                      </Text>
                      <Text style={{ color: '#B0BEC5', fontSize: 14 }}>
                        {formatNutritionValue(meal.quantity)} × {formatNutritionValue(meal.food.kcal * meal.quantity)} kcal
                      </Text>
                      {meal.notes && (
                        <Text style={{ color: '#666', fontSize: 12, marginTop: 4 }}>
                          {meal.notes}
                        </Text>
                      )}
                    </View>
                    
                    <TouchableOpacity 
                      onPress={() => handleDeleteMeal(meal)}
                      style={{ padding: 8 }}
                    >
                      <MMORPGIcon name={ICON_NAMES.DELETE} size={16} color="#FF5252" />
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Add Meal Modal */}
      <Modal
        visible={showAddMeal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={{ flex: 1, backgroundColor: '#121212' }}>
          {/* Modal Header */}
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: '#2A2A2A'
          }}>
            <Text style={{ color: '#FFD54F', fontSize: 20, fontWeight: 'bold' }}>
              Add Meal
            </Text>
            <TouchableOpacity onPress={() => setShowAddMeal(false)}>
              <MMORPGIcon name={ICON_NAMES.CLOSE} size={24} color="#B0BEC5" />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ flex: 1, padding: 20 }}>
            {/* Meal Type Selection */}
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>
              Meal Type
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 }}>
              {MEAL_TYPES.map(mealType => (
                <TouchableOpacity
                  key={mealType.key}
                  onPress={() => setSelectedMealType(mealType.key)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    backgroundColor: selectedMealType === mealType.key ? '#FFD54F' : '#1E1E1E',
                    borderRadius: 8,
                    marginRight: 8,
                    marginBottom: 8,
                  }}
                >
                  <MMORPGIcon 
                    name={mealType.icon} 
                    size={16} 
                    color={selectedMealType === mealType.key ? '#121212' : '#FFD54F'} 
                    style={{ marginRight: 4 }} 
                  />
                  <Text style={{ 
                    color: selectedMealType === mealType.key ? '#121212' : '#FFFFFF',
                    fontWeight: '500'
                  }}>
                    {mealType.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Food Search */}
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>
              Search Food
            </Text>
            <TextInput
              style={{
                backgroundColor: '#1E1E1E',
                color: '#FFFFFF',
                padding: 12,
                borderRadius: 8,
                marginBottom: 16,
                fontSize: 16,
              }}
              placeholder="Search for a food..."
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            {/* Search Results */}
            {searching && (
              <View style={{ alignItems: 'center', padding: 20 }}>
                <ActivityIndicator size="small" color="#FFD54F" />
                <Text style={{ color: '#B0BEC5', marginTop: 8 }}>Searching...</Text>
              </View>
            )}

            {searchResults && searchResults.length > 0 && (
              <View style={{ marginBottom: 20 }}>
                {searchResults.map(food => (
                  <TouchableOpacity
                    key={food.id}
                    onPress={() => setSelectedFood(food)}
                    style={{
                      padding: 12,
                      backgroundColor: selectedFood?.id === food.id ? '#FFD54F' : '#1E1E1E',
                      borderRadius: 8,
                      marginBottom: 8,
                    }}
                  >
                    <Text style={{ 
                      color: selectedFood?.id === food.id ? '#121212' : '#FFFFFF',
                      fontSize: 16,
                      fontWeight: '500'
                    }}>
                      {food.name}
                    </Text>
                    <Text style={{ 
                      color: selectedFood?.id === food.id ? '#121212' : '#B0BEC5',
                      fontSize: 14
                    }}>
                      {formatNutritionValue(food.kcal)} kcal per {food.servingSize}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Quantity and Notes */}
            {selectedFood && (
              <>
                <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>
                  Quantity
                </Text>
                <TextInput
                  style={{
                    backgroundColor: '#1E1E1E',
                    color: '#FFFFFF',
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 16,
                    fontSize: 16,
                  }}
                  placeholder="1"
                  placeholderTextColor="#666"
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="numeric"
                />

                <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>
                  Notes (optional)
                </Text>
                <TextInput
                  style={{
                    backgroundColor: '#1E1E1E',
                    color: '#FFFFFF',
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 20,
                    fontSize: 16,
                    height: 80,
                    textAlignVertical: 'top',
                  }}
                  placeholder="Add any notes..."
                  placeholderTextColor="#666"
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                />
              </>
            )}

            {/* Add Button */}
            <TouchableOpacity
              onPress={handleAddMeal}
              disabled={!selectedFood || addMealMutation.isPending}
              style={{
                backgroundColor: selectedFood ? '#FFD54F' : '#666',
                padding: 16,
                borderRadius: 8,
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              {addMealMutation.isPending ? (
                <ActivityIndicator size="small" color="#121212" />
              ) : (
                <Text style={{ color: '#121212', fontSize: 16, fontWeight: 'bold' }}>
                  Add Meal
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
} 