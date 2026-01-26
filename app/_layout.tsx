import { Stack } from "expo-router"; // Slot වෙනුවට Stack ගන්න
import "../global.css";
import 'react-native-reanimated';
import * as SplashScreen from 'expo-splash-screen';
import {
    useFonts,
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
    Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import { LoaderProvider } from "@/context/LoaderContext";
import { AuthProvider } from "@/context/AuthContext";
import {useEffect} from "react";
import Toast from "react-native-toast-message";
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_700Bold,
        Inter_800ExtraBold,
    });

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <LoaderProvider>
            <AuthProvider>
                <Stack screenOptions={{ headerShown: false }} />
                <Toast />
            </AuthProvider>

        </LoaderProvider>
    );
}