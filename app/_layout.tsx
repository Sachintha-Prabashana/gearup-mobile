import { Stack } from "expo-router"; // Slot වෙනුවට Stack ගන්න
import "../global.css";
import 'react-native-reanimated';
import * as SplashScreen from 'expo-splash-screen';
import { StripeProvider } from '@stripe/stripe-react-native';
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

    const publishableKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    console.log("Stripe Key:", publishableKey);

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
        <StripeProvider
            publishableKey={publishableKey as string}
            // merchantIdentifier="merchant.com.gearup"
        >
            <LoaderProvider>
                <AuthProvider>
                    <Stack screenOptions={{ headerShown: false }}>

                        <Stack.Screen name="(dashboard)" options={{ headerShown: false }} />

                        // Customizing the Search Screen Modal Presentation
                        <Stack.Screen
                            name="search"
                            options={{
                                headerShown: false,
                                presentation: 'fullScreenModal',
                                animation: 'fade',
                                animationDuration: 200
                            }}
                        />
                    </Stack>
                    <Toast />
                </AuthProvider>
            </LoaderProvider>
        </StripeProvider>
    );
}