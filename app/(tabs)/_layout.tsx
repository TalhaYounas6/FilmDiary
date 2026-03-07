import { icons } from "@/constants/icons";
import { Tabs } from "expo-router";
import React from "react";
import { Image, View } from "react-native";

const TabIcon = ({ icon, focused, title }: any) => {
  if (focused) {
    return (
      // <ImageBackground
      //   source={images.highlight2}
      //   className="flex flex-row w-full flex-1 min-w-[75px] min-h-16 mt-4 justify-center items-center rounded-full overflow-hidden"
      // >
      <View className="size-full justify-center items-center rounded-full mt-4">
        <Image
          source={icon}
          className="size-5"
          tintColor="#FF0000"
          resizeMode="contain"
        />
      </View>

      //   {/* <Text className="text-black text-base font-bold">{title}</Text> */}
      // {/* </ImageBackground> */}
    );
  }
  return (
    <View className="size-full justify-center items-center rounded-full mt-4">
      <Image source={icon} tintColor={"#A8B5DB"} className="size-5" />
    </View>
  );
};

const _Layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
        // "#0f0D23"
        tabBarStyle: {
          borderRadius: 50,
          backgroundColor: "#1b2431",
          marginHorizontal: 20,
          marginBottom: 36,
          height: 52,
          position: "absolute",
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "0f0D23",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} title="Home" icon={icons.home} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} title="Profile" icon={icons.person} />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          headerShown: false,
          title: "Saved",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} title="Saved" icon={icons.save} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          headerShown: false,
          title: "Search",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} title="Search" icon={icons.search} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          headerShown: false,
          title: "Messages",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} title="Chat" icon={icons.msg} />
          ),
        }}
      />
    </Tabs>
  );
};

export default _Layout;
