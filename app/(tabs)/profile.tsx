import { client, getUserDetails, loginWithGoogleService, saveUserDetails } from "@/services/appwrite";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Account } from "react-native-appwrite";



const Profile = () => {

  const [loading,setLoading] = useState(false);
  const [isloggedIn, setLoggedin] = useState(false)
  const [firstName,setFirstName] = useState("");
  const [lastName,setLastName] = useState("");
  const [username,setUserName] = useState("");
  const [bio,setBio] = useState("");
  const [saved,setSaved] = useState(false);

  // const checkAuthStatus = async()=>{
  //     try {
  //       setLoading(true);
  //       const account = new Account(client);
  //       const user = await account.get();
  //       setLoggedin(!!user?.$id)
  //     } catch (error) {
  //       console.log("Error: ",error);
  //       setLoggedin(false);
  //     }finally{
  //       setLoading(false);
  //     }
  //   }

  const handleGooglelogin =  async()=>{
    try {
      setLoading(true);
      const success = await loginWithGoogleService();
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

  const handleSaveButton = async()=>{
    try {
      setLoading(true);
      const saveSuccess = await saveUserDetails(username,firstName,lastName,bio);
      setSaved(saveSuccess)
    } catch (error) {
      console.log("Error while saving details: ",error);
      setSaved(false);
    }finally{
      setLoading(false);
    }
  }
  
  

  useEffect(()=>{

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
    checkAuthStatus();
  },[])

  useEffect(()=>{

    const fillUserDetails = async()=>{
      try {
        setLoading(true);
        const account = new Account(client);
        const user = await account.get();
        if(user){
          const {username,firstName,lastName,bio}= await getUserDetails(user.$id);
          setUserName(username);
          setFirstName(firstName);
          setLastName(lastName);
          setBio(bio);
        }
      } catch (error) {
        console.log("Error while filling user details",error)
      }finally{
        setLoading(false);
      }
    }

    fillUserDetails();
  },[])

  if (loading){
    return(
      <View className="bg-primary px-10 flex-1">
          <ActivityIndicator size='large' />
      </View>
    )
  }


  return (
    <View className="bg-primary px-10 flex-1">
      {isloggedIn ? (
        //logged in view - Profile/Edit form
        <View className="bg-purple-950 rounded-2xl p-6 shadow-lg mt-20">
          <Text className="text-2xl font-bold text-center mb-6 text-white">Edit Profile</Text>
          
          <View className="flex-row mb-4">
            <View className="flex-1 mr-2">
              <Text className="text-sm font-medium text-white mb-1">First Name</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-900 text-white"
                onChangeText={(text) => setFirstName(text)}
                value={firstName}
                placeholder="Enter first name"
              />
            </View>
            <View className="flex-1 ml-2">
              <Text className="text-sm font-medium text-white mb-1">Last Name</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-900 text-white"
                onChangeText={(text) => setLastName(text)}
                value={lastName}
                placeholder="Enter last name"
              />
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-white mb-1">Username</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-900 text-white"
              onChangeText={(text) => setUserName(text)}
              value={username}
              placeholder="Enter username"
            />
          </View>

          <View className="mb-6">
            <Text className="text-sm font-medium text-white mb-1">Bio</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-900 h-20 text-align-top text-white"
              onChangeText={(text) => setBio(text)}
              value={bio}
              placeholder="Tell us about yourself..."
              multiline
            />
          </View>

          <View className="flex-row justify-between">
            <TouchableOpacity 
              onPress={handleSaveButton}
              className="bg-red-600 rounded-full px-6 py-3 flex-1 mr-2"
            >
              <Text className="text-white font-semibold text-center">Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleLogOut}
              className="bg-gray-200 rounded-full px-6 py-3 flex-1 ml-2 "
            >
              <Text className="text-gray-700 font-semibold text-center mt-2 ">Log out</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) 
      :(
        //logged out view
        <View className="flex justify-center items-center mt-20">
          <TouchableOpacity onPress={handleGooglelogin}>
            <Text className="text-black font-semibold rounded-full px-5 py-5 bg-green-600">Log in with Google</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Profile;
