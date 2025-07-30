import { View } from "react-native";

interface XPBarProps {
  xp: number;
  nextLevel: number;
}

export default function XPBar({ xp, nextLevel }: XPBarProps) {
  const pct = Math.min(1, xp / nextLevel);
  return (
    <View style={{ 
      height: 16, 
      width: '100%', 
      backgroundColor: '#1E1E1E', 
      borderRadius: 12, 
      marginTop: 16, 
      overflow: 'hidden' 
    }}>
      <View style={{ 
        width: `${pct * 100}%`, 
        backgroundColor: '#FFD54F',
        height: '100%' 
      }} />
    </View>
  );
} 