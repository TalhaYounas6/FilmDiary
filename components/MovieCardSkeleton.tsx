import { View } from "react-native";

export const MovieCardSkeleton = ({ customClass }: any) => {
  return (
    <View className={`bg-dark-100 rounded-xl ${customClass} animate-pulse`} />
  );
};
