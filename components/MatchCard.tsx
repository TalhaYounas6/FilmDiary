import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface MatchCardProps {
  item: {
    userId: String;
    score: number;
    matches: {
      movies: string[];
      directors: string[];
    };
  };
}

export const MatchCard = ({ item }: MatchCardProps) => {
  const scoreColor = item.score > 80 ? "text-red-500" : "text-gray-500";
  return (
    <View className="bg-black-100 border border-black-200 rounded-2xl p-5 mb-4">
      <View className="flex-row justify-between items-center mb-4">
        <View>
          <Text className="text-gray-400 text-xs uppercase">User ID</Text>

          <Text className="text-white font-psemibold text-sm" numberOfLines={1}>
            {item.userId}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-gray-400 text-xs uppercase">Compatibility</Text>
          <Text className={`${scoreColor} font-pbold text-2xl`}>
            {item.score} pts
          </Text>
        </View>
      </View>

      <View className="bg-primary/50 p-3 rounded-xl">
        <Text className="text-gray-100 text-sm mb-2">Shared Favorites:</Text>
        <Text className="text-white font-pmedium">
          {item.matches.movies.length > 0
            ? item.matches.movies.join(", ")
            : "No direct movie matches (matched on vibes!)"}
        </Text>

        {item.matches.directors.length > 0 && (
          <Text className="text-white font-pmedium mt-2">
            <Text className="text-gray-100">Shared Directors: </Text>
            {item.matches.directors.join(", ")}
          </Text>
        )}
      </View>

      <TouchableOpacity
        activeOpacity={0.7}
        className="bg-secondary/20 mt-5 h-12 rounded-xl justify-center items-center border border-secondary/50"
      >
        <Text className="text-secondary font-pbold">Say Hello!</Text>
      </TouchableOpacity>
    </View>
  );
};
