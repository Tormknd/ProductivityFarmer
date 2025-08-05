import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NutritionSuggestion } from '../api/chat';
import { useAddFood, useAddMeal } from '../api/nutrition';
import MMORPGIcon, { ICON_NAMES } from './MMORPGIcons';
import { formatNutritionValue } from '../lib/nutrition';

interface NutritionSuggestionProps {
  suggestion: NutritionSuggestion;
  onAccepted?: () => void;
  isMultiple?: boolean;
  index?: number;
  totalCount?: number;
}

export default function NutritionSuggestionComponent({ 
  suggestion, 
  onAccepted, 
  isMultiple = false,
  index = 0,
  totalCount = 1
}: NutritionSuggestionProps) {
  const [isAccepted, setIsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const addFoodMutation = useAddFood();
  const addMealMutation = useAddMeal();

  const handleAccept = async () => {
    if (isAccepted || isLoading) return;
    
    setIsLoading(true);
    try {
      if (suggestion.type === 'food') {
        // Add the food first, then create a meal with it
        const food = await addFoodMutation.mutateAsync({
          name: suggestion.data.name,
          kcal: suggestion.data.calories || suggestion.data.kcal || 0,
          protein: suggestion.data.protein || 0,
          carbs: suggestion.data.carbs || 0,
          fat: suggestion.data.fat || 0,
          fiber: suggestion.data.fiber || 0,
          servingSize: suggestion.data.servingSize || '100g',
        });

        // Create a meal with the new food
        await addMealMutation.mutateAsync({
          foodId: food.id,
          quantity: 1,
          mealType: suggestion.data.mealType || 'snack',
          notes: `Added via AI suggestion: ${suggestion.data.description || suggestion.data.name}`,
        });

        Alert.alert('Success', `${suggestion.data.name} has been added to your nutrition journal!`);
      } else if (suggestion.type === 'meal') {
        // For meals, we need to add each ingredient as a food first
        const foodIds: string[] = [];
        
        for (const ingredient of suggestion.data.ingredients || []) {
          const food = await addFoodMutation.mutateAsync({
            name: ingredient.name,
            kcal: ingredient.calories || ingredient.kcal || 0,
            protein: ingredient.protein || 0,
            carbs: ingredient.carbs || 0,
            fat: ingredient.fat || 0,
            fiber: 0, // Default fiber value
            servingSize: `${ingredient.quantity || 100}${ingredient.unit || 'g'}`,
          });
          foodIds.push(food.id);
        }

        // Create meals for each ingredient
        for (let i = 0; i < foodIds.length; i++) {
          const ingredient = suggestion.data.ingredients![i];
          await addMealMutation.mutateAsync({
            foodId: foodIds[i],
            quantity: (ingredient.quantity || 100) / 100, // Convert to standard serving
            mealType: suggestion.data.mealType || 'snack',
            notes: `Part of AI suggested meal: ${suggestion.data.name}`,
          });
        }

        Alert.alert('Success', `${suggestion.data.name} has been added to your nutrition journal!`);
      }

      setIsAccepted(true);
      onAccepted?.();
    } catch (error) {
      console.error('Error accepting suggestion:', error);
      Alert.alert('Error', 'Failed to add the suggestion to your nutrition journal');
    } finally {
      setIsLoading(false);
    }
  };

  // Hide the suggestion if it's been accepted
  if (isAccepted) {
    return null;
  }

  const getMacroColor = (macro: string) => {
    switch (macro) {
      case 'protein': return '#4CAF50';
      case 'carbs': return '#FFD54F';
      case 'fat': return '#FF6B35';
      case 'fiber': return '#8BC34A';
      default: return '#B0BEC5';
    }
  };

  // Get nutrition values with fallbacks
  const getNutritionValue = (key: string) => {
    const value = suggestion.data[key] || suggestion.data[key === 'calories' ? 'kcal' : key] || 0;
    return typeof value === 'number' ? value : 0;
  };



  return (
    <View style={{
      backgroundColor: '#1E1E1E',
      borderRadius: 12,
      padding: 16,
      marginVertical: isMultiple ? 4 : 8,
      borderWidth: 2,
      borderColor: '#FFD54F',
    }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <MMORPGIcon 
            name={suggestion.type === 'meal' ? ICON_NAMES.NUTRITION : ICON_NAMES.GEM} 
            size={20} 
            color="#FFD54F" 
            style={{ marginRight: 8 }} 
          />
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#FFD54F', fontSize: 18, fontWeight: 'bold' }}>
              {suggestion.type === 'meal' ? 'Meal Suggestion' : 'Food Suggestion'}
            </Text>
            {isMultiple && totalCount > 1 && (
              <Text style={{ color: '#B0BEC5', fontSize: 12, marginTop: 2 }}>
                {index + 1} of {totalCount}
              </Text>
            )}
          </View>
        </View>
        
        <TouchableOpacity
          onPress={handleAccept}
          disabled={isLoading}
          style={{
            backgroundColor: isLoading ? '#666' : '#4CAF50',
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center',
            minWidth: 80,
            justifyContent: 'center',
          }}
        >
          {isLoading ? (
            <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '500' }}>
              Adding...
            </Text>
          ) : (
            <>
              <MMORPGIcon name={ICON_NAMES.CONFIRM} size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '500' }}>
                Accept
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Name and Description */}
      <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginBottom: 4 }}>
        {suggestion.data.name}
      </Text>
      <Text style={{ color: '#B0BEC5', fontSize: 14, marginBottom: 12 }}>
        {suggestion.data.description || suggestion.data.name}
      </Text>

      {/* Calories */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <MMORPGIcon name={ICON_NAMES.GEM} size={16} color="#FF6B35" style={{ marginRight: 6 }} />
        <Text style={{ color: '#FF6B35', fontSize: 16, fontWeight: 'bold' }}>
          {formatNutritionValue(getNutritionValue('calories'))} kcal
        </Text>
      </View>

      {/* Macros */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
        <View style={{ alignItems: 'center', flex: 1 }}>
          <Text style={{ color: getMacroColor('protein'), fontSize: 14, fontWeight: 'bold' }}>
            {formatNutritionValue(getNutritionValue('protein'))}g
          </Text>
          <Text style={{ color: '#B0BEC5', fontSize: 12 }}>Protein</Text>
        </View>
        <View style={{ alignItems: 'center', flex: 1 }}>
          <Text style={{ color: getMacroColor('carbs'), fontSize: 14, fontWeight: 'bold' }}>
            {formatNutritionValue(getNutritionValue('carbs'))}g
          </Text>
          <Text style={{ color: '#B0BEC5', fontSize: 12 }}>Carbs</Text>
        </View>
        <View style={{ alignItems: 'center', flex: 1 }}>
          <Text style={{ color: getMacroColor('fat'), fontSize: 14, fontWeight: 'bold' }}>
            {formatNutritionValue(getNutritionValue('fat'))}g
          </Text>
          <Text style={{ color: '#B0BEC5', fontSize: 12 }}>Fat</Text>
        </View>
        <View style={{ alignItems: 'center', flex: 1 }}>
          <Text style={{ color: getMacroColor('fiber'), fontSize: 14, fontWeight: 'bold' }}>
            {formatNutritionValue(getNutritionValue('fiber'))}g
          </Text>
          <Text style={{ color: '#B0BEC5', fontSize: 12 }}>Fiber</Text>
        </View>
      </View>

      {/* Meal Type (for meals) */}
      {suggestion.type === 'meal' && suggestion.data.mealType && (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <MMORPGIcon name={ICON_NAMES.TIME} size={14} color="#B0BEC5" style={{ marginRight: 6 }} />
          <Text style={{ color: '#B0BEC5', fontSize: 12, textTransform: 'capitalize' }}>
            {suggestion.data.mealType}
          </Text>
        </View>
      )}

      {/* Ingredients (for meals) */}
      {suggestion.type === 'meal' && suggestion.data.ingredients && suggestion.data.ingredients.length > 0 && (
        <View style={{ marginTop: 8 }}>
          <Text style={{ color: '#B0BEC5', fontSize: 12, fontWeight: '500', marginBottom: 4 }}>
            Ingredients:
          </Text>
          {suggestion.data.ingredients.map((ingredient, index) => (
            <Text key={index} style={{ color: '#666', fontSize: 11 }}>
              • {ingredient.name} ({(ingredient.quantity || 100)}{ingredient.unit || 'g'})
            </Text>
          ))}
        </View>
      )}

      {/* Serving Size (for foods) */}
      {suggestion.type === 'food' && suggestion.data.servingSize && (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
          <MMORPGIcon name={ICON_NAMES.GEM} size={14} color="#B0BEC5" style={{ marginRight: 6 }} />
          <Text style={{ color: '#B0BEC5', fontSize: 12 }}>
            Serving: {suggestion.data.servingSize}
          </Text>
        </View>
      )}
    </View>
  );
} 