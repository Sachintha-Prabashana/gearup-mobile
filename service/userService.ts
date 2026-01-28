import { db, auth } from "./firebase"
import {doc, getCountFromServer, getDoc, updateDoc} from "firebase/firestore";
import { updateProfile } from "@firebase/auth";
import {collection, query, setDoc, where} from "@firebase/firestore";

export interface UserUpdateData {
    displayName?: string;
    phoneNumber?: string;
    photoURL?: string;
    address?: string;
    city?: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
    isIdVerified?: boolean;
}

export const getUserProfile = async () => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("User not authenticated");

        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (userDoc.exists()) {
            return {
                uid: user.uid,
                email: user.email,
                photoURL: user.photoURL,
                displayName: user.displayName,
                ...userDoc.data()
            };
        } else {
            return {
                uid: user.uid,
                email: user.email,
                photoURL: user.photoURL,
                displayName: user.displayName,
                isIdVerified: false
            };
        }

    } catch (error) {
        console.error("Error fetching profile:", error);
        return null;
    }
}

export const updateUserProfile = async (data: UserUpdateData) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("User not authenticated");

        const userRef = doc(db, "users", user.uid);

        // 1. Update Firestore Extended Profile
        // setDoc + { merge: true }
        await setDoc(userRef, data, { merge: true });

        // 2. Firebase Auth Profile
        if (data.displayName || data.photoURL) {
            await updateProfile(user, {
                displayName: data.displayName || user.displayName,
                photoURL: data.photoURL || user.photoURL,
            });
        }

        console.log("User Profile Updated Successfully");
        return { success: true };

    } catch (error) {
        console.error("Error updating profile:", error);
        throw error;
    }
};

const uploadToCloudinary = async (uri: string) => {
    const cloudName = process.env.EXPO_PUBLIC_CLOUD_NAME;
    const uploadPreset = process.env.EXPO_PUBLIC_UPLOAD_PRESET;

    const formData = new FormData();

    formData.append("file", {
        uri,
        type: 'image/jpeg',
        name: 'profile.jpg'
    } as any);

    formData.append("upload_preset", uploadPreset || "");
    formData.append("cloud_name", cloudName || "");

    formData.append("folder", "gearup_user_profiles");

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData
    });

    const data = await res.json();
    return data.secure_url;
};

export const updateUserProfileImage = async (localUri: string) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("User not found");

        const secureUrl = await uploadToCloudinary(localUri);

        //  Update Firebase Auth (Basic Profile)
        await updateProfile(user, { photoURL: secureUrl });

        //  Update Firestore (Extended Profile)
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { photoURL: secureUrl });

        return secureUrl;

    } catch (error) {
        console.error("Profile Update Error:", error);
        throw error;
    }
}

export const getUserStats = async (userId: string) => {
    try {
        // 1. Rentals
        const bookingsRef = collection(db, "bookings");
        const bookingsQuery = query(bookingsRef, where("userId", "==", userId));
        const bookingsSnapshot = await getCountFromServer(bookingsQuery);
        const rentalsCount = bookingsSnapshot.data().count;

        // 2. Saved Items
        const favoritesRef = collection(db, "users", userId, "favorites");
        const favoritesSnapshot = await getCountFromServer(favoritesRef);
        const savedCount = favoritesSnapshot.data().count;

        return { rentals: rentalsCount, saved: savedCount };

    } catch (error) {
        console.error("Error fetching user stats:", error);
        return { rentals: 0, saved: 0 };
    }
};

export const logoutUser = async () => {
    try {
        await auth.signOut();
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}