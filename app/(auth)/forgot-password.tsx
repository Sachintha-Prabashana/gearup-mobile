import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    ScrollView,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";
import Toast from 'react-native-toast-message';
import { useLoader } from '@/hooks/useLoader';
import { resetPassword } from "@/service/authService";
import { validateEmail } from "@/utils/validators";

const ForgotPassword = () => {

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState<string | null>(null);
    const { isLoading, showLoader, hideLoader } = useLoader();

    const handleResetRequest = async () => {
        const error = validateEmail(email);
        if (error) {
            setEmailError(error);
            return;
        }

        try {
            showLoader();
            await resetPassword(email);
            Toast.show({
                type: 'success',
                text1: 'Email Sent! 📧',
                text2: 'Please check your inbox to reset your password.',
            });
            setTimeout(() => router.back(), 2000);
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Could not send reset link. Please try again.',
            });
        } finally {
            hideLoader();
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1, backgroundColor: '#000000' }}>
                <StatusBar barStyle="light-content" />
                <LinearGradient colors={['#121212', '#000000']} style={{ position: 'absolute', fill: 'both', height: '100%', width: '100%' }} />

                <SafeAreaView style={{ flex: 1 }}>
                    <View style={{ paddingHorizontal: 24, paddingTop: 20 }}>
                        <TouchableOpacity onPress={() => router.back()} style={{ width: 45, height: 45, borderRadius: 15, backgroundColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center' }}>
                            <Ionicons name="chevron-back" size={24} color="#B4F05F" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={{ paddingHorizontal: 24, flexGrow: 1 }}>
                        <View style={{ marginTop: 40, marginBottom: 40 }}>
                            <Text style={{ color: '#FFFFFF', fontSize: 34, fontWeight: '700' }}>Reset Password</Text>
                            <Text style={{ color: '#A1A1AA', fontSize: 16, marginTop: 12, lineHeight: 24 }}>
                                Enter your email address and we'll send you a link to reset your password.
                            </Text>
                        </View>

                        <View>
                            <Text style={{ color: '#A1A1AA', fontSize: 14, fontWeight: '600', marginBottom: 8, marginLeft: 4 }}>Email Address</Text>
                            <View style={{
                                height: 64,
                                backgroundColor: '#1A1A1A',
                                borderRadius: 20,
                                borderWidth: 1.5,
                                borderColor: emailError ? '#FF4444' : '#2A2A2A',
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingHorizontal: 20
                            }}>
                                <Ionicons name="mail-outline" size={22} color="#71717A" />
                                <TextInput
                                    style={{ flex: 1, color: '#FFFFFF', fontSize: 16, marginLeft: 12 }}
                                    placeholder="name@example.com"
                                    placeholderTextColor="#52525B"
                                    value={email}
                                    onChangeText={(text) => { setEmail(text); setEmailError(null); }}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />
                            </View>
                            {emailError && <Text style={{ color: '#FF4444', fontSize: 12, marginTop: 4, marginLeft: 8 }}>{emailError}</Text>}
                        </View>

                        <TouchableOpacity
                            onPress={handleResetRequest}
                            disabled={isLoading}
                            style={{
                                height: 64,
                                backgroundColor: '#B4F05F',
                                borderRadius: 24,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: 40,
                            }}
                        >
                            <Text style={{ color: '#000000', fontSize: 18, fontWeight: '800' }}>
                                {isLoading ? 'Sending...' : 'Send Reset Link'}
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </SafeAreaView>
            </View>
        </TouchableWithoutFeedback>
    );
}
export default ForgotPassword
