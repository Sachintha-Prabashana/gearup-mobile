import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    StatusBar,
    Dimensions
} from 'react-native';
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = () => {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* Background Gradient */}
            <LinearGradient
                colors={['#121212', '#000000']}
                style={StyleSheet.absoluteFillObject}
            />

            {/*  Using SafeAreaView from context */}
            <SafeAreaView style={styles.content}>

                {/* 1. Header / Branding */}
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Text style={styles.brandTextWhite}>Gear</Text>
                        <Text style={styles.brandTextGreen}>Up</Text>
                    </View>
                </View>

                {/* 2. Hero Section (Image & Title) */}
                <View style={styles.heroSection}>
                    <View style={styles.imageContainer}>
                        {/* Glow Effect behind the camera/lens */}
                        <View style={styles.glowEffect} />

                        <Image
                            source={require('@/assets/images/onboarding-lens-removebg-preview.png')}
                            style={styles.lensImage}
                            resizeMode="contain"
                        />
                    </View>

                    <Text style={styles.mainTitle}>
                        Rent Premium{"\n"}
                        <Text style={{ color: '#B4F05F' }}>Gear</Text> Anytime.
                    </Text>
                </View>

                {/* 3. Footer (Description & Button) */}
                <View style={styles.footer}>
                    <Text style={styles.description}>
                        Access top-tier photography equipment without breaking the bank. Rent, shoot, and return with ease.
                    </Text>

                    <TouchableOpacity
                        style={styles.button}
                        activeOpacity={0.8}
                        onPress={() => router.push("/login")}
                    >
                        <Text style={styles.buttonText}>Get Started</Text>
                        <Ionicons name="arrow-forward" size={20} color="black" />
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
        justifyContent: 'space-between',
        paddingHorizontal: 24,
    },
    header: {
        marginTop: 20,
        alignItems: 'center',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    brandTextWhite: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: '900',
        letterSpacing: -1,
    },
    brandTextGreen: {
        color: '#B4F05F',
        fontSize: 24,
        fontWeight: '900',
        letterSpacing: -1,
    },
    heroSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    imageContainer: {
        width: width * 0.9,
        height: height * 0.4,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        position: 'relative',
    },
    glowEffect: {
        position: 'absolute',
        width: 200,
        height: 200,
        backgroundColor: '#64FFDA',
        opacity: 0.2,
        borderRadius: 100,
        transform: [{ scale: 1.6 }],
    },
    lensImage: {
        width: '100%',
        height: '100%',
    },
    mainTitle: {
        color: '#FFFFFF',
        fontSize: 36,
        fontWeight: '800',
        textAlign: 'center',
        lineHeight: 44,
    },
    footer: {
        marginBottom: 20,
    },
    description: {
        color: '#999999',
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
        paddingHorizontal: 20,
    },
    button: {
        backgroundColor: '#B4F05F',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 18,
        borderRadius: 20,
        shadowColor: '#B4F05F',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
        gap: 8,
    },
    buttonText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});

export default OnboardingScreen;