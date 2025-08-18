import { LoginWithGoogleService, client } from "@/services/appwrite";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { Account } from "react-native-appwrite";
const Profile = () => {

  const [loading,setLoading] = useState(false);
  const [isloggedIn, setLoggedin] = useState(false)

  const checkAuthStatus = async()=>{
      try {
        setLoading(true);
        const account = new Account(client);
        const user = await account.get();
        setLoggedin(!!user?.$id)
      } catch (error) {
        console.log("Error: ",error);
        setLoggedin(false);
      }finally{
        setLoading(false);
      }
    }

  const handleGooglelogin =  async()=>{
    try {
      setLoading(true);
      const success = await LoginWithGoogleService();
      setLoggedin(success);
    } catch (error) {
      console.log("Login Error: ",error);
      setLoggedin(false)
    }finally{
      setLoading(false)
    }
  }

  const handleLogOut = async()=>{
    try {
      setLoading(true);
      const account = new Account(client);
      await account.deleteSession('current');
      setLoggedin(false);
    } catch (error) {
      console.log("Log out error: ",error);
    }finally{
      setLoading(false);
    }
  }
  
  

  useEffect(()=>{
    checkAuthStatus();
  },[])

  if (loading){
    return(
      <View className="bg-primary px-10 flex-1">
          <ActivityIndicator size='large' />
      </View>
    )
  }


  return (
    <View className="bg-primary px-10 flex-1 justify-center items-center">
      {isloggedIn?(
        //logged in view
        <View  className="flex justify-center items-center">
          <TouchableOpacity onPress={handleLogOut}>
            <Text className="text-white rounded-full px-5 py-5 bg-green-600">Log out</Text>
          </TouchableOpacity>
        </View>
      )
      :(
        //logged out view
        <View className="flex justify-center items-center">
          <TouchableOpacity onPress={handleGooglelogin} >
            <Text className="text-white rounded-full px-5 py-5 bg-green-600">Log in with Google</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Profile;
