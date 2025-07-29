import { Tabs } from "expo-router";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const TabIcon = ({ name, color }) => (
  <View>
    <Ionicons name={name} size={24} color={color} />
  </View>
);

export default () => (
  <Tabs
    screenOptions={({ route }) => ({
      tabBarStyle: { backgroundColor: "#1E1E1E" },
      tabBarActiveTintColor: "#FFD54F",
      tabBarInactiveTintColor: "#B0BEC5",
      headerShown: false,
      tabBarIcon: ({ color }) => {
        const map = { index: "home", tasks: "checkbox", nutrition: "fast-food", chat: "chatbubble", settings: "settings" };
        return <TabIcon name={map[route.name] || "ellipse"} color={color} />;
      }
    })}
  >
    <Tabs.Screen name="index" options={{ title: "Dashboard" }} />
    <Tabs.Screen name="tasks" options={{ title: "Tasks" }} />
    <Tabs.Screen name="nutrition" options={{ title: "Nutrition" }} />
    <Tabs.Screen name="chat" options={{ title: "Chat" }} />
    <Tabs.Screen name="settings" options={{ title: "Settings" }} />
  </Tabs>
);
