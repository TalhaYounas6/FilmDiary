import { chatClient, useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Channel as StreamChannel } from "stream-chat";
import { Channel, MessageInput, MessageList, useTheme } from "stream-chat-expo";

export default function ChatRoomScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const [channel, setChannel] = useState<StreamChannel | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchChannel = async () => {
      if (!id || !chatClient.userID) return;

      try {
        const [type, channelId] = id.split(":");

        const _channel = chatClient.channel(type, channelId);

        await _channel.watch();

        setChannel(_channel);
      } catch (error) {
        console.error("Failed to load channel: ", error);
      }
    };

    fetchChannel();
  }, [id]);

  const headerOptions = {
    headerShown: true,
    headerTitle: "",
    headerLeft: () => (
      <View className="flex-row items-center gap-3 ml-2">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <Ionicons name="chevron-back" size={28} color="white" />
        </TouchableOpacity>

        <Image
          source={
            otherUser?.image
              ? { uri: otherUser.image }
              : require("@/assets/images/defaultAvatar.jpg")
          }
          className="w-10 h-10 rounded-full border border-purple-400"
        />

        <View>
          <Text className="text-white font-bold text-lg">
            {otherUser?.name || "User"}
          </Text>

          {otherUser?.online && (
            <Text className="text-green-400 text-xs font-semibold">Online</Text>
          )}
        </View>
      </View>
    ),
    headerStyle: { backgroundColor: "#1a1a1a" },
    headerShadowVisible: false,
  };

  if (!channel) {
    return (
      <View className="flex-1 bg-primary justify-center items-center">
        <Stack.Screen options={headerOptions} />
        <ActivityIndicator size="large" color="#a855f7" />
        <Text className="text-gray-300 mt-4 font-semibold">
          Loading chat...
        </Text>
      </View>
    );
  }

  const members = Object.values(channel.state.members);
  const otherMember = members.find((m) => m.user?.id !== currentUser?.$id);
  const otherUser = otherMember?.user;

  return (
    <View className="flex-1 bg-primary">
      <Stack.Screen options={headerOptions} />
      <Channel channel={channel}>
        {/* Displays the history and new messages */}
        <MessageList />

        {/* The text input box at the bottom */}
        <MessageInput />
      </Channel>
    </View>
  );
}
