import { db } from "@/service/firebase"
import {collection, getDocs, limit, where, query} from "@firebase/firestore";


export const getCategories = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];

    }
}

export const getTrendingGear = async () => {
    try {
        const q = query(
            collection(db, "products"),
            where("rating", ">=", 4.8),
            limit(5)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching trending:", error);
        return [];
    }
};

// 3. Fetch Items by Category
export const getGearByCategory = async (categoryId: number) => {
    try {
        // Note: Firestore stores IDs as strings, checking mapping carefully
        const q = query(
            collection(db, "products"),
            where("categoryId", "==", categoryId)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching category items:", error);
        return [];
    }
};