import { AntDesign } from "@expo/vector-icons"
import React from 'react'
import { ActivityIndicator, TouchableOpacity, View } from 'react-native'

interface HeartProps {
    isLiked : boolean,
    toggleLike : ()=>void,
    isLoading: boolean,
    isNotLoggedIn: boolean
}


export const Heart = ({isLiked,toggleLike,isLoading=false,isNotLoggedIn}: HeartProps) => {
    

  return (
    <TouchableOpacity onPress={toggleLike} disabled={isLoading || isNotLoggedIn} className='flex flex-row items-center'>
        <AntDesign 
        name={isLiked?"heart":'hearto'}
        size={30}
        color={isLiked?"red":"gray"}
        className='p-5'
        />
        <View>
        {isLoading && <ActivityIndicator />}
        </View>
    </TouchableOpacity>
  )
}

