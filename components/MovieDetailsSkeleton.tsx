import { icons } from "@/constants/icons";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

export const MovieDetailsSkeleton = ({ goBack }: any) => {
  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Poster Skeleton */}
        <View className="w-full h-[550px] bg-dark-100" />

        <View className="flex-col items-start justify-center mt-5 px-5">
          {/* Title & Heart Icon Skeleton */}
          <View className="flex-row justify-between items-center w-full">
            <View className="h-8 w-2/3 bg-dark-100 rounded-md" />
            {/* <View className="w-[50px] h-[50px] bg-dark-100 rounded-full" /> */}
          </View>

          {/* Year & Runtime Skeleton */}
          <View className="flex-row gap-x-2 mt-4">
            <View className="h-4 w-12 bg-dark-100 rounded-md" />
            <View className="h-4 w-12 bg-dark-100 rounded-md" />
          </View>

          {/* Rating Pill Skeleton */}
          <View className="h-8 w-24 bg-dark-100 rounded-md mt-4" />

          {/* Overview Skeleton (Multiple lines) */}
          <View className="mt-6 w-full">
            <View className="h-5 w-24 bg-dark-100 rounded-md mb-2" />
            <View className="h-4 w-full bg-dark-100 rounded-md mb-2" />
            <View className="h-4 w-full bg-dark-100 rounded-md mb-2" />
            <View className="h-4 w-3/4 bg-dark-100 rounded-md" />
          </View>

          {/* Generic MovieItem Skeletons (Genre, Language, etc.) */}
          {[1, 2, 3].map((item) => (
            <View key={item} className="mt-6 w-full">
              <View className="h-5 w-20 bg-dark-100 rounded-md mb-2" />
              <View className="h-4 w-1/2 bg-dark-100 rounded-md" />
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Back Button (We keep this active so users can bail out if loading takes too long) */}
      <TouchableOpacity
        className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
        onPress={goBack}
      >
        <Image
          source={icons.arrow}
          className="size-5 mr-1 mt-0.5 rotate-180"
          tintColor="#fff"
        />
        {/* Replace with your actual icons.arrow if needed */}
        <Text className="text-white font-semibold text-base">Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};
