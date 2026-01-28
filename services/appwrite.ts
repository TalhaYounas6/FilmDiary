import { makeRedirectUri } from "expo-auth-session";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import {
  Account,
  Client,
  Databases,
  ID,
  OAuthProvider,
  Query,
} from "react-native-appwrite";

export const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
export const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
export const COLLECTION_ID2 = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID2!;
export const COLLECTION_ID3 = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID3!;

const router = useRouter();

export const client = new Client()
  .setEndpoint("https://nyc.cloud.appwrite.io/v1")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

export const databases = new Databases(client);

export const account = new Account(client);

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
        },
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

export const loginWithGoogleService = async (): Promise<boolean> => {
  try {
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
    if (result.type === "success" && result.url) {
      const url = new URL(result.url);
      const secret = url.searchParams.get("secret");
      const userId = url.searchParams.get("userId");

      // Create session with OAuth credentials
      if (typeof userId === "string" && typeof secret === "string") {
        await account.createSession(userId, secret);
        return true;
      }
    }
    return false;
  } catch (error) {
    console.log("Error: ", error);
    return false;
  } finally {
    // Redirect as needed
    router.push("/(tabs)/profile");
  }
};

export const saveUserDetails = async (
  userId: string,
  userName: string,
  firstName: string,
  lastName: string,
  bio: string,
): Promise<boolean> => {
  try {
    const data = {
      username: userName,
      firstname: firstName,
      lastname: lastName,
      bio: bio,
    };

    try {
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID2,
        userId, // Using userId as Document ID
        data,
      );
    } catch (error: any) {
      // If document not found (404), create it now.
      if (error.code === 404) {
        await databases.createDocument(
          DATABASE_ID,
          COLLECTION_ID2,
          userId, // Force Document ID to match Auth ID
          {
            ...data,
            user_id: userId,
            email: "email@placeholder.com",
          },
        );
      } else {
        throw error;
      }
    }

    return true;
  } catch (error) {
    console.log("Error while Saving User Details: ", error);
    return false;
  }
};

export const addToSavedMovies = async (
  userId: string,
  movie: AIReadyMovie,
): Promise<boolean> => {
  try {
    const document_id = `${userId}_${movie.id}`.slice(0, 36);
    // 1. Data Extraction
    const genreNames = movie.genres?.map((g) => g.name) || [];
    const releaseYear = movie.release_date?.split("-")[0] || "N/A";

    // AI Data (stuff for the algorithm)
    const director = movie.credits?.crew?.find((p) => p.job === "Director");
    const topActors = movie.credits?.cast?.slice(0, 3).map((a) => a.id) || [];
    const topKeywords =
      movie.keywords?.keywords?.slice(0, 5).map((k) => k.id) || [];
    const genreIds = movie.genres?.map((g) => g.id) || [];

    //SAVE TO APPWRITE
    await databases.createDocument(DATABASE_ID, COLLECTION_ID3, document_id, {
      user_id: userId,
      movie_id: movie.id,
      movie_name: movie.title,
      poster_path: movie.poster_path,
      movie_genre: genreNames,
      movie_releaseDate: releaseYear,
      vote_average: movie.vote_average || 0,
      original_language: movie.original_language || "en",

      genre_ids: JSON.stringify(genreIds),
      actor_ids: JSON.stringify(topActors),
      keyword_ids: JSON.stringify(topKeywords),

      collection_id: movie.belongs_to_collection
        ? movie.belongs_to_collection.id
        : null,
      director_id: director ? director.id : null,
      director_name: director ? director.name : null,
    });

    console.log("Movie saved with AI data!");
    return true;
  } catch (error: any) {
    // Error 409 means document exists (User already liked it)
    if (error.code === 409) {
      console.log("Movie already in favorites (Duplicate skipped).");
      return true;
    }
    console.log("Error while adding to saved movies:", error);
    return false;
  }
};

export const removeFromSavedMovies = async (
  userId: string,
  movieId: number,
): Promise<boolean> => {
  try {
    const document_id = `${userId}_${movieId}`.slice(0, 36);

    await databases.deleteDocument(DATABASE_ID, COLLECTION_ID3, document_id);

    return true;
  } catch (error: any) {
    // If error is 404, the document is already gone.
    if (error.code === 404) {
      console.log("Movie already removed (skipping delete).");
      return true;
    }

    console.log("Error while removing saved movie:", error);
    return false;
  }
};

export const checkLikedStatus = async (
  userId: string,
  movieId: number,
): Promise<boolean> => {
  try {
    const document_id = `${userId}_${movieId}`.slice(0, 36);

    await databases.getDocument(DATABASE_ID, COLLECTION_ID3, document_id);

    return true;
  } catch (error: any) {
    // If error is 404, document is missing
    if (error.code === 404) {
      return false;
    }

    console.log("Error checking like status:", error);
    return false;
  }
};

export const getUserDetails = async (userId: string): Promise<Userdetails> => {
  try {
    const result = await databases.getDocument(
      DATABASE_ID,
      COLLECTION_ID2,
      userId,
    );

    return {
      user_name: result.username || "",
      first_Name: result.firstname || "",
      last_Name: result.lastname || "",
      bio_: result.bio || "",
    };
  } catch (error: any) {
    // If the document doesn't exist yet, return empty strings so the form is blank but usable.
    if (error.code === 404) {
      return {
        user_name: "",
        first_Name: "",
        last_Name: "",
        bio_: "",
      };
    }

    console.log("Error fetching user details:", error);
    throw error;
  }
};

export const getSavedMovies = async (
  userId: string,
): Promise<FavouriteMovie[]> => {
  try {
    const result = await databases.listDocuments(DATABASE_ID, COLLECTION_ID3, [
      Query.equal("user_id", userId),
    ]);

    const movies = result.documents.map((doc) => ({
      id: doc.movie_id,
      title: doc.movie_name,
      release_date: doc.movie_releaseDate,
      poster_path: doc.poster_path,
    }));

    return movies as unknown as FavouriteMovie[];
  } catch (error) {
    console.log("Error fetching saved movies:", error);
    return [];
  }
};
