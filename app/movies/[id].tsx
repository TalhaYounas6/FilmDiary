import { language } from "@/assets/languages";
import { Heart } from "@/components/Heart";
import { icons } from "@/constants/icons";
import { fetchMovieDetails } from "@/services/api";
import { addToSavedMovies, checkLikedStatus, client, removeFromSavedMovies } from "@/services/appwrite";
import { useFetch } from "@/services/useFetch";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Account } from "react-native-appwrite";



interface MovieProps {
  label: string,
  content?: string | number | null
}

const MovieItem = ({label,content}:MovieProps) =>(
  <View className="flex-col justify-center items-start mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    <Text className="text-light-200 font-bold text-sm">{content || 'N/A'}</Text>
  </View>
)


const MovieDetails = () => {

  const [isLoggedIn,setLoggedin] = useState(false);
  const [loadingState,setLoadingState] = useState(false);
  const [isLiked,setIsLiked] = useState(false);
  const [likeOperationLoading, setLikeOperationLoading] = useState(false)

  const {id} = useLocalSearchParams();
  const {data:movie,loading} = useFetch(()=>fetchMovieDetails(id as string));
  
  useEffect(()=>{
    const checkAuthStatus = async()=>{
    try {
      setLoadingState(true);
      const account = new Account(client);
      const user = await account.get();
      setLoggedin(!!user?.$id)
    } catch (error) {
      console.log("Error: ",error);
      setLoggedin(false);
    }finally{
      setLoadingState(false);
    }
  }
    checkAuthStatus();
  },[id])

  useEffect(()=>{

    const checkingLikeStatus = async()=>{
    try {
      setLoadingState(true);
      if(movie){
      const status = await checkLikedStatus(movie);
      setIsLiked(status);
      }
    } catch (error) {
      console.log("Error checking like status ", error);
    }finally{
      setLoadingState(false);
    }
  }   
  if(isLoggedIn){
    checkingLikeStatus();
  }else{
    setIsLiked(false);
  }
  },[id,isLoggedIn,movie])
      
  
  
  const handleLikeToggle = async()=>{

    const prevLikeState = isLiked;
    setIsLiked(!isLiked);
    setLikeOperationLoading(true);

    try {
      if(movie){
      if(!prevLikeState){
        //if it wasn't liked before, liking it now
        const success = await addToSavedMovies(movie);
        if(!success) throw new Error("Failed to add movie to favourites");
      }else{
        //if liked before, now unliking it
        const success = await removeFromSavedMovies(movie);
        if(!success) throw new Error("Failed to remove movie from favourites")
      }
      }
    } catch (error) {
      console.log("Like operation failed (movie details file): ",error);
      setIsLiked(prevLikeState);
    }finally{
      setLikeOperationLoading(false);
    }

  }


  let code = movie?.original_language;
  let lang;
            
  for(const key in language){
      if(code == key ){
	      lang = language[key as keyof typeof language];
      }
    }
          
  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{
        paddingBottom:80
      }}>
        <View>
          <Image 
          className="w-full h-[550px]"
          resizeMode="stretch"
          source={{uri: `https://image.tmdb.org/t/p/w500/${movie?.poster_path}`}}
          />
        </View>
        <View className="flex-col items-start justify-center mt-5 px-5">
          <View className="flex-row justify-between items-center flex-wrap">
          <Text className="text-white text-xl font-bold">{movie?.title}</Text>
          <View style={{width:50,height:50}}>
            {/* {loadingState ? null : <Heart toggleLike={handleLikeToggle} isLiked={isLiked} isLoading={likeOperationLoading} isNotLoggedIn={!isLoggedIn}/>} */}
          <Heart toggleLike={handleLikeToggle} isLiked={isLiked} isLoading={likeOperationLoading} isNotLoggedIn={!isLoggedIn}/>
          
          </View>
          </View>
          <View className="flex-row items-center gap-x-2 mt-2">
            <Text className="text-light-200 text-sm">{movie?.release_date.split('-')[0]}</Text>
            <Text className="text-sm text-light-200">{movie?.runtime}m</Text>
          </View>

          <View className="rounded-md flex-row items-center px-2 py-1 mt-2 gap-x-1 bg-dark-100">
             <Image
              source={icons.star}
              className="size-4"
             />
             <Text className="text-sm font-bold text-white">{Math.round(movie?.vote_average?? 0)/2}/5</Text>
             <Text className="text-sm text-light-200">({movie?.vote_count} votes)</Text>
          </View>
          
          <MovieItem label="Overview" content={movie?.overview}/>

          <MovieItem label="Genre" content={movie?.genres.map((g)=>g.name).join(' - ') || 'N/A'}/>

          <View className="flex flex-row justify-between w-1/2">
            <MovieItem label="Budget" content={`$${Math.round(movie?.budget/1000000)} million` || 'N/A'}/>
            <MovieItem label="Revenue" content={`$${Math.round(movie?.revenue/1000000)} million` || 'N/A'}/>
          </View>
          
          <MovieItem label="Language"  content={lang}/>

          <MovieItem label="Production" content={movie?.production_companies.map((c)=>c.name).join(' - ') || 'NA'}/>
          <MovieItem label="Filming Locations" content={movie?.production_countries.map((c)=>c.name).join(' - ') || 'NA'} />

        </View>
      </ScrollView>

      <TouchableOpacity className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
       onPress={router.back}
       >
        <Image 
         source={icons.arrow}
         className="size-5 mr-1 mt-0.5 rotate-180"
         tintColor="#fff"
        />
        <Text className="text-white font-semibold text-base">
          Go Back
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default MovieDetails;
