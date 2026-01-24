import { auth } from "@/service/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { createContext, useEffect, useState } from "react";

interface AuthContextTypes {
    user: User | null;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextTypes>({
    user: null,
    loading: true, // Default to true so we wait initially
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    // We don't need the global UI loader here. We need a specific "Auth Check" loader.
    const [user, setUser] = useState<User | null>(null);
    const [initializing, setInitializing] = useState(true); // Start as TRUE

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (usr) => {
            setUser(usr);
            setInitializing(false); // Only stop loading after Firebase replies
        });
        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading: initializing }}>
            {children}
        </AuthContext.Provider>
    );
}