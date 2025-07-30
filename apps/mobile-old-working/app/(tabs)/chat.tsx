import { FlatList, TextInput, View, TouchableOpacity } from "react-native";
import { useState } from "react";
import ChatBubble from "@components/ChatBubble";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");

  const send = () => {
    if (!draft) return;
    setMessages((m) => [...m, { role: "user", content: draft }]);
    setDraft("");
    // TODO: call /chat endpoint, stream assistant response, append
  };

  return (
    <View className="flex-1 bg-[#121212] p-4">
      <FlatList
        data={messages}
        inverted
        renderItem={({ item }) => <ChatBubble {...item} />}
        keyExtractor={(_, i) => String(i)}
      />
      <View className="flex-row items-center">
        <TextInput
          className="flex-1 bg-[#1E1E1E] text-white p-3 rounded-xl"
          placeholder="Type…"
          placeholderTextColor="#B0BEC5"
          value={draft}
          onChangeText={setDraft}
        />
        <TouchableOpacity onPress={send} className="ml-2 p-3">
          {/* send icon */}
        </TouchableOpacity>
      </View>
    </View>
  );
}
