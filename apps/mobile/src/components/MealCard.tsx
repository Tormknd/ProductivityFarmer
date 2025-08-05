import { View, Text } from "react-native";
import { Meal } from "../types";
import { formatNutritionValue } from "../lib/nutrition";

interface MealCardProps {
  meal: Meal;
}

export default function MealCard({ meal }: MealCardProps) {

  return (
    <View style={{ 
      padding: 16, 
      backgroundColor: '#1E1E1E', 
      borderRadius: 16, 
      marginBottom: 8 
    }}>
      <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>
        {meal.food.name}
      </Text>
      <Text style={{ color: '#B0BEC5', fontSize: 14, marginTop: 4 }}>
        {formatNutritionValue(meal.quantity)}× • {formatNutritionValue(meal.food.kcal)} kcal
      </Text>
      <View style={{ flexDirection: 'row', marginTop: 8 }}>
        <Text style={{ color: '#4CAF50', fontSize: 12, marginRight: 12 }}>
          P: {formatNutritionValue(meal.food.protein)}g
        </Text>
        <Text style={{ color: '#FF9800', fontSize: 12, marginRight: 12 }}>
          C: {formatNutritionValue(meal.food.carbs)}g
        </Text>
        <Text style={{ color: '#F44336', fontSize: 12 }}>
          F: {formatNutritionValue(meal.food.fat)}g
        </Text>
      </View>
    </View>
  );
} 