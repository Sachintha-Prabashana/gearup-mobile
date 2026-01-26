import { auth, db } from "./firebase"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "@firebase/auth";
import { doc, setDoc } from "@firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
}

export const register = async (fullName: string, email: string, password: string) => {
    const userCred = await createUserWithEmailAndPassword(auth, email, password)

    await updateProfile(userCred.user, {
        displayName: fullName,
        photoURL: ""
    })

    // add additional user info to firestore
    setDoc(doc(db, "users", userCred.user.uid), {
        fullName,
        email,
        createdAt: new Date()
    })
    return userCred.user


}

export const logout = async () => {
    await signOut(auth)
    AsyncStorage.clear()
    return
}