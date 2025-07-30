import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../src/context/AuthContext";
import { useEffect } from "react";
import { router } from "expo-router";
import MMORPGIcon, { ICON_NAMES } from "../../src/components/MMORPGIcons";

export default function TabLayout() {
  const { token, isLoading, user } = useAuth();

  useEffect(() => {
    if (!token && !isLoading) {
      // Use setTimeout to ensure navigation happens after mount
      setTimeout(() => {
        router.replace("/auth/login");
      }, 200);
    }
  }, [token, isLoading]);

  if (isLoading) {
    return null; // Don't render tabs while loading
  }

  if (!token) {
    return null; // Don't render tabs if not authenticated
  }

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarStyle: { 
          backgroundColor: "#1E1E1E",
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0
        },
        tabBarActiveTintColor: "#FFD54F",
        tabBarInactiveTintColor: "#B0BEC5",
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: string;

          if (route.name === 'index') {
            iconName = ICON_NAMES.HOME;
          } else if (route.name === 'tasks') {
            iconName = ICON_NAMES.TASKS;
          } else if (route.name === 'nutrition') {
            iconName = ICON_NAMES.NUTRITION;
          } else if (route.name === 'chat') {
            iconName = ICON_NAMES.CHAT;
          } else if (route.name === 'settings') {
            iconName = ICON_NAMES.SETTINGS;
          } else {
            iconName = ICON_NAMES.TASK;
          }

          return <MMORPGIcon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Dashboard" }} />
      <Tabs.Screen name="tasks" options={{ title: "Tasks" }} />
      <Tabs.Screen name="nutrition" options={{ title: "Nutrition" }} />
      <Tabs.Screen name="chat" options={{ title: "Chat" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
    </Tabs>
  );
} 