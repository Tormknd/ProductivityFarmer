import { View, Text } from "react-native";
import { ChatMessage } from "../types";

interface ChatBubbleProps {
  role: ChatMessage['role'];
  content: string;
}

export default function ChatBubble({ role, content }: ChatBubbleProps) {
  const isUser = role === "user";
  return (
    <View style={{ 
      marginVertical: 4, 
      padding: 12, 
      borderRadius: 12, 
      maxWidth: '80%',
      alignSelf: isUser ? 'flex-end' : 'flex-start',
      backgroundColor: isUser ? '#4FC3F7' : '#1E1E1E'
    }}>
      <Text style={{ color: '#FFFFFF' }}>{content}</Text>
    </View>
  );
} 