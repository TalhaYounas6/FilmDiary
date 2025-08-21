import { View, Text,TouchableOpacity,ActivityIndicator} from 'react-native'
import React,{useState} from 'react'
import {AntDesign} from "@expo/vector-icons"

interface HeartProps {
    isLiked : boolean,
    toggleLike : ()=>void,
    isLoading?: boolean
}


export const Heart = ({isLiked,toggleLike,isLoading=false}: HeartProps) => {
    

  return (
    <TouchableOpacity onPress={toggleLike} disabled={isLoading}>
        <AntDesign 
        name={isLiked?"heart":'hearto'}
        size={30}
        color={isLiked?"red":"gray"}
        className='p-5'
        />
        {isLoading && <ActivityIndicator />}
    </TouchableOpacity>
  )
}

