import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';

interface HeartProps {
    isLiked : boolean,
    toggleLike : ()=>void,
    isLoading: boolean,
    isNotLoggedIn: boolean
}


export const Heart = ({isLiked,toggleLike,isLoading=false,isNotLoggedIn}: HeartProps) => {
    

  return (
    <TouchableOpacity onPress={toggleLike} disabled={isLoading || isNotLoggedIn} className='flex flex-row items-center'>
        <FontAwesome 
        name={isLiked?"heart":'heart-o'}
        size={30}
        color={isLiked?"red":"gray"}
        className='p-5'
        />
        <View>
        {isLoading && <ActivityIndicator className="mt-2"/>}
        </View>
    </TouchableOpacity>
  )
}

