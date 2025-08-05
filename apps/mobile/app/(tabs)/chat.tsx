import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, Modal } from "react-native";
import { useState, useEffect, useRef } from "react";
import { useApi } from "../../src/api/client";
import { NutritionSuggestion } from "../../src/api/chat";
import ChatBubble from "../../src/components/ChatBubble";
import NutritionSuggestionGroup from "../../src/components/NutritionSuggestionGroup";
import MMORPGIcon, { ICON_NAMES } from "../../src/components/MMORPGIcons";

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  suggestions?: NutritionSuggestion[];
}

export default function Chat() {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [showTools, setShowTools] = useState(false);
  const [useNutritionContext, setUseNutritionContext] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const api = useApi();
  const scrollViewRef = useRef<ScrollView>(null);

  // Load chat history on component mount
  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const response = await api.get("/chat/history");
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error("Failed to load chat history:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const sendMessage = async () => {
    if (!draft.trim() || isLoading) return;

    const userMessage = draft.trim();
    setDraft("");
    setIsLoading(true);
    
    // Dismiss keyboard
    if (Platform.OS === 'ios') {
      // @ts-ignore
      TextInput.State?.currentlyFocusedField() && TextInput.State?.blurTextInput(TextInput.State?.currentlyFocusedField());
    }

    // Add user message to UI immediately
    const tempUserMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: userMessage,
      createdAt: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMessage]);

    try {
      setRetryCount(0);
      const response = await api.post("/chat", { 
        message: userMessage,
        useNutritionContext 
      });
      
      // Replace temp message with real one and add AI response
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: response.data.message,
        suggestions: response.data.suggestions || [],
        createdAt: new Date().toISOString()
      };
      
      setMessages(prev => [
        ...prev.filter(msg => msg.id !== tempUserMessage.id),
        {
          ...tempUserMessage,
          id: `user-${Date.now()}`
        },
        aiMessage
      ]);

      // Scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);

    } catch (error: any) {
      console.error("Failed to send message:", error);
      
      // Check if it's a retryable error
      const isRetryable = error.code === 'ECONNRESET' || 
                         error.code === 'ETIMEDOUT' || 
                         error.response?.status >= 500 ||
                         error.message?.includes('network');
      
      if (isRetryable && retryCount < 3) {
        setRetryCount(prev => prev + 1);
        Alert.alert(
          "Connection Error", 
          `Retrying... (${retryCount + 1}/3)`,
          [{ text: "OK" }]
        );
        
        // Retry after a delay
        setTimeout(() => {
          sendMessage();
        }, 1000 * Math.pow(2, retryCount)); // Exponential backoff
        return;
      }
      
      Alert.alert(
        "Error", 
        error.response?.data?.error || "Failed to send message. Please try again."
      );
      
      // Remove temp message on error
      setMessages(prev => prev.filter(msg => msg.id !== tempUserMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = async () => {
    Alert.alert(
      "Clear Chat History",
      "Are you sure you want to clear all chat messages? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete("/chat/history");
              setMessages([]);
            } catch (error) {
              console.error("Failed to clear history:", error);
              Alert.alert("Error", "Failed to clear chat history");
            }
          }
        }
      ]
    );
  };

  if (isLoadingHistory) {
    return (
      <View style={{ flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FFD54F" />
        <Text style={{ color: '#B0BEC5', marginTop: 16 }}>Loading chat history...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: '#121212' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header */}
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: 20,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#2A2A2A',
        backgroundColor: '#121212'
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MMORPGIcon name={ICON_NAMES.CHAT} size={24} color="#FFD54F" style={{ marginRight: 8 }} />
          <Text style={{ color: '#FFD54F', fontSize: 24, fontWeight: 'bold' }}>
            AI Assistant
          </Text>
        </View>
        
        {messages.length > 0 && (
          <TouchableOpacity onPress={clearHistory}>
            <MMORPGIcon name={ICON_NAMES.DELETE} size={20} color="#FF5252" />
          </TouchableOpacity>
        )}
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1, padding: 20, paddingBottom: 100 }}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
            <MMORPGIcon name={ICON_NAMES.CHAT} size={64} color="#B0BEC5" style={{ marginBottom: 16 }} />
            <Text style={{ color: '#B0BEC5', fontSize: 18, textAlign: 'center', marginBottom: 8 }}>
              Welcome to your AI Assistant!
            </Text>
            <Text style={{ color: '#666', fontSize: 14, textAlign: 'center' }}>
              Ask me anything about productivity, task management, or get help with your goals.
            </Text>
          </View>
        ) : (
          messages.map((message) => (
            <View key={message.id}>
              <ChatBubble
                role={message.role}
                content={message.content}
              />
              {/* Render nutrition suggestions if any */}
              {message.suggestions && message.suggestions.length > 0 && (
                <View style={{ marginTop: 8, marginBottom: 16 }}>
                  <NutritionSuggestionGroup
                    suggestions={message.suggestions}
                    onAccepted={() => {
                      // Optionally refresh nutrition data or show success feedback
                      console.log('Suggestions accepted');
                    }}
                  />
                </View>
              )}
            </View>
          ))
        )}
        
        {isLoading && (
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            marginTop: 16,
            marginBottom: 20,
            padding: 12,
            backgroundColor: '#1E1E1E',
            borderRadius: 12,
            alignSelf: 'flex-start'
          }}>
            <ActivityIndicator size="small" color="#FFD54F" style={{ marginRight: 8 }} />
            <Text style={{ color: '#B0BEC5', fontSize: 14 }}>
              {retryCount > 0 ? `Retrying... (${retryCount}/3)` : 'AI is thinking...'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'flex-end', 
        padding: 20,
        paddingTop: 10,
        paddingBottom: 10,
        borderTopWidth: 1,
        borderTopColor: '#2A2A2A',
        backgroundColor: '#121212'
      }}>
        {/* Tools Button */}
        <TouchableOpacity 
          onPress={() => setShowTools(true)}
          style={{ 
            padding: 12, 
            backgroundColor: '#1E1E1E',
            borderRadius: 12,
            marginRight: 8,
            alignItems: 'center',
            justifyContent: 'center',
            height: 44,
            width: 44
          }}
        >
          <MMORPGIcon 
            name={ICON_NAMES.MAGIC} 
            size={20} 
            color="#FFD54F" 
          />
        </TouchableOpacity>

        <TextInput
          style={{ 
            flex: 1, 
            backgroundColor: '#1E1E1E', 
            color: '#FFFFFF',
            padding: 12, 
            borderRadius: 12,
            marginRight: 8,
            fontSize: 16,
            minHeight: 44,
            maxHeight: 120,
            textAlignVertical: 'top'
          }}
          placeholder="Ask me anything..."
          placeholderTextColor="#B0BEC5"
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={sendMessage}
          multiline
          maxLength={1000}
          editable={!isLoading}
          returnKeyType="send"
          blurOnSubmit={false}
        />
        <TouchableOpacity 
          onPress={sendMessage}
          disabled={isLoading || !draft.trim()}
          style={{ 
            padding: 12, 
            backgroundColor: isLoading || !draft.trim() ? '#666' : '#FFD54F',
            borderRadius: 12,
            minWidth: 60,
            alignItems: 'center',
            justifyContent: 'center',
            height: 44
          }}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#999" />
          ) : (
            <MMORPGIcon 
              name={ICON_NAMES.CONFIRM} 
              size={20} 
              color={!draft.trim() ? '#999' : '#121212'} 
            />
          )}
        </TouchableOpacity>
      </View>

      {/* Tools Modal */}
      <Modal
        visible={showTools}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={{ flex: 1, backgroundColor: '#121212' }}>
          {/* Modal Header */}
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: '#2A2A2A'
          }}>
            <Text style={{ color: '#FFD54F', fontSize: 20, fontWeight: 'bold' }}>
              AI Tools
            </Text>
            <TouchableOpacity onPress={() => setShowTools(false)}>
              <MMORPGIcon name={ICON_NAMES.CLOSE} size={24} color="#B0BEC5" />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ flex: 1, padding: 20 }}>
            {/* Nutrition Helper */}
            <View style={{ 
              backgroundColor: '#1E1E1E',
              borderRadius: 12,
              padding: 16,
              marginBottom: 16
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <MMORPGIcon name={ICON_NAMES.NUTRITION} size={24} color="#FFD54F" style={{ marginRight: 8 }} />
                <Text style={{ color: '#FFD54F', fontSize: 18, fontWeight: 'bold' }}>
                  Nutrition Helper
                </Text>
              </View>
              
              <Text style={{ color: '#B0BEC5', fontSize: 14, marginBottom: 12 }}>
                Enable nutrition context for AI responses. The AI will have access to your nutrition data to provide personalized meal suggestions and advice.
              </Text>

              <TouchableOpacity
                onPress={() => setUseNutritionContext(!useNutritionContext)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 12,
                  backgroundColor: useNutritionContext ? '#4CAF50' : '#2A2A2A',
                  borderRadius: 8,
                }}
              >
                <View style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: useNutritionContext ? '#FFFFFF' : '#666',
                  marginRight: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {useNutritionContext && (
                    <MMORPGIcon name={ICON_NAMES.CONFIRM} size={12} color="#4CAF50" />
                  )}
                </View>
                <Text style={{ 
                  color: useNutritionContext ? '#FFFFFF' : '#B0BEC5',
                  fontWeight: '500'
                }}>
                  {useNutritionContext ? 'Enabled' : 'Disabled'}
                </Text>
              </TouchableOpacity>

              {useNutritionContext && (
                <Text style={{ color: '#4CAF50', fontSize: 12, marginTop: 8 }}>
                  ✓ AI will have access to your nutrition data for personalized advice
                </Text>
              )}
            </View>

            {/* More tools can be added here */}
            <View style={{ 
              backgroundColor: '#1E1E1E',
              borderRadius: 12,
              padding: 16,
              marginBottom: 16
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <MMORPGIcon name={ICON_NAMES.MAGIC} size={24} color="#FFD54F" style={{ marginRight: 8 }} />
                <Text style={{ color: '#FFD54F', fontSize: 18, fontWeight: 'bold' }}>
                  More Tools Coming Soon
                </Text>
              </View>
              
              <Text style={{ color: '#B0BEC5', fontSize: 14 }}>
                We're working on more AI tools to help you with productivity, goal tracking, and more!
              </Text>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
} 