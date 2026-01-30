import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Redirect } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import OnboardingScreen from "@/components/OnboardingScreen";


export default function Index() {
    const { user, loading } = useAuth();

    // 1. Show global loader while checking session
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#B4F05F" />
            </View>
        );
    }

    // 2. If session exists, skip onboarding and redirect to main app flow
    if (user) {
        return <Redirect href="/home" />;
    }

    // 3. If no session, render the Onboarding UI
    return <OnboardingScreen />;
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
});