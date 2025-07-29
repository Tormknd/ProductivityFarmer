import { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import axios from "axios";

export default function Register() {
  const [form, set] = useState({ email: "", password: "", name: "" });

  const submit = async () => {
    await axios.post("/auth/register", form);
    // navigate back to login
  };

  return (
    <View className="flex-1 bg-[#121212] p-4 justify-center">
      <Text className="text-white text-2xl mb-4">Create account</Text>
      <TextInput className="bg-[#1E1E1E] text-white p-3 rounded-xl mb-3" placeholder="Name" placeholderTextColor="#B0BEC5" onChangeText={(v) => set({ ...form, name: v })} />
      <TextInput className="bg-[#1E1E1E] text-white p-3 rounded-xl mb-3" placeholder="Email" placeholderTextColor="#B0BEC5" onChangeText={(v) => set({ ...form, email: v })} />
      <TextInput className="bg-[#1E1E1E] text-white p-3 rounded-xl mb-3" placeholder="Password" secureTextEntry placeholderTextColor="#B0BEC5" onChangeText={(v) => set({ ...form, password: v })} />
      <Button title="Register" onPress={submit} />
    </View>
  );
}