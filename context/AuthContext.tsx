import { useLoader } from "@/hooks/useLoader";
import { auth } from "@/service/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextTypes {
    user: User | null;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextTypes>({
    user: null,
    loading: false,
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const { hideLoader, isLoading, showLoader } = useLoader();
    const [user, setUser] = useState<User | null>(null);


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (usr) => {
            setUser(usr);
            hideLoader();
        });
        return () => unsubscribe();
    }, []);
    return <AuthContext.Provider value={{ user, loading: isLoading }}>
        {children}
    </AuthContext.Provider>
}