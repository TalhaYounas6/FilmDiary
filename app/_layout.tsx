import { AuthProvider, chatClient } from "@/context/AuthContext";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Chat, OverlayProvider } from "stream-chat-expo";
// import { chatClient } from "@/context/AuthContext";
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

  // const streamDarkTheme = {
  //   colors: {
  //     // accent_blue: "#a855f7",
  //     black: "#ffffff",
  //     // white: "#121212",
  //     white_snow: "#030014",
  //     // white_smoke: "#2a2a2a",
  //     grey_gainsboro: "#333333",
  //     ownMessageBubbleBackgroundColor: "#a855f7",
  //     otherMessageBubbleBackgroundColor: "#2a2a2a",
  //     ownMessageTextColor: "#ffffff",
  //     otherMessageTextColor: "#ffffff",
  //   },
  // };

  // const customTheme: DeepPartial<Theme> = {
  //   colors: {
  //     // accent_blue: "#a855f7",
  //     black: "#ffffff",
  //     // white: "#121212",
  //     white_snow: "#030014",
  //     // white_smoke: "#2a2a2a",
  //     grey_gainsboro: "#333333",
  //   },
  //   messageSimple: {
  //     content: {
  //
  //       textContainer: {
  //         backgroundColor: "#a855f7",
  //         borderRadius: 20,
  //       },
  //       // Changes text color
  //       markdown: {
  //         text: {
  //           color: "white",
  //         },
  //       },
  //     },
  //   },
  // };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={MyDarkTheme}>
        <OverlayProvider>
          <Chat client={chatClient}>
            <AuthProvider>
              <StatusBar hidden={true} />
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="movies/[id]" />
                <Stack.Screen name="signin" />
                <Stack.Screen name="signup" />
                <Stack.Screen name="connect" />
                <Stack.Screen name="matchResults" />
                <Stack.Screen name="chat/[id]" />
              </Stack>
            </AuthProvider>
          </Chat>
        </OverlayProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
