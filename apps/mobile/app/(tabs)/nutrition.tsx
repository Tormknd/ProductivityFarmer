import { View } from "react-native";
import NutritionJournal from "../../src/components/NutritionJournal";

export default function Nutrition() {
  const today = new Date().toISOString().split('T')[0];
  
  return (
    <View style={{ flex: 1, backgroundColor: '#121212' }}>
      <NutritionJournal date={today} />
    </View>
  );
} 