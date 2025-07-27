import MovieCard from "@/components/MovieCard";
import { SearchBar } from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import { useFetch } from "@/services/useFetch";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, View, Text } from "react-native";

const Search = () => {
  const [searchTerm, setSearchQuery] = useState("");

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
    reset,
    refetch,
  } = useFetch(() => fetchMovies({ query: searchTerm }), false);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchTerm.trim()) {
        await refetch();
      } else {
        reset();
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="z-0 flex-1 w-full absolute"
        resizeMode="cover"
      />
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <MovieCard {...item} />}
        numColumns={3}
        className="px-5"
        columnWrapperStyle={{
          justifyContent: "center",
          gap: 16,
          marginVertical: 16,
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          !moviesLoading && !moviesError ? (
            <View className="mt-20 px-5">
              <Text className="text-center text-gray-500">
                {searchTerm.trim() ? "No Movies Found" : "Search for a movie"}
              </Text>
            </View>
          ) : null
        }
        ListHeaderComponent={
          <>
            <View className="flex-row w-full justify-center mt-20">
              <Image source={icons.logo} className="w-12 h-10"></Image>
            </View>

            <View className="my-5">
              <SearchBar
                placeholder="Search movies..."
                OnChangeText={(text: string) => {
                  setSearchQuery(text);
                }}
                value={searchTerm}
              />
            </View>
            {moviesLoading && (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                className="my-3"
              />
            )}

            {moviesError && (
              <Text className="text-red-500 px-5 my-3">
                Error: {moviesError?.message}
              </Text>
            )}

            {!moviesError &&
              !moviesLoading &&
              "Search Term".trim() &&
              movies?.length > 0 && (
                <Text className="text-xl text-white font-bold">
                  Search results for {""}
                  <Text className="text-accent"> {searchTerm}</Text>
                </Text>
              )}
          </>
        }
      />
    </View>
  );
};

export default Search;
