// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// @ts-ignore
import { getReactNativePersistence, initializeAuth} from "@firebase/auth";
import { getFirestore } from "@firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAsyTGSedZSzW8V5nsVbz15-vz1gS4K9Jk",
    authDomain: "gear-up-001.firebaseapp.com",
    projectId: "gear-up-001",
    storageBucket: "gear-up-001.firebasestorage.app",
    messagingSenderId: "85548290719",
    appId: "1:85548290719:web:c44e25598e0fe8d4b6c8aa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
})
export const db = getFirestore(app);