import { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { useAuth } from "@ctx/AuthContext";
import axios from "axios";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    const { data } = await axios.post("/auth/login", { email, password });
    login(data.token);
  };

  return (
    <View className="flex-1 bg-[#121212] p-4 justify-center">
      <Text className="text-white text-2xl mb-4">Sign in</Text>
      <TextInput className="bg-[#1E1E1E] text-white p-3 rounded-xl mb-3" placeholder="Email" placeholderTextColor="#B0BEC5" onChangeText={setEmail} />
      <TextInput className="bg-[#1E1E1E] text-white p-3 rounded-xl mb-3" placeholder="Password" secureTextEntry placeholderTextColor="#B0BEC5" onChangeText={setPassword} />
      <Button title="Login" onPress={submit} />
    </View>
  );
}
