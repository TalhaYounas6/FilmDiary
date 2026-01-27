import { useAuth } from "@/context/AuthContext";
import { Link, Redirect, router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignUp() {
  const { session, register, loading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  const validateInput = () => {
    const newErrors: { name?: string; email?: string; password?: string } = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateInput()) return;

    try {
      await register({ email, password, name });
    } catch (error: any) {
      Alert.alert("Registration Failed", error.message);
    }
  };

  if (session) return <Redirect href="/(tabs)/profile" />;

  return (
    <View className="bg-primary px-10 flex-1 justify-center gap-4">
      <Text className="text-white text-3xl font-bold mb-5">Create Account</Text>

      <View>
        <Text className="text-gray-100 mb-2">Name</Text>
        <TextInput
          onChangeText={setName}
          className="border border-gray-600 rounded-lg px-4 py-4 bg-gray-900 text-white"
          value={name}
          placeholder="Enter full name"
          placeholderTextColor="#666"
        />
        {errors.name && (
          <Text className="text-red-500 text-sm mt-1">{errors.name}</Text>
        )}
      </View>

      <View>
        <Text className="text-gray-100 mb-2">Email</Text>
        <TextInput
          onChangeText={setEmail}
          className="border border-gray-600 rounded-lg px-4 py-4 bg-gray-900 text-white"
          value={email}
          placeholder="Enter email"
          placeholderTextColor="#666"
          autoCapitalize="none"
          keyboardType="email-address"
        />
        {errors.email && (
          <Text className="text-red-500 text-sm mt-1">{errors.email}</Text>
        )}
      </View>

      <View>
        <Text className="text-gray-100 mb-2">Password</Text>
        <TextInput
          onChangeText={setPassword}
          className="border border-gray-600 rounded-lg px-4 py-4 bg-gray-900 text-white"
          value={password}
          placeholder="Enter password"
          placeholderTextColor="#666"
          secureTextEntry
        />
        {errors.password && (
          <Text className="text-red-500 text-sm mt-1">{errors.password}</Text>
        )}
      </View>

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={loading}
        className={`rounded-full py-4 mt-5 items-center ${loading ? "bg-blue-800" : "bg-blue-600"}`}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-semibold text-lg">Sign Up</Text>
        )}
      </TouchableOpacity>
      <View className="flex-col items-center">
        <View className="flex-row justify-center mt-5 items-center">
          <Text className="text-gray-400">Already have an account? </Text>
          <Link href="../signin" asChild>
            <TouchableOpacity>
              <Text className="text-blue-500 font-semibold">Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
        <TouchableOpacity className="mt-5" onPress={() => router.replace("/")}>
          <Text className="text-red-500 rounded-2xl bg-red-900 px-5 py-2 font-semibold">
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
