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
                <View className="flex-1">
                    <Stack screenOptions={{ headerShown: false }} />
                </View>
            </AuthProvider>

        </LoaderProvider>
    );
}