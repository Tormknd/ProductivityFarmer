import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";

export default function Chat() {
  const [draft, setDraft] = useState("");

  const send = () => {
    if (!draft.trim()) return;
    // TODO: Implement chat functionality
    setDraft("");
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#121212', padding: 20 }}>
      <Text style={{ color: '#FFD54F', fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        AI Assistant
      </Text>
      
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#B0BEC5', fontSize: 16, textAlign: 'center' }}>
          Chat functionality coming soon!
        </Text>
      </View>
      
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
        <TextInput
          style={{ 
            flex: 1, 
            backgroundColor: '#1E1E1E', 
            color: '#FFFFFF',
            padding: 12, 
            borderRadius: 12,
            marginRight: 8
          }}
          placeholder="Ask me anything..."
          placeholderTextColor="#B0BEC5"
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={send}
        />
        <TouchableOpacity 
          onPress={send} 
          style={{ 
            padding: 12, 
            backgroundColor: '#FFD54F',
            borderRadius: 12
          }}
        >
          <Text style={{ color: '#121212', fontWeight: 'bold' }}>
            Send
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 