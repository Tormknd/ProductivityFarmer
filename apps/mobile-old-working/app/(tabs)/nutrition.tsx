import { View, Text } from "react-native";
import BarcodeScanner from "@components/BarcodeScanner";

export default function Nutrition() {
  return (
    <View className="flex-1 bg-[#121212] p-4">
      <Text className="text-white text-2xl font-bold mb-4">Nutrition</Text>
      <BarcodeScanner />
    </View>
  );
}
