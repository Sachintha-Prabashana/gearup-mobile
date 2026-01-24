import { Stack } from "expo-router"; // Slot වෙනුවට Stack ගන්න
import "../global.css";
import 'react-native-reanimated';
import { LoaderProvider } from "@/context/LoaderContext";
import { AuthProvider } from "@/context/AuthContext";
import {View} from "react-native";

export default function RootLayout() {
    return (
        <LoaderProvider>
            <AuthProvider>
                <Stack screenOptions={{ headerShown: false }} />
            </AuthProvider>

        </LoaderProvider>
    );
}