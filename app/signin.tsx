import { useAuth } from "@/context/AuthContext";
import { Link, Redirect } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignIn() {
  const { session, login, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const validateInput = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateInput()) return;

    try {
      await login({ email, password });

    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    }
  };

  if (session) return <Redirect href="/(tabs)/profile" />;

  return (
    <View className="bg-primary px-10 flex-1 justify-center gap-4">
      <Text className="text-white text-3xl font-bold mb-5">Welcome Back</Text>

      {/* Email Input */}
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

      {/* Password Input */}
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
          <Text className="text-white font-semibold text-lg">Sign In</Text>
        )}
      </TouchableOpacity>

      <View className="flex-row justify-center mt-5">
        <Text className="text-gray-400">Don't have an account? </Text>
        <Link href="../signup" asChild>
          <TouchableOpacity>
            <Text className="text-blue-500 font-semibold">Sign Up</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
