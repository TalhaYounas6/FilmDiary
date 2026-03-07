import FavouritesCard from "@/components/FavouritesCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { useAuth } from "@/context/AuthContext";
import { getSavedMovies } from "@/services/appwrite";
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Text, View } from "react-native";

const Saved = () => {
  const { user } = useAuth();
  const isFocused = useIsFocused();

  const [loading, setLoading] = useState<boolean>(true);

  const [savedMovies, setSavedMovies] = useState<FavouriteMovie[] | null>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      if (user?.$id) {
        try {
          // setLoading(true);
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
      <View className="flex-1 bg-primary">
        <Image
          source={images.bgpurple}
          className="z-0 flex-1 w-full absolute"
          resizeMode="cover"
        />
        <Image
          source={icons.logo}
          className="w-15 h-12 mt-20 mb-5 self-center"
          resizeMode="contain"
        />
      </View>
    );
  }

  // if (!loading && savedMovies?.length == 0) {
  //   return (
  //     <View className="flex-1 bg-primary">
  //       <Image
  //         source={images.bgpurple}
  //         className="z-0 flex-1 w-full absolute"
  //         resizeMode="cover"
  //       />

  //       <View className="justify-center items-center flex">
  //         <Image
  //           source={icons.logo}
  //           className="w-15 h-12 mt-20 mb-5 self-center"
  //           resizeMode="contain"
  //         />
  //         <Text className="text-white font-bold text-xl text-center">
  //           You have no favourites yet.
  //         </Text>
  //       </View>
  //     </View>
  //   );
  // }

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bgpurple}
        className="z-0 flex-1 w-full absolute"
        resizeMode="cover"
      />

      {error ? (
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
                  className="w-15 h-12 mt-20 mb-5 self-center"
                  resizeMode="contain"
                />
                {(loading || savedMovies?.length > 0) && (
                  <Text className="text-lg text-white font-bold mt-5 mb-3 ml-2">
                    Favourite Movies
                  </Text>
                )}
              </>
            }
            data={
              (loading ? [1, 2, 3, 4, 5, 6, 7, 8, 9] : savedMovies) as any[]
            }
            renderItem={({ item }) => {
              return <FavouritesCard {...item} isLoading={loading} />;
            }}
            // data={savedMovies}
            // renderItem={({ item }) => <FavouritesCard {...item} />}
            // keyExtractor={(item) => item.id.toString()}
            keyExtractor={(item, index) =>
              loading ? `skeleton-${index}` : item.id.toString()
            }
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
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              !loading ? (
                <View className="justify-center items-center mt-10">
                  <Text className="text-white font-bold text-xl text-center">
                    You have no favourites yet.
                  </Text>
                </View>
              ) : null
            }
          />
        </View>
      )}
    </View>
  );
};

export default Saved;
