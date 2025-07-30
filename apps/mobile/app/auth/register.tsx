import { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, Alert } from "react-native";
import { router } from "expo-router";
import { useApi } from "../../src/api/client";

export default function Register() {
  const api = useApi();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const submit = async () => {
    if (!form.name || !form.email || !form.password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (form.password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/auth/register", form);
      Alert.alert("Success", "Account created! Please sign in.", [
        { text: "OK", onPress: () => router.push("/auth/login") }
      ]);
    } catch (error: any) {
      Alert.alert("Registration Failed", error.response?.data?.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#121212', padding: 20, justifyContent: 'center' }}>
      <Text style={{ color: '#FFD54F', fontSize: 32, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' }}>
        Create Account
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
        placeholder="Name" 
        placeholderTextColor="#B0BEC5" 
        value={form.name}
        onChangeText={(value) => setForm({ ...form, name: value })}
        autoCapitalize="words"
      />
      
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
        value={form.email}
        onChangeText={(value) => setForm({ ...form, email: value })}
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
        value={form.password}
        onChangeText={(value) => setForm({ ...form, password: value })}
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
          {isLoading ? 'Creating account...' : 'Create Account'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => router.push("/auth/login")}>
        <Text style={{ color: '#B0BEC5', textAlign: 'center', fontSize: 16 }}>
          Already have an account? Sign in
        </Text>
      </TouchableOpacity>
    </View>
  );
} 