import { Stack } from "expo-router"; // Slot වෙනුවට Stack ගන්න
import "../global.css";
import 'react-native-reanimated';
import { LoaderProvider } from "@/context/LoaderContext";

export default function RootLayout() {
    return (
        <LoaderProvider>
            <Stack screenOptions={{ headerShown: false }} />
        </LoaderProvider>
    );
}