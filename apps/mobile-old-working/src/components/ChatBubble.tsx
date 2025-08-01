import { View, Text } from "react-native";

export default function ChatBubble({ role, content }) {
  const isUser = role === "user";
  return (
    <View className={`my-1 p-3 rounded-xl max-w-[80%] ${isUser ? "self-end bg-[#4FC3F7]" : "self-start bg-[#1E1E1E]"}`}>
      <Text className={`text-white`}>{content}</Text>
    </View>
  );
}
