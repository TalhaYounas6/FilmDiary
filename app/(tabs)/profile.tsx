import { useAuth } from "@/context/AuthContext";
import {
  getUserDetails,
  saveUserDetails,
  updateUserAvatar,
} from "@/services/appwrite";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function Profile() {
  const { session, user, logout } = useAuth();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUserName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");

  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchDetails = async () => {
      if (!user?.$id) return;

      try {
        setIsFetching(true);
        const data = await getUserDetails(user.$id);

        if (isMounted && data) {
          setUserName(data.user_name || "");
          setFirstName(data.first_Name || "");
          setLastName(data.last_Name || "");
          setBio(data.bio_ || "");
          setAvatar(data.avatar || "");
        }
      } catch (error) {
        console.log("Error fetching profile:", error);
      } finally {
        if (isMounted) setIsFetching(false);
      }
    };

    fetchDetails();

    return () => {
      isMounted = false;
    };
  }, [user?.$id]);

  if (!session || !user) {
    return (
      <View className="flex-1 justify-center items-center bg-primary px-6">
        <View className="bg-purple-950/40 p-8 rounded-2xl w-full border border-purple-900/30">
          <Text className="text-white text-3xl font-bold mb-4 text-center">
            Profile
          </Text>
          <Text className="text-gray-400 text-center mb-8 text-lg leading-6">
            Log in to track your watched movies, customize your profile, and
            connect with others.
          </Text>

          <TouchableOpacity
            onPress={() => router.push("/signin")}
            className="w-full bg-purple-600 py-4 rounded-xl mb-4"
          >
            <Text className="text-center font-bold text-white text-lg">
              Log In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/signup")}
            className="w-full border-2 bg-red-600 py-4 rounded-xl"
          >
            <Text className="text-center font-bold text-white text-lg">
              Create Account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      // might need to pass user.$id
      await saveUserDetails(user.$id, username, firstName, lastName, bio);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error: any) {
      Alert.alert("Error", "Failed to update profile.");
      console.log("Save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      Alert.alert("Error", "Failed to log out.");
    }
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      try {
        setIsSaving(true);

        // passing avatar state as old avatar url
        const newAvatar = await updateUserAvatar(
          user!.$id,
          result.assets[0].uri,
          avatar,
        );

        setAvatar(newAvatar);

        Alert.alert("Profile picture updated successfully!");
      } catch (error) {
        Alert.alert("Error!Failed to update profile picture");
        console.log("Error in image picker: ", error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (isFetching) {
    return (
      <View className="bg-primary flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-primary"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 px-6 pt-20">
          <View className="items-center mb-10 mt-2">
            <TouchableOpacity
              onPress={handleImagePick}
              className="relative shadow-xl shadow-purple-900/50"
            >
              <Image
                key={avatar}
                source={
                  avatar
                    ? { uri: avatar }
                    : require("@/assets/images/defaultAvatar.jpg")
                }
                className="w-32 h-32 rounded-full border-4 border-purple-500"
                resizeMode="cover"
              />

              <View className="absolute bottom-0 right-2 bg-pink-500 w-10 h-10 rounded-full justify-center items-center border-4 border-primary">
                <Text className="text-white font-black text-xl mb-1">+</Text>
              </View>
            </TouchableOpacity>

            <Text className="text-purple-300 font-medium text-sm mt-4 tracking-wide">
              Tap to change photo
            </Text>
          </View>

          <View className="w-full">
            <View className="flex-row gap-4 mb-6">
              <View className="flex-1">
                <Text className="text-purple-200 text-sm font-semibold mb-2 ml-1">
                  First Name
                </Text>
                <TextInput
                  className="border border-purple-800/50 rounded-2xl px-5 py-4 bg-purple-900/20 text-white font-medium"
                  onChangeText={setFirstName}
                  value={firstName}
                  placeholder="First Name"
                  placeholderTextColor="#8a7aa3"
                />
              </View>
              <View className="flex-1">
                <Text className="text-purple-200 text-sm font-semibold mb-2 ml-1">
                  Last Name
                </Text>
                <TextInput
                  className="border border-purple-800/50 rounded-2xl px-5 py-4 bg-purple-900/20 text-white font-medium"
                  onChangeText={setLastName}
                  value={lastName}
                  placeholder="Last Name"
                  placeholderTextColor="#8a7aa3"
                />
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-purple-200 text-sm font-semibold mb-2 ml-1">
                Username
              </Text>
              <TextInput
                className="border border-purple-800/50 rounded-2xl px-5 py-4 bg-purple-900/20 text-white font-medium"
                onChangeText={setUserName}
                value={username}
                placeholder="Enter username"
                placeholderTextColor="#8a7aa3"
                autoCapitalize="none"
              />
            </View>

            <View className="mb-10">
              <Text className="text-purple-200 text-sm font-semibold mb-2 ml-1">
                Bio
              </Text>
              <TextInput
                className="border border-purple-800/50 rounded-2xl px-5 py-4 bg-purple-900/20 text-white font-medium h-32"
                onChangeText={setBio}
                value={bio}
                placeholder="Tell us about yourself..."
                placeholderTextColor="#8a7aa3"
                multiline
                textAlignVertical="top"
              />
            </View>
          </View>

          <View className="flex-row gap-4 mt-4 w-full">
            <TouchableOpacity
              onPress={handleSave}
              disabled={isSaving}
              className={`flex-1 py-3 rounded-xl shadow-lg justify-center ${isSaving ? "bg-red-900" : "bg-purple-600"}`}
            >
              {isSaving ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text className="text-white font-bold text-base text-center tracking-wide">
                  Save
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogout}
              className="flex-1 py-3 rounded-xl border-2 border-purple-800 bg-transparent justify-center"
            >
              <Text className="text-purple-300 font-bold text-base text-center tracking-wide">
                Log Out
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
