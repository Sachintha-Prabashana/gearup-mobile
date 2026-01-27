import { auth, db } from "./firebase";
import { doc, deleteDoc, getDoc, setDoc, getDocs, collection, query, orderBy } from "@firebase/firestore";

export const toggleFavorite = async (item: any) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("User not authenticated");

        const favoriteRef = doc(db, "users", user.uid, "favorites", item.id.toString());
        const docSnap = await getDoc(favoriteRef);

        if (docSnap.exists()) {
            await deleteDoc(favoriteRef);
            return false;
        } else {
            // Add to favorites - only store necessary fields
            await setDoc (favoriteRef, {
                id: item.id,
                name: item.name,
                image: item.image,
                pricePerDay: item.pricePerDay || item.price,
                brand: item.brand,
                quantity: item.quantity || 0,
                rating: item.rating,
                addedAt: new Date()
            })
            return true;
        }

    } catch (error) {
        console.error("Error toggling favorite:", error);
        throw error;
    }
}


export const checkIsFavorite = async (itemId: string) => {
    try{
        const user = auth.currentUser;
        if (!user) return false;

        const docRef = doc(db, "users", user.uid, "favorites", itemId.toString());
        const docSnap = await getDoc(docRef);

        return docSnap.exists();
    } catch (error) {
        console.error("Error checking favorite status:", error);
        return false;
    }
}

export const getUserFavoriteIds = async () => {
    try {
        const user = auth.currentUser;
        if (!user) return [];

        const favCollection = collection(db, "users", user.uid, "favorites");
        const snapshot = await getDocs(favCollection);

        // Store only the IDs of favorite items
        return snapshot.docs.map(doc => doc.id);
    } catch (error) {
        console.error("Error fetching favorite IDs:", error);
        return [];
    }
}

export const getSavedItems = async () => {
    try {
        const user = auth.currentUser;
        if (!user) return [];

        const favCollection = collection(db, "users", user.uid, "favorites");

        const q = query(favCollection, orderBy("addedAt", "desc"));

        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

    } catch (error) {
        console.error("Error fetching saved items:", error);
        return [];

    }
}