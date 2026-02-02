import { db } from "@/service/firebase"
import {collection, getDocs, limit, where, query, getDoc, doc} from "@firebase/firestore";
import {updateDoc} from "firebase/firestore";

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
            where("averageRating", ">=", 3.5),
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

export const getGearById = async (id: string) => {
    try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                id: docSnap.id,
                ...data,
                specs: formatSpecsForUI(data.specs)
            };
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching item:", error);
        return null;
    }
};

const generateSearchKeywords = (name: string, brand: string) => {
    const keywords: string[] = [];

    const searchString = `${name} ${brand}`.toLowerCase();

    const words = searchString.split(" ");

    words.forEach((word) => {
        let temp = "";
        for (let i = 0; i < word.length; i++) {
            temp += word[i];
            keywords.push(temp);
        }
    });

    return [...new Set(keywords)];
};

export const updateAllItemsWithKeywords = async () => {
    try {
        console.log("Starting Migration...");

        const querySnapshot = await getDocs(collection(db, "products"));

        let count = 0;

        // 2. Loop and update
        const updates = querySnapshot.docs.map(async (document) => {
            const data = document.data();

            // get name , brand, category and give keywords
            const keywords = generateSearchKeywords(
                data.name || "",
                data.brand || ""
            );

            // 3.update the db
            const docRef = doc(db, "products", document.id);
            await updateDoc(docRef, {
                searchKeywords: keywords
            });

            count++;
            console.log(`Updated: ${data.name}`);
        });

        // Wait for all updates to complete
        await Promise.all(updates);

        console.log(`Success! Updated ${count} items.`);
        alert("Migration Complete! All items now have keywords.");

    } catch (error) {
        console.error("Migration Failed:", error);
        alert("Something went wrong!");
    }
};

export const searchGearItems = async (searchText: string) => {

    if (!searchText || searchText.length < 1) return [];

    try {
        const searchLower = searchText.toLowerCase();
        const productsRef = collection(db, "products"); //  Collection Name Check කරන්න

        //  Industry Standard Query:
        // Using 'array-contains' on precomputed 'searchKeywords' field

        const q = query(
            productsRef,
            where("searchKeywords", "array-contains", searchLower),
            limit(10) // Limit results for performance
        );

        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

    } catch (error) {
        console.error("Search Error:", error);
        return [];
    }
}