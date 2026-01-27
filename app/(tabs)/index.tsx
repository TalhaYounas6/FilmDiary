import MovieCard from "@/components/MovieCard";
import TrendingMovieCard from "@/components/TrendingMovieCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";
import { useFetch } from "@/services/useFetch";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

SplashScreen.preventAutoHideAsync();

export default function Index() {
  useEffect(() => {
    const timer = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const {
    data: trendingMovies,
    loading: trendingMoviesLoading,
    error: trendingMoviesError,
  } = useFetch(getTrendingMovies);

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(() => fetchMovies({ query: "" }));

  // <ScrollView
  //       className="flex-1 px-5"
  //       showsVerticalScrollIndicator={false}
  //       contentContainerStyle={{
  //         minHeight: "100%",
  //         paddingBottom: 10,
  //       }}
  //     ></ScrollView>

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bgpurple}
        className="z-0 flex-1 w-full absolute"
        resizeMode="cover"
      />

      {moviesLoading || trendingMoviesLoading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          className="mt-10 self-center"
        />
      ) : moviesError || trendingMoviesError ? (
        <Text className="text-lg text-red-600">
          Error: {moviesError?.message || trendingMoviesError?.message}
        </Text>
      ) : (
        <View className="flex-1 mt-5">
          <FlatList
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <>
                <Image
                  source={icons.logo}
                  className="w-15 h-12 mt-20 mb-5 mx-auto"
                  resizeMode="contain"
                />
                <TouchableOpacity className="w-[30%] mx-auto">
                  <Text className="text-black font-bold text-xl text-center px-4 py-3 bg-green-600 rounded-xl">
                    Connect
                  </Text>
                </TouchableOpacity>
                {trendingMovies && (
                  <View className="mt-10">
                    <Text className="text-lg text-white font-bold mt-5 mb-3 ml-2">
                      Trending Movies
                    </Text>
                  </View>
                )}
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  ItemSeparatorComponent={() => <View className="w-4"></View>}
                  className="mt-4 mb-3"
                  data={trendingMovies}
                  renderItem={({ item, index }) => (
                    <TrendingMovieCard movie={item} index={index} />
                  )}
                  keyExtractor={(item) => item.movie_id.toString()}
                />

                <Text className="text-lg text-white mt-5 mb-3 font-bold ml-2">
                  Latest Movies
                </Text>
              </>
            }
            data={movies}
            renderItem={({ item }) => <MovieCard {...item} />}
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
}
