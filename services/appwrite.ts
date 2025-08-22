import { makeRedirectUri } from 'expo-auth-session';
import { useRouter } from "expo-router";
import * as WebBrowser from 'expo-web-browser';
import { Account, Client, Databases, ID, OAuthProvider, Query } from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
const COLLECTION_ID2 = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID2!;
const COLLECTION_ID3 = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID3!;

const router = useRouter();

export const client = new Client()
  .setEndpoint("https://nyc.cloud.appwrite.io/v1")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const databases = new Databases(client);

//track user searches

export const updateSearchCount = async (query: string, movie: Movie) => {
  // check if there is a document for a movie and if there is it will increment it

  // if no document then create one in appwrite database
  try {
    const result = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("search_Term", query),
    ]);

    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        existingMovie.$id,
        {
          count: existingMovie.count + 1,
        }
      );
    } else {
      await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        search_Term: query,
        movie_id: movie.id,
        count: 1,
        title: movie.title,
        poster_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
      });
    }
  } catch (error) {
    console.log(error);
    throw new Error();
  }
};

export const getTrendingMovies = async (): Promise<TrendingMovie[]> => {
  try {
    const result = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);
    return result.documents as unknown as TrendingMovie[];
  } catch (error) {
    console.log(error);
    return undefined as unknown as TrendingMovie[];
  }
};



export const loginWithGoogleService = async(): Promise<boolean> =>{

  try{
  const account = new Account(client);

  // Create deep link that works across Expo environments
  // Ensure localhost is used for the hostname to validation error for success/failure URLs
  const deepLink = new URL(makeRedirectUri({ preferLocalhost: true }));
  const scheme = `${deepLink.protocol}//`; // e.g. 'exp://' or 'appwrite-callback-<PROJECT_ID>://'

  // Start OAuth flow
  const provider = OAuthProvider.Google;
  const loginUrl = await account.createOAuth2Token(
    provider,
    `${deepLink}`,
    `${deepLink}`,  
  );

  // Open loginUrl and listen for the scheme redirect
  const result = await WebBrowser.openAuthSessionAsync(`${loginUrl}`, scheme);

  // Extract credentials from OAuth redirect URL
  if( result.type==="success" && result.url){
    const url = new URL(result.url);
    const secret = url.searchParams.get('secret');
    const userId = url.searchParams.get('userId');

    // Create session with OAuth credentials
  if(typeof(userId)==="string" && typeof(secret)==="string"){
    await account.createSession(userId, secret);
    return true;
      }
  }
      return false;

    }catch(error){
    console.log("Error: ",error);
    return false;
    
  }finally{
    // Redirect as needed
    router.push('/(tabs)/profile');
  }
  


}

export const saveUserDetails = async(userName: string,firstName: string,lastName: string,bio: string):Promise<boolean>=>{
  try {

    // first check if user is already in the collection if yes then write code to update the fields
    // if not then write code to make new entry
    const account = new Account(client);
    const user = await account.get()
    
    const google_id = user.$id;
  

    //query database collection and check if id from google exists in id field in collection
    //if yes then udate other fields with new values
    //if no then make a new document with these values and insert into the collection

    const result = await databases.listDocuments(DATABASE_ID,COLLECTION_ID2,[
      Query.equal("user_id",google_id)
    ]);

    const existingUser = result.documents[0];

    if(result.documents.length > 0){
      await databases.updateDocument(DATABASE_ID,COLLECTION_ID2,existingUser.$id,{
        username: userName,
        firstname: firstName,
        lastname: lastName,
        bio: bio
      })
    } else{
      await databases.createDocument(DATABASE_ID,COLLECTION_ID2,ID.unique(),{
        user_id: google_id,
        username: userName,
        firstname: firstName,
        lastname: lastName,
        bio: bio,
      })
    }
    return true
  } catch (error) {
    console.log("Error while Saving User Details: ",error)
    return false;
  }
}

export const addToSavedMovies = async(movie:MovieDetails): Promise<boolean> =>{
  try {

    const account = new Account(client);
    const user = await account.get()
    const google_id = user.$id;

    const document_id = `${google_id}_${movie.id}`.slice(0,36);

    const genres = movie?.genres.map((genre)=>genre.name)
    const release_date = movie.release_date.split('-')[0]
      //add document to saved collection
    const result = await databases.createDocument(DATABASE_ID,COLLECTION_ID3,document_id,{
        user_id: google_id,
        movie_id: movie.id,
        movie_name: movie.title,
        movie_genre: genres,
        movie_releaseDate : release_date
    })
    return true;
  } catch (error) {
      console.log("Error while adding to saved movies (appwrite file): ",error);
      return false
  }
}

export const removeFromSavedMovies = async(movie:MovieDetails): Promise<boolean>=>{
 
    try {
      
    const account = new Account(client);
    const user = await account.get()
    const google_id = user.$id;

    const document_id = `${google_id}_${movie.id}`.slice(0,36);

    //remove document from saved collection
    await databases.deleteDocument(DATABASE_ID,COLLECTION_ID3,document_id)
    return true;

    

    } catch (error) {
      console.log("Error while removing saved movies (appwrite file): ",error);
      return false
    }

}

export const checkLikedStatus = async(movie:MovieDetails):Promise<boolean>=>{
  try {
    const account = new Account(client);
    const user = await account.get()
    const google_id = user.$id;

    const document_id = `${google_id}_${movie.id}`.slice(0,36);
    
    await databases.getDocument(DATABASE_ID, COLLECTION_ID3, document_id);

    
    return true;
   
  } catch (error : any) {
    if(error.code === 404){
      console.log("Movie is not in saved");
      return false;
    }
    console.log("Error checking like status(appwrite file): ",error);
    return false;
  }
}

interface Userdetails {
  username : string,
  firstName : string,
  lastName : string,
  bio : string
}

export const getUserDetails = async(userId:string) : Promise<Userdetails> => {
  try {

    const account = new Account(client);
    const user = await account.get()
    const google_id = user.$id;

    //get user details from the collection and return
    const result  = await databases.listDocuments(DATABASE_ID,COLLECTION_ID2,[
      Query.equal("user_id",google_id)
    ])

    const username = result.documents[0].username;
    const firstName = result.documents[0].firstname;
    const lastName = result.documents[0].lastname;
    const bio = result.documents[0].bio;
  
    return { username,firstName,lastName,bio};

    
  } catch (error) {
    console.log("Error fetching user details (appwrite file):",error);
    throw new Error("Error while fetching user details");
  }
}