import { View, Text, Button } from "react-native";
import { useAuth } from "@ctx/AuthContext";
import { colors } from "@theme";

export default function Settings() {
  const { logout } = useAuth();
  return (
    <View className="flex-1 bg-[#121212] p-4">
      <Text style={{ color: colors.text, fontSize: 28, fontWeight: "700" }}>Settings</Text>
      <Button title="Log out" onPress={logout} />
    </View>
  );
}
