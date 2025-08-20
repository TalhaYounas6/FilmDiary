import { View, Text,TouchableOpacity} from 'react-native'
import React,{useState} from 'react'
import {AntDesign} from "@expo/vector-icons"

export const Heart = () => {
    const [isliked,setisLiked] = useState(false);

    const toggleLike = ()=>{
        setisLiked(!isliked);
    }

  return (
    <TouchableOpacity onPress={toggleLike}>
        <AntDesign 
        name={isliked?"heart":'hearto'}
        size={30}
        color={isliked?"red":"gray"}
        className='p-5'
        />
    </TouchableOpacity>
  )
}

export default Heart