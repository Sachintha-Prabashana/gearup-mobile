import { db } from "@/service/firebase"
import {collection, getDocs, limit, where, query} from "@firebase/firestore";

const formatSpecsForUI = (dbSpecs: any) => {
    if (!dbSpecs) return [];

    const specsList = [];

    if (dbSpecs.resolution) specsList.push({ icon: "camera-outline", text: dbSpecs.resolution });
    if (dbSpecs.sensor) specsList.push({ icon: "scan-outline", text: dbSpecs.sensor });
    if (dbSpecs.mount) specsList.push({ icon: "aperture-outline", text: dbSpecs.mount });
    if (dbSpecs.weight) specsList.push({ icon: "fitness-outline", text: dbSpecs.weight });
    if (dbSpecs.output) specsList.push({ icon: "flash-outline", text: dbSpecs.output });
    if (dbSpecs.flightTime) specsList.push({ icon: "time-outline", text: dbSpecs.flightTime });

    return specsList.slice(0, 3);
};


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

        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                specs: formatSpecsForUI(data.specs)
            };
        });
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
        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                specs: formatSpecsForUI(data.specs)
            };
        });
    } catch (error) {
        console.error("Error fetching category items:", error);
        return [];
    }
};