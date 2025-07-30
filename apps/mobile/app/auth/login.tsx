import { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, Alert } from "react-native";
import { router } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";
import { useApi } from "../../src/api/client";

export default function Login() {
  const { login, loginWithMockUser, logout } = useAuth();
  const api = useApi();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submit = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      await login(data.token);
      // Use setTimeout to ensure navigation happens after state update
      setTimeout(() => {
        router.replace("/(tabs)");
      }, 100);
    } catch (error: any) {
      Alert.alert("Login Failed", error.response?.data?.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = async () => {
    await loginWithMockUser();
    router.replace("/(tabs)");
  };

  const clearToken = async () => {
    await logout();
    Alert.alert("Token Cleared", "Stored token has been cleared. Try quick login again.");
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#121212', padding: 20, justifyContent: 'center' }}>
      <Text style={{ color: '#FFD54F', fontSize: 32, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' }}>
        Welcome Back
      </Text>
      
      <TextInput 
        style={{ 
          backgroundColor: '#1E1E1E', 
          color: '#FFFFFF', 
          padding: 16, 
          borderRadius: 12, 
          marginBottom: 16,
          fontSize: 16
        }} 
        placeholder="Email" 
        placeholderTextColor="#B0BEC5" 
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput 
        style={{ 
          backgroundColor: '#1E1E1E', 
          color: '#FFFFFF', 
          padding: 16, 
          borderRadius: 12, 
          marginBottom: 24,
          fontSize: 16
        }} 
        placeholder="Password" 
        placeholderTextColor="#B0BEC5" 
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity 
        onPress={submit}
        disabled={isLoading}
        style={{ 
          backgroundColor: '#FFD54F', 
          padding: 16, 
          borderRadius: 12,
          alignItems: 'center',
          marginBottom: 16
        }}
      >
        <Text style={{ color: '#121212', fontSize: 16, fontWeight: 'bold' }}>
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Text>
      </TouchableOpacity>

      {/* Quick Login for Testing */}
      <TouchableOpacity 
        onPress={quickLogin}
        style={{ 
          backgroundColor: '#4FC3F7', 
          padding: 12, 
          borderRadius: 12,
          alignItems: 'center',
          marginBottom: 16
        }}
      >
        <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' }}>
          🚀 Quick Login (Test User)
        </Text>
      </TouchableOpacity>

      {/* Debug: Clear Token */}
      <TouchableOpacity 
        onPress={clearToken}
        style={{ 
          backgroundColor: '#FF5252', 
          padding: 12, 
          borderRadius: 12,
          alignItems: 'center',
          marginBottom: 16
        }}
      >
        <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' }}>
          🔧 Clear Stored Token (Debug)
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => router.push("/auth/register")}>
        <Text style={{ color: '#B0BEC5', textAlign: 'center', fontSize: 16 }}>
          Don't have an account? Sign up
        </Text>
      </TouchableOpacity>
    </View>
  );
} 