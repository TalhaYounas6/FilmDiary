import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  BackHandler,
  Easing,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface CustomModalProps {
  onConfirm: () => void;
  onCancel?: () => void;
  title: string;
  message: string;
  isVisible: boolean;
  confirmText?: string;
  cancelText?: string;
}

const CustomModal = ({
  onConfirm,
  onCancel,
  title,
  message,
  isVisible,
  confirmText = "Okay",
  cancelText = "Cancel",
}: CustomModalProps) => {
  const [mounted, setMounted] = useState(isVisible);

  const opacity = useRef(new Animated.Value(isVisible ? 1 : 0)).current;
  const scale = useRef(new Animated.Value(isVisible ? 1 : 0.92)).current;
  const backdropOpacity = useRef(
    new Animated.Value(isVisible ? 0.75 : 0),
  ).current;

  const handleClose = onCancel || onConfirm;

  useEffect(() => {
    if (isVisible) {
      setMounted(true);

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          damping: 18,
          stiffness: 180,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0.75,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (mounted) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 180,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.92,
          duration: 180,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ])
    }
  }, [isVisible]);

  useEffect(() => {
    if (!mounted) return;

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        handleClose();
        return true;
      },
    );

    return () => backHandler.remove();
  }, [mounted, handleClose]);

  if (!mounted) return null;

  return (
    <View
      pointerEvents="box-none"
      className="absolute inset-0 z-50 items-center justify-center"
    >
      <Animated.View
        pointerEvents="auto"
        style={{ opacity: backdropOpacity }}
        className="absolute inset-0 bg-[#030014]"
      >
        <Pressable className="flex-1" onPress={handleClose} />
      </Animated.View>

      <Animated.View
        style={{
          opacity,
          transform: [{ scale }],
        }}
        className="mx-6 w-full max-w-[390px] overflow-hidden rounded-3xl border border-purple-400/30 bg-[#160d24]"
      >
        <View className="h-1.5 w-full bg-purple-500" />

        <View className="items-center px-6 pb-6 pt-7">
          <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-purple-500/15">
            <Ionicons name="star-half-outline" size={30} color="#c084fc" />
          </View>

          <Text className="mb-2 text-center text-2xl font-bold text-white">
            {title}
          </Text>

          <Text className="mb-7 text-center text-base leading-6 text-purple-200">
            {message}
          </Text>

          <View className="w-full flex-row gap-3">
            {onCancel && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onCancel}
                className="flex-1 items-center justify-center rounded-2xl border border-purple-400/30 bg-purple-950/60 py-3.5"
              >
                <Text className="text-base font-semibold text-purple-200">
                  {cancelText}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onConfirm}
              className="flex-1 items-center justify-center rounded-2xl bg-purple-500 py-3.5"
            >
              <Text className="text-base font-bold text-white">
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

export default CustomModal;
