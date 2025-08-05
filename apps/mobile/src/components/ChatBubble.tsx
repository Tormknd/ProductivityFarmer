import { View, Text } from "react-native";

interface ChatBubbleProps {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatBubble({ role, content }: ChatBubbleProps) {
  const isUser = role === "user";
  return (
    <View style={{ 
      marginVertical: 6, 
      padding: 12, 
      borderRadius: 16, 
      maxWidth: '85%',
      alignSelf: isUser ? 'flex-end' : 'flex-start',
      backgroundColor: isUser ? '#4FC3F7' : '#1E1E1E',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2
    }}>
      <Text style={{ 
        color: '#FFFFFF', 
        fontSize: 16,
        lineHeight: 22,
        textAlign: isUser ? 'right' : 'left'
      }}>
        {content}
      </Text>
    </View>
  );
} 