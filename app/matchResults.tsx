import { MatchCard } from "@/components/MatchCard";
import { images } from "@/constants/images";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const matchResults = () => {
  const { results } = useLocalSearchParams();
  const [matchData, setMatchData] = useState<any[]>([]);

  useEffect(() => {
    if (results && typeof results === "string") {
      try {
        const parsed = JSON.parse(results);
        if (Array.isArray(parsed)) {
          setMatchData(parsed);
        }
      } catch (error) {
        console.error("Error parsing match data: ", error);
      }
    }
  }, [results]);

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bgpurple}
        resizeMode="cover"
        className="absolute w-full h-full z-0 opacity-40"
      />

      <SafeAreaView className="flex-1 px-4">
        <View className="my-6 items-center">
          <Text className="text-secondary font-pbold uppercase tracking-widest">
            Results
          </Text>
          <Text className="text-white text-3xl font-pbold mt-1">
            Your Movie Soulmates
          </Text>
        </View>

        <FlatList
          data={matchData}
          keyExtractor={(item) => item.userId}
          renderItem={({ item }) => <MatchCard item={item} />}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={() => (
            <View className="items-center justify-center mt-20">
              <Text className="text-gray-100 font-pmedium">
                No matches data loaded.
              </Text>
            </View>
          )}
        />

        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-black-200 h-14 rounded-2xl justify-center items-center mb-6 border border-black-100"
        >
          <Text className="text-white font-pbold text-lg">Return</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

export default matchResults;
