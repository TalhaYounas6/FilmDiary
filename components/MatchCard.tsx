import { chatClient, useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface MatchCardProps {
  item: {
    userId: String;
    score: number;
    matches: {
      movies: string[];
      directors: string[];
    };
    userName: string;
    avatar?: string;
  };
}

export const MatchCard = ({ item }: MatchCardProps) => {
  const { user } = useAuth();
  const router = useRouter();
  const [isCreatingChat, setIsCreatingChat] = useState(false);

  const handleStartChat = async () => {
    if (!user?.$id) {
      Alert.alert("You must be logged in to chat");
      return;
    }

    if (!chatClient.userID) {
      Alert.alert("Chat is still connecting...try again later");
      return;
    }

    setIsCreatingChat(true);

    try {
      const channel = chatClient.channel("messaging", {
        members: [user.$id, item.userId],
      });

      await channel.watch();

      router.push(`../chat/${channel.cid}`);
    } catch (error) {
      Alert.alert("Error", "Could not start Chat.Please try again");
      console.error("Error creating channel: ", error);
    } finally {
      setIsCreatingChat(false);
    }
  };

  const scoreColor = item.score > 80 ? "text-red-500" : "text-gray-500";
  console.log(item.matches.directors);

  // Combine both arrays
  const allMatches = [
    ...(item.matches?.movies || []),
    ...(item.matches?.directors || []),
  ];
  return (
    <View className="bg-[#130b1c] border border-[#2a1744] rounded-2xl p-4 mr-4 w-72">
      <Image
        source={
          item.avatar
            ? { uri: item.avatar }
            : require("@/assets/images/defaultAvatar.jpg")
        }
        className="w-full h-64 rounded-xl mb-3"
        resizeMode="cover"
      />

      <View className="relative mb-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-white font-bold text-2xl" numberOfLines={1}>
            {item.userName}
          </Text>
          <View className="w-3 h-3 rounded-full bg-pink-500" />
        </View>

        <Text className="text-gray-400 text-xs mt-1 font-medium">
          @{item.userName?.toLowerCase().replace(/\s/g, "") || item.userId}
        </Text>
        {/* <Text className="text-gray-300 text-xs mt-1">
          Compatibility Score: {item.score} pts
        </Text> */}
      </View>

      <View className="mb-4 flex-1">
        <Text className="text-white font-bold text-lg mb-1">You both love</Text>

        <ScrollView className="max-h-20" showsVerticalScrollIndicator={true}>
          {allMatches.length > 0 ? (
            <Text className="text-gray-300 text-sm leading-5 font-medium">
              {allMatches.join(" • ")}
            </Text>
          ) : (
            <Text className="text-gray-400 text-sm italic">
              Matched on vibes!
            </Text>
          )}
        </ScrollView>
      </View>

      <View className="flex-col">
        <TouchableOpacity
          activeOpacity={0.7}
          className="bg-[#2a1744] h-10 rounded-xl justify-center items-center mb-2"
        >
          <Text className="text-[#c084fc] font-bold text-sm">
            Send friend request
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleStartChat}
          disabled={isCreatingChat}
          className="bg-[#2a1744] h-10 rounded-xl justify-center items-center"
        >
          {isCreatingChat ? (
            <ActivityIndicator size="small" color="#c084fc" />
          ) : (
            <Text className="text-[#c084fc] font-bold text-sm">
              Send chat message
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
