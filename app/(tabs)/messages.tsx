import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import type { Channel } from "stream-chat";
import { ChannelList } from "stream-chat-expo";

const messages = () => {
  const router = useRouter();
  const { user } = useAuth();

  const filters = useMemo(() => {
    if (!user?.$id) return null;
    return {
      members: { $in: [user.$id] },
      type: "messaging",
    };
  }, [user?.$id]);

  const sort = useMemo(() => ({ last_message_at: -1 }), []);

  const handleChannelSelect = (channel: Channel) => {
    router.push(`../chat/${channel.cid}`);
  };

  if (!user?.$id) {
    return (
      <View className="flex-1 bg-primary justify-center items-center">
        <Text className="text-white text-2xl">
          Log in To View Your Messages
        </Text>
      </View>
    );
  }
  if (!filters) {
    return (
      <View className="flex-1 bg-primary justify-center items-center">
        <ActivityIndicator size="large" color="#a855f7" />
      </View>
    );
  }
  return (
    <View className="flex-1 bg-primary pt-10">
      <View className="px-4 pb-4 border-b border-gray-800">
        <Text className="text-white text-2xl font-bold">Messages</Text>
      </View>

      <ChannelList
        filters={filters}
        sort={sort}
        onSelect={handleChannelSelect}
        EmptyStateIndicator={() => (
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-400">No messages yet.</Text>
            <Text className="text-gray-500 text-sm mt-2">
              Go match with someone!
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default messages;
