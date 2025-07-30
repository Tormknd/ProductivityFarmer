import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../src/context/AuthContext";
import { useEffect } from "react";
import { router } from "expo-router";

export default function TabLayout() {
  const { token, isLoading, user } = useAuth();

  useEffect(() => {
    if (!token && !isLoading) {
      // Use setTimeout to ensure navigation happens after mount
      setTimeout(() => {
        console.log("No token found, redirecting to login");
        router.replace("/auth/login");
      }, 200);
    } else if (token) {
      console.log("Token found, staying in tabs");
    }
  }, [token, isLoading]);

  // Debug: Log current state
  console.log("TabLayout render - token:", !!token, "isLoading:", isLoading);

  if (isLoading) {
    console.log("Loading state, not rendering tabs");
    return null; // Don't render tabs while loading
  }

  if (!token) {
    console.log("No token, not rendering tabs");
    return null; // Don't render tabs if not authenticated
  }

  console.log("Rendering tabs with token:", token, "user:", user);

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
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'index') {
            iconName = 'home';
          } else if (route.name === 'tasks') {
            iconName = 'checkbox';
          } else if (route.name === 'nutrition') {
            iconName = 'fast-food';
          } else if (route.name === 'chat') {
            iconName = 'chatbubble';
          } else if (route.name === 'settings') {
            iconName = 'settings';
          } else {
            iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
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