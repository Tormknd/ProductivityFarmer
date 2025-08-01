import { View, Text } from "react-native";

export default function MealCard({ meal }) {
  return (
    <View className="p-4 bg-[#1E1E1E] rounded-2xl mb-2">
      <Text className="text-white">{meal.food.name}</Text>
      <Text className="text-[#B0BEC5]">{meal.quantity}× • {meal.food.kcal} kcal</Text>
    </View>
  );
}
