import { images } from "@/constants/images";
import { useAuth } from "@/context/AuthContext";
import { findCompatibleUsers } from "@/services/appwrite";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LOADING_STATUSES = [
  "Scanning the movie network...",
  "Analyzing your cinematic taste...",
  "Comparing taste profiles...",
  "Crunching genre data...",
  "Finalizing your perfect matches...",
];

const connect = () => {
  const { user, session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);

  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let timeout;

    if (loading) {
      setStatusIndex(0);
      fadeAnim.setValue(1);

      const cycleText = (currentIndex) => {
        // Stop if we reach the last message
        if (currentIndex >= LOADING_STATUSES.length - 1) return;

        timeout = setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            setStatusIndex(currentIndex + 1);

            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }).start(() => {
              cycleText(currentIndex + 1);
            });
          });
        }, 750);
      };

      cycleText(0);
    }

    return () => {
      clearTimeout(timeout);
      fadeAnim.stopAnimation();
    };
  }, [loading]);

  const handleFindBuddy = async () => {
    if (!user) {
      return;
    }
    setLoading(true);
    // setStatus("Looking through the database...");

    setTimeout(async () => {
      try {
        // setStatus("Comparing Movie Tastes...");

        const [results] = await Promise.all([
          findCompatibleUsers(user.$id),
          new Promise((resolve) => setTimeout(resolve, 7000)),
        ]);
        // const results = await findCompatibleUsers(user.$id);

        if (results === "Not_Enough_Movies") {
          setLoading(false);
          Alert.alert(
            "Taste Profile Incomplete",
            "You need to save at least 30 movies so that we can understand your taste and suggest you the best possible buddies.",
          );
          return;
        }

        if (Array.isArray(results) && results.length === 0) {
          setLoading(false);
          Alert.alert(
            "No Matches Found",
            "Try saving more diverse movies to broaden your search.",
          );
          return;
        }

        setLoading(false);
        router.push({
          pathname: "./matchResults",
          params: { results: JSON.stringify(results) },
        });
      } catch (error) {
        setLoading(false);
        Alert.alert("Something went wrong while scanning.");
        console.error(error);
      }
    }, 500);
  };

  if (!user || !session) {
    return (
      <View className="flex-1 bg-primary">
        <Image
          source={images.bgpurple}
          resizeMode="cover"
          className="absolute w-full h-full z-0 opacity-50"
        />
        <SafeAreaView className="flex-1 justify-center items-center px-6">
          <Text className="text-white text-3xl font-pbold text-center mb-4">
            Connect with Movie Buffs
          </Text>
          <Text className="text-gray-100 text-lg font-pregular text-center mb-8">
            Log in to find people who share your exact taste in cinema.
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/signin")}
            className="mt-4 rounded-2xl px-5 py-3 bg-green-500"
          >
            <Text className="text-black text-center text-lg ">
              Log In to Connect
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bgpurple}
        resizeMode="cover"
        className="absolute w-full h-full z-0 opacity-40"
      />

      {loading ? (
        <SafeAreaView className="flex-1 justify-center items-center px-6 z-10">
          <Image
            source={images.network}
            className="w-52 h-52 mb-8"
            resizeMode="contain"
          />
          <Text className="text-white text-2xl font-pbold text-center mb-2">
            Finding Matches
          </Text>
          <Animated.Text
            style={{ opacity: fadeAnim }}
            className="text-gray-300 font-pregular text-lg text-center"
          >
            {LOADING_STATUSES[statusIndex]}
          </Animated.Text>
        </SafeAreaView>
      ) : (
        <SafeAreaView className="flex-1 px-6 justify-center z-10">
          <View className="mb-10">
            <Text className="text-white text-4xl font-pbold text-center mt-2">
              Find Your Crowd
            </Text>
          </View>

          <View className="bg-black-100/80 border border-black-200 p-8 rounded-2xl mb-10 shadow-lg">
            <Text className="text-gray-100 text-lg font-pregular text-center leading-8">
              "Your taste is unique. But you aren't alone."
            </Text>
            <View className="w-full h-[1px] bg-gray-700 my-4" />
            <Text className="text-gray-400 text-sm font-plight text-center">
              We analyze your movies, directors, genres, and hidden keywords to
              find users who watch what you watch.
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleFindBuddy}
            className="w-full h-16 rounded-xl flex-row justify-center items-center bg-purple-600"
          >
            <Text className="text-primary font-pbold text-xl">
              Find a Film Buddy
            </Text>
          </TouchableOpacity>

          <Text className="text-gray-500 text-xs text-center mt-6">
            Requires at least 30 saved movies to work accurately.
          </Text>

          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-black-200 h-14 rounded-2xl justify-center items-center mb-6 mt-6 border border-black-100"
          >
            <Text className="text-white font-pbold text-lg">Return</Text>
          </TouchableOpacity>
        </SafeAreaView>
      )}
    </View>
  );
};

export default connect;
