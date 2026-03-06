import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { ID, Models } from "react-native-appwrite";
import { StreamChat } from "stream-chat";
import {
  account,
  COLLECTION_ID2,
  DATABASE_ID,
  databases,
  functions,
} from "../services/appwrite";

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  session: Models.Session | null;
  loading: boolean;
  login: (props: LoginProps) => Promise<void>;
  register: (props: RegisterProps) => Promise<void>;
  logout: () => Promise<void>;
  //   loginWithGoogle: () => Promise<void>;
}

interface LoginProps {
  email: string;
  password: string;
}

interface RegisterProps {
  email: string;
  password: string;
  name: string;
}

const STREAM_KEY = process.env.EXPO_PUBLIC_STREAM_API_KEY!;
export const chatClient = StreamChat.getInstance(STREAM_KEY);

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null,
  );
  const [session, setSession] = useState<Models.Session | null>(null);
  const [loading, setLoading] = useState(true);

  const connectStreamUser = async (
    appwriteUser: Models.User<Models.Preferences>,
  ) => {
    try {
      // if already connected to the user
      if (chatClient.userID == appwriteUser.$id) return;

      const userProfile = await databases.getDocument(
        DATABASE_ID,
        COLLECTION_ID2,
        appwriteUser.$id,
      );

      const execution = await functions.createExecution(
        "generate-stream-token",
        JSON.stringify({ userId: appwriteUser.$id }),
      );
      const response = JSON.parse(execution.responseBody);

      if (!response.success) {
        console.error("Server Error:", response.message);
        return;
      }

      const secureToken = response.token;
      console.log("Token received! Connecting to Stream...");

      
      await chatClient.connectUser(
        {
          id: appwriteUser.$id,
          name: userProfile.username, 
          image: userProfile.avatarUrl,
        },
        secureToken, 
      );

      console.log("Stream connected with profile: ", userProfile.username);
    } catch (error) {
      console.log("Error in stream connection: ", error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async ({ email, password }: LoginProps) => {
    setLoading(true);
    try {
      const session = await account.createEmailPasswordSession(email, password);
      setSession(session);
      const user = await account.get();
      setUser(user);

      await connectStreamUser(user);
    } catch (error: any) {
      throw new Error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ email, password, name }: RegisterProps) => {
    setLoading(true);
    try {
      const newAccount = await account.create(
        ID.unique(),
        email,
        password,
        name,
      );

      await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID2,
        newAccount.$id, // This links Auth and DB
        {
          username: name,
          firstname: name.split(" ")[0],
          lastname: name.split(" ")[1] || " ",
          bio: "",
        },
      );

      await login({ email, password });
    } catch (error: any) {
      throw new Error(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (chatClient.userID) {
        await chatClient.disconnectUser();
        console.log("Stream disconnected");
      }
      await account.deleteSession("current");
      setSession(null);
      setUser(null);
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = async () => {
    try {
      const currentSession = await account.getSession("current");
      setSession(currentSession);
      const currentUser = await account.get();
      setUser(currentUser);

      await connectStreamUser(currentUser);
    } catch (error) {
      setSession(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const contextValue: AuthContextType = {
    user,
    session,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
