// scripts/migrateKeywords.ts
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAsyTGSedZSzW8V5nsVbz15-vz1gS4K9Jk",
    authDomain: "gear-up-001.firebaseapp.com",
    projectId: "gear-up-001",
    storageBucket: "gear-up-001.firebasestorage.app",
    messagingSenderId: "85548290719",
    appId: "1:85548290719:web:c44e25598e0fe8d4b6c8aa"
};

// Initialize Firebase for Node.js environment
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 2. Helper Function to Generate Search Keywords
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

// 3. Main Migration Function
const runMigration = async () => {
    try {
        console.log(" Starting Migration via Command Line...");

        const COLLECTION_NAME = "products";
        const productRef = collection(db, COLLECTION_NAME);
        const querySnapshot = await getDocs(productRef);

        console.log(`Found ${querySnapshot.size} documents to process.`);

        let count = 0;
        const updates = querySnapshot.docs.map(async (document) => {
            const data = document.data();

            const keywords = generateSearchKeywords(
                data.name || "",
                data.brand || ""
            );

            const docRef = doc(db, COLLECTION_NAME, document.id);
            await updateDoc(docRef, {
                searchKeywords: keywords
            });

            count++;
            console.log(`Updated: ${data.name}`);
        });

        await Promise.all(updates);
        console.log(`\n Success! Updated ${count} items.`);
        process.exit(0);

    } catch (error) {
        console.error(" Migration Failed:", error);
        process.exit(1);
    }
};

// Run the function
runMigration();