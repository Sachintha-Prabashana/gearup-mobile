import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    SafeAreaView,
    StatusBar
} from 'react-native';
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';

const OnboardingScreen = () => {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Background Lighting Effect */}
            <LinearGradient
                colors={['#1A1A1A', '#000000']}
                style={StyleSheet.absoluteFillObject}
            />

            <SafeAreaView style={styles.content}>
                {/* Top Branding */}
                <View style={styles.header}>
                    <Text style={styles.brandName}>CamMart</Text>
                </View>

                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <Text style={styles.mainTitle}>
                        Capture Life in{"\n"}Every Frame
                    </Text>

                    <Image
                        source={require('@/assets/images/onboarding-lens-removebg-preview.png')}
                        // source={{ uri: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop' }}
                        style={styles.lensImage}
                        resizeMode="contain"
                    />
                </View>

                {/* Action Footer */}
                <View style={styles.footer}>
                    <Text style={styles.description}>
                        Discover, Compare, and Buy the Best Cameras and Accessories at Unbeatable Prices.
                    </Text>

                    <TouchableOpacity
                        style={styles.button}
                        activeOpacity={0.8}
                        onPress={() => router.push("/login")}
                    >
                        <Text style={styles.buttonText}>Get Started</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    content: {
        flex: 1,
        paddingHorizontal: 25,
        justifyContent: 'space-between',
    },
    header: {
        marginTop: 10,
    },
    brandName: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    heroSection: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    mainTitle: {
        color: '#FFFFFF',
        fontSize: 40,
        fontWeight: '800',
        lineHeight: 48,
        marginBottom: 20,
    },
    lensImage: {
        width: '100%',
        height: 320,
        alignSelf: 'center',
    },
    footer: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: 40,
    },
    description: {
        color: '#999999',
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 30,
        maxWidth: '90%',
    },
    button: {
        backgroundColor: '#B4F05F', // Lime green from your screenshot
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#B4F05F',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonText: {
        color: '#000000',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default OnboardingScreen;