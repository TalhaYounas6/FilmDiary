import { getCurrentUser } from "@/services/appwrite";
import { useEffect, useState } from 'react';

export const useAccount = ()=> {
    const [user,setUser] = useState<User | null>(null);
    const [loading,setLoading]=useState<boolean>(false);
    const [error,setError] = useState<Error | null>(null);

    

    useEffect(()=>{
        const getUser = async()=>{
        try {
            setLoading(true);
            const user = await getCurrentUser();
            //@ts-ignore
            setUser(user);
            
        } catch (error) {
            //@ts-ignore
            setError(err instanceof Error ? err : new Error("An error has occured"));
        }finally{
            setLoading(false);
        }
    }

       getUser();

    },[])


    return{user,loading,error}
}