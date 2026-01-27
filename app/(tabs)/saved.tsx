import FavouritesCard from "@/components/FavouritesCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { useAuth } from "@/context/AuthContext";
import { getSavedMovies } from "@/services/appwrite";
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

const Saved = () => {
  const { user } = useAuth();
  const isFocused = useIsFocused();

  const [loading, setLoading] = useState<boolean>(false);

  const [savedMovies, setSavedMovies] = useState<FavouriteMovie[] | null>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      if (user?.$id) {
        try {
          setLoading(true);
          const movies = await getSavedMovies(user.$id);
          setSavedMovies(movies);
        } catch (error) {
          console.log("Error fetching movies:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    if (isFocused && user) {
      fetchMovies();
    }
  }, [isFocused, user]);

  if (!user) {
    return (
      <View className="flex-1 bg-primary px-10 justify-center items-center">
        <Text className="text-white font-bold text-xl text-center">
          Log in to access your favourite movies
        </Text>
      </View>
    );
  }

  if (!savedMovies) {
    return (
      <View className="flex-1 bg-primary px-10 justify-center items-center">
        <Text className="text-white font-bold text-xl text-center">
          You have no favourites.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bgpurple}
        className="z-0 flex-1 w-full absolute"
        resizeMode="cover"
      />

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          className="mt-10 self-center"
        />
      ) : error ? (
        <Text className="text-lg text-red-600 text-center my-auto">
          Error: {error?.message}
        </Text>
      ) : (
        <View className="flex-1 mt-5">
          <FlatList
            ListHeaderComponent={
              <>
                <Image
                  source={icons.logo}
                  className="w-15 h-12 mt-20 mb-5 mx-auto"
                  resizeMode="contain"
                />
                <Text className="text-lg text-white font-bold mt-5 mb-3 ml-2">
                  Favourite Movies
                </Text>
              </>
            }
            data={savedMovies}
            renderItem={({ item }) => <FavouritesCard {...item} />}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            columnWrapperStyle={{
              justifyContent: "flex-start",
              gap: 20,
              // paddingRight: 5,
              marginBottom: 10,
              padding: 9,
            }}
            className="mt-2 pb-32"
            contentContainerStyle={{
              minHeight: "100%",
              paddingBottom: 80,
              padding: 5,
            }}
          />
        </View>
      )}
    </View>
  );
};

export default Saved;
