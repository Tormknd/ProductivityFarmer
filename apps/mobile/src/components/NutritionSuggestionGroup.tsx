import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { NutritionSuggestion } from '../api/chat';
import NutritionSuggestionComponent from './NutritionSuggestion';
import MMORPGIcon, { ICON_NAMES } from './MMORPGIcons';

interface NutritionSuggestionGroupProps {
  suggestions: NutritionSuggestion[];
  onAccepted?: () => void;
}

export default function NutritionSuggestionGroup({ suggestions, onAccepted }: NutritionSuggestionGroupProps) {
  const [acceptedSuggestions, setAcceptedSuggestions] = useState<Set<string>>(new Set());

  const handleAcceptAll = async () => {
    Alert.alert(
      'Add All Suggestions',
      `Add all ${suggestions.length} items to your nutrition journal?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add All',
          onPress: () => {
            // This will be handled by individual accept buttons
            // We could implement bulk acceptance here if needed
            Alert.alert('Success', 'Please accept each item individually for now.');
          }
        }
      ]
    );
  };

  const handleSuggestionAccepted = (index: number) => {
    setAcceptedSuggestions(prev => new Set([...prev, index.toString()]));
    onAccepted?.();
  };

  const getGroupTitle = () => {
    if (suggestions.length === 1) {
      return suggestions[0].type === 'meal' ? 'Meal Suggestion' : 'Food Suggestion';
    }
    
    const mealCount = suggestions.filter(s => s.type === 'meal').length;
    const foodCount = suggestions.filter(s => s.type === 'food').length;
    
    if (mealCount > 0 && foodCount > 0) {
      return `${suggestions.length} Suggestions (${mealCount} meals, ${foodCount} foods)`;
    } else if (mealCount > 0) {
      return `${mealCount} Meal Suggestions`;
    } else {
      return `${foodCount} Food Suggestions`;
    }
  };

  const getGroupIcon = () => {
    if (suggestions.length === 1) {
      return suggestions[0].type === 'meal' ? ICON_NAMES.NUTRITION : ICON_NAMES.GEM;
    }
    return ICON_NAMES.MAGIC; // Magic wand for multiple suggestions
  };

  // Filter out accepted suggestions
  const remainingSuggestions = suggestions.filter((_, index) => !acceptedSuggestions.has(index.toString()));

  // Hide the entire group if all suggestions are accepted
  if (remainingSuggestions.length === 0) {
    return null;
  }

  return (
    <View style={{
      backgroundColor: '#1A1A1A',
      borderRadius: 16,
      padding: 16,
      marginVertical: 8,
      borderWidth: 2,
      borderColor: '#FFD54F',
    }}>
      {/* Group Header */}
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#333'
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <MMORPGIcon 
            name={getGroupIcon()} 
            size={24} 
            color="#FFD54F" 
            style={{ marginRight: 12 }} 
          />
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#FFD54F', fontSize: 20, fontWeight: 'bold' }}>
              {getGroupTitle()}
            </Text>
            <Text style={{ color: '#B0BEC5', fontSize: 14, marginTop: 2 }}>
              {remainingSuggestions.length === 1 
                ? 'Tap Accept to add to your journal' 
                : `Tap Accept on each item you want to add (${remainingSuggestions.length} remaining)`
              }
            </Text>
          </View>
        </View>
        
        {remainingSuggestions.length > 1 && (
          <TouchableOpacity
            onPress={handleAcceptAll}
            style={{
              backgroundColor: '#2A2A2A',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 6,
              borderWidth: 1,
              borderColor: '#FFD54F',
            }}
          >
            <Text style={{ color: '#FFD54F', fontSize: 12, fontWeight: '500' }}>
              Add All
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Individual Suggestions */}
      <View style={{ gap: 8 }}>
        {remainingSuggestions.map((suggestion, index) => {
          const originalIndex = suggestions.indexOf(suggestion);
          return (
            <NutritionSuggestionComponent
              key={`${suggestion.type}-${originalIndex}`}
              suggestion={suggestion}
              onAccepted={() => handleSuggestionAccepted(originalIndex)}
              isMultiple={remainingSuggestions.length > 1}
              index={index}
              totalCount={remainingSuggestions.length}
            />
          );
        })}
      </View>
    </View>
  );
} 