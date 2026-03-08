import { icons } from "@/constants/icons";
import React, { useRef } from "react";
import { Animated, Image, TextInput } from "react-native";

interface Props {
  placeholder: string;
  onPress?: () => void;
  value?: string;
  OnChangeText?: (text: string) => void;
}

export const SearchBar = ({
  placeholder,
  onPress,
  OnChangeText,
  value,
}: Props) => {
  const animation = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    Animated.spring(animation, {
      toValue: 1,
      useNativeDriver: false,
      bounciness: 25,
    }).start();
  };

  const handleBlur = () => {
    Animated.spring(animation, {
      toValue: 0,
      useNativeDriver: false,
    }).start();
  };

  const animatedStyle = {
    borderRadius: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [50, 12],
    }),

    transform: [
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.12],
        }),
      },
    ],

    elevation: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 10], // For Android shadow
    }),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 5], // For iOS shadow
      }),
    },
    shadowOpacity: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.3],
    }),
    shadowRadius: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 6],
    }),
  };

  return (
    <Animated.View
      style={animatedStyle}
      className="flex-row items-center bg-dark-200 px-5 py-4"
    >
      <Image
        source={icons.search}
        className="size-5"
        resizeMode="contain"
        tintColor="#ab8bff"
      />
      <TextInput
        onFocus={handleFocus}
        onBlur={handleBlur}
        onPressIn={onPress}
        placeholder={placeholder}
        value={value}
        onChangeText={OnChangeText}
        placeholderTextColor="#a8b5db"
        className="flex-1 ml-2 text-white"
      />
    </Animated.View>
  );
};
