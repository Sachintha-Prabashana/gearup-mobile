import React from "react"
import {View, Platform, ActivityIndicator} from "react-native"
import {Redirect, Tabs} from "expo-router"
import { Ionicons } from "@expo/vector-icons" // Switched to Ionicons for cleaner "Airbnb" look
// import UserHeader from "@/components/UserHeader"
import { StatusBar } from "expo-status-bar"
import {SafeAreaView} from "react-native-safe-area-context";
import { useAuth } from "@/hooks/useAuth";

// 1. Define the "Photographic" Palette
const COLORS = {
    primary: "#B4F05F",    // Neon Lime Green (Active)
    inactive: "#666666",   // Muted Grey (Inactive)
    background: "#000000", // Pure Black
    border: "#1A1A1A",     // Dark Charcoal for subtle separation
}

// 2. Define Tabs Data (Airbnb Structure)
const tabs = [
    {
        name: "home", // 'home' in expo-router usually maps to index
        title: "Explore",
        icon: "search-outline",
        activeIcon: "search"
    },
    {
        name: "saved",
        title: "Saved",
        icon: "heart-outline",
        activeIcon: "heart"
    },
    {
        name: "rentals",
        title: "Rentals",
        icon: "bag-handle-outline",
        activeIcon: "bag-handle"
    },
    {
        name: "profile",
        title: "Profile",
        icon: "person-circle-outline",
        activeIcon: "person-circle"
    }
] as const

const DashboardLayout = () => {
    //  AUTH GUARD LOGIC START
    const { user, loading } = useAuth();

    // 1. Loading State (Checking Session)
    if (loading) {
        return (
            <View style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    // 2. If NO User -> Redirect to Onboarding/Login (/)
    if (!user) {
        return <Redirect href="/" />;
    }
    //  AUTH GUARD LOGIC END

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
            <StatusBar style="dark" />

            {/* Persistent Header (Appears on all tabs) */}
            {/*<UserHeader />*/}

            <Tabs
                screenOptions={{
                    headerShown: false, // We use UserHeader instead
                    tabBarActiveTintColor: COLORS.primary,
                    tabBarInactiveTintColor: COLORS.inactive,
                    tabBarShowLabel: true, // Airbnb shows labels (tiny)

                    // Airbnb-style Tab Bar Styling
                    tabBarStyle: {
                        backgroundColor: COLORS.background,
                        borderTopWidth: 1,
                        borderTopColor: COLORS.border,
                        height: Platform.OS === 'ios' ? 85 : 65, // Taller for modern touch targets
                        paddingTop: 8,
                        paddingBottom: Platform.OS === 'ios' ? 28 : 8,
                        elevation: 0, // Flat look on Android
                        shadowOpacity: 0, // Flat look on iOS
                    },
                    tabBarLabelStyle: {
                        fontSize: 10,
                        fontWeight: "600",
                        marginBottom: -4,
                    },
                }}
            >
                {tabs.map(({ name, title, icon, activeIcon }) => (
                    <Tabs.Screen
                        key={name}
                        name={name}
                        options={{
                            title: title,
                            tabBarIcon: ({ color, focused }) => (
                                <Ionicons
                                    // Switch between Outline and Filled based on focus state
                                    name={focused ? (activeIcon as any) : (icon as any)}
                                    size={26}
                                    color={color}
                                />
                            )
                        }}
                    />
                ))}
            </Tabs>
        </SafeAreaView>
    )
}

export default DashboardLayout