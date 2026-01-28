import { AuthProvider } from "@/context/AuthContext";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "./globals.css";

export default function RootLayout() {
  const MyDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: "#030014",
      card: "#0f0f0f",
      text: "#ffffff",
    },
  };
  return (
    <AuthProvider>
      <ThemeProvider value={MyDarkTheme}>
        <StatusBar hidden={true} />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="movies/[id]" />
          <Stack.Screen name="signin" />
          <Stack.Screen name="signup" />
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}
