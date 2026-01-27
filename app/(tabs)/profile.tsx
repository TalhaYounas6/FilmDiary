import { useAuth } from "@/context/AuthContext";
import { getUserDetails, saveUserDetails } from "@/services/appwrite";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
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
            className="w-full bg-black py-4 rounded-xl mb-4"
          >
            <Text className="text-center font-bold text-white text-lg">
              Log In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/signup")}
            className="w-full border-2 bg-red-800 py-4 rounded-xl"
          >
            <Text className="text-center font-bold text-white text-lg">
              Create Account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 3. Handle Save Changes
  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      //might need to pass user.$id
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

  if (isFetching) {
    return (
      <View className="bg-primary flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="bg-primary px-6 flex-1 pt-10">
        <View className="bg-purple-950/50 rounded-2xl p-6 shadow-lg border border-purple-900/50 mt-10">
          <Text className="text-2xl font-bold text-center mb-6 text-white">
            Edit Profile
          </Text>

          {/* Name Row */}
          <View className="flex-row gap-4 mb-4">
            <View className="flex-1">
              <Text className="text-gray-300 text-sm mb-1 ml-1">
                First Name
              </Text>
              <TextInput
                className="border border-gray-600 rounded-xl px-4 py-3 bg-gray-900 text-white"
                onChangeText={setFirstName}
                value={firstName}
                placeholder="First Name"
                placeholderTextColor="#666"
              />
            </View>
            <View className="flex-1">
              <Text className="text-gray-300 text-sm mb-1 ml-1">Last Name</Text>
              <TextInput
                className="border border-gray-600 rounded-xl px-4 py-3 bg-gray-900 text-white"
                onChangeText={setLastName}
                value={lastName}
                placeholder="Last Name"
                placeholderTextColor="#666"
              />
            </View>
          </View>

          {/* Username */}
          <View className="mb-4">
            <Text className="text-gray-300 text-sm mb-1 ml-1">Username</Text>
            <TextInput
              className="border border-gray-600 rounded-xl px-4 py-3 bg-gray-900 text-white"
              onChangeText={setUserName}
              value={username}
              placeholder="Enter username"
              placeholderTextColor="#666"
              autoCapitalize="none"
            />
          </View>

          {/* Bio */}
          <View className="mb-8">
            <Text className="text-gray-300 text-sm mb-1 ml-1">Bio</Text>
            <TextInput
              className="border border-gray-600 rounded-xl px-4 py-3 bg-gray-900 text-white h-24 text-align-top"
              onChangeText={setBio}
              value={bio}
              placeholder="Tell us about yourself..."
              placeholderTextColor="#666"
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Buttons */}
          <View className="flex-row gap-4">
            <TouchableOpacity
              onPress={handleSave}
              disabled={isSaving}
              className={`flex-1 py-4 rounded-full ${isSaving ? "bg-red-800" : "bg-red-600"}`}
            >
              {isSaving ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold text-center">
                  Save Changes
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogout}
              className="flex-1 bg-gray-700 py-4 rounded-full"
            >
              <Text className="text-white font-semibold text-center">
                Log Out
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
