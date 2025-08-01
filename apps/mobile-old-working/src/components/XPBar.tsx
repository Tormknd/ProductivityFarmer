import { View } from "react-native";
import { colors } from "@theme";

export default function XPBar({ xp, nextLevel }: { xp: number; nextLevel: number }) {
  const pct = Math.min(1, xp / nextLevel);
  return (
    <View className="h-4 w-full bg-[#1E1E1E] rounded-xl mt-4 overflow-hidden">
      <View style={{ width: `${pct * 100}%`, backgroundColor: colors.primary }} className="h-full" />
    </View>
  );
}
