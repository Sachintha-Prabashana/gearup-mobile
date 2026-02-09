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
    Image,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLoader } from '@/hooks/useLoader';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";
import { login } from "@/service/authService";
import {validateEmail, validatePassword} from "@/utils/validators";
import Toast from "react-native-toast-message";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [focusedInput, setFocusedInput] = useState<string | null>(null);
    const { isLoading, showLoader, hideLoader } = useLoader();
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    const handleLogin = async () => {
        if (isLoading) return;

        // for remove previous errors
        setEmailError(null);
        setPasswordError(null);

        const mailErr = validateEmail(email);
        const passErr = validatePassword(password)

        if (mailErr || passErr) {
            setEmailError(mailErr);
            setPasswordError(passErr);

            // User friendly toast message
            Toast.show({
                type: 'error',
                text1: 'Validation Error',
                text2: 'Please check your email and password.',
                visibilityTime: 3000,
            });
            return;
        }
        try {
            showLoader();
            await login(email, password);

            Toast.show({
                type: 'success',
                text1: 'Success!',
                text2: 'Logged in successfully.',
            });

            router.replace("/home");
        } catch (error) {
            console.error(error);

            Toast.show({
                type: 'error',
                text1: 'Login Failed',
                text2: 'Invalid credentials or network issue. Try again.',
                visibilityTime: 4000,
            });
        } finally {
            hideLoader();
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1, backgroundColor: '#000000' }}>
                <StatusBar barStyle="light-content" />

                <LinearGradient
                    colors={['#121212', '#000000']}
                    style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '100%' }}
                />

                <SafeAreaView style={{ flex: 1 }}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ flex: 1 }}
                    >
                        <ScrollView
                            contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingBottom: 20 }}
                            showsVerticalScrollIndicator={false}
                        >
                            {/* --- HEADER SECTION --- */}
                            <View style={{ marginTop: 60, marginBottom: 40 }}>
                                <Text style={{ color: '#FFFFFF', fontSize: 42, fontWeight: '700', letterSpacing: -1 }}>
                                    Welcome back
                                </Text>
                                <Text style={{ color: '#A1A1AA', fontSize: 16, marginTop: 8, lineHeight: 24 }}>
                                    Sign in to continue renting top-tier camera gear.
                                </Text>
                            </View>

                            {/* --- FORM SECTION --- */}
                            <View style={{ gap: 20 }}>
                                <View>
                                    <Text style={{ color: '#A1A1AA', fontSize: 14, fontWeight: '600', marginBottom: 8, marginLeft: 4 }}>
                                        Email Address
                                    </Text>
                                    <View style={{
                                        height: 64,
                                        backgroundColor: '#1A1A1A',
                                        borderRadius: 20,
                                        borderWidth: 1.5,
                                        borderColor: focusedInput === 'email' ? '#B4F05F' : '#2A2A2A',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        paddingHorizontal: 20
                                    }}>
                                        <Ionicons
                                            name="mail-outline"
                                            size={22}
                                            color={emailError ? '#FF4444' : (focusedInput === 'email' ? "#B4F05F" : "#71717A")}
                                        />
                                        <TextInput
                                            style={{ flex: 1, color: '#FFFFFF', fontSize: 16, marginLeft: 12 }}
                                            placeholder="name@example.com"
                                            placeholderTextColor="#52525B"
                                            value={email}
                                            onChangeText={(text) => {
                                                setEmail(text);
                                                if(emailError) setEmailError(null); // clear error when typing
                                            }}
                                            onFocus={() => setFocusedInput('email')}
                                            onBlur={() => setFocusedInput(null)}
                                            autoCapitalize="none"
                                            keyboardType="email-address"
                                        />
                                    </View>
                                    {emailError && <Text style={{ color: '#FF4444', fontSize: 12, marginTop: 4, marginLeft: 8 }}>{emailError}</Text>}
                                </View>

                                <View>
                                    <Text style={{ color: '#A1A1AA', fontSize: 14, fontWeight: '600', marginBottom: 8, marginLeft: 4 }}>
                                        Password
                                    </Text>
                                    <View style={{
                                        height: 64,
                                        backgroundColor: '#1A1A1A',
                                        borderRadius: 20,
                                        borderWidth: 1.5,
                                        borderColor: focusedInput === 'email' ? '#B4F05F' : '#2A2A2A',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        paddingHorizontal: 20
                                    }}>
                                        <Ionicons
                                            name="lock-closed-outline"
                                            size={22}
                                            color={passwordError ? '#FF4444' : (focusedInput === 'password' ? "#B4F05F" : "#71717A")}
                                        />
                                        <TextInput
                                            style={{ flex: 1, color: '#FFFFFF', fontSize: 16, marginLeft: 12 }}
                                            placeholder="Your password"
                                            placeholderTextColor="#52525B"
                                            secureTextEntry={!showPassword}
                                            value={password}
                                            onChangeText={(text) => {
                                                setPassword(text);
                                                if(passwordError) setPasswordError(null);
                                            }}
                                            onFocus={() => setFocusedInput('password')}
                                            onBlur={() => setFocusedInput(null)}
                                        />
                                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                            <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#71717A" />
                                        </TouchableOpacity>
                                    </View>
                                    {passwordError && <Text style={{ color: '#FF4444', fontSize: 12, marginTop: 4, marginLeft: 8 }}>{passwordError}</Text>}
                                </View>
                            </View>

                            {/* Forgot Password */}
                            <TouchableOpacity
                                onPress={() => router.push('/forgot-password')}
                                style={{ alignSelf: 'flex-end', marginTop: 16 }}>
                                <Text style={{ color: '#B4F05F', fontSize: 14, fontWeight: '700' }}>
                                    Forgot password?
                                </Text>
                            </TouchableOpacity>

                            {/* --- LOGIN BUTTON --- */}
                            <TouchableOpacity
                                onPress={handleLogin}
                                activeOpacity={0.8}
                                style={{
                                    height: 64,
                                    backgroundColor: '#B4F05F',
                                    borderRadius: 24,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: 40,
                                    shadowColor: '#B4F05F',
                                    shadowOffset: { width: 0, height: 8 },
                                    shadowOpacity: 0.2,
                                    shadowRadius: 12,
                                    elevation: 5
                                }}
                            >
                                <Text style={{ color: '#000000', fontSize: 18, fontWeight: '800' }}>Log In</Text>
                            </TouchableOpacity>

                            {/* --- DIVIDER --- */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 40 }}>
                                <View style={{ flex: 1, height: 1, backgroundColor: '#2A2A2A' }} />
                                <Text style={{ color: '#52525B', marginHorizontal: 16, fontSize: 14, fontWeight: '600' }}>
                                    or continue with
                                </Text>
                                <View style={{ flex: 1, height: 1, backgroundColor: '#2A2A2A' }} />
                            </View>

                            {/* --- SOCIAL BUTTONS --- */}
                            <View style={{ flexDirection: 'row', gap: 16 }}>
                                <TouchableOpacity style={{
                                    flex: 1,
                                    height: 64,
                                    backgroundColor: '#1A1A1A',
                                    borderRadius: 20,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderWidth: 1,
                                    borderColor: '#2A2A2A'
                                }}>
                                    <Ionicons name="logo-facebook" size={24} color="#FFFFFF" />
                                </TouchableOpacity>

                                <TouchableOpacity style={{
                                    flex: 1,
                                    height: 64,
                                    backgroundColor: '#1A1A1A',
                                    borderRadius: 20,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderWidth: 1,
                                    borderColor: '#2A2A2A'
                                }}>
                                    <Image
                                        source={require('../../assets/icons/google.png')}
                                        style={{ width: 24, height: 24 }}
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* --- FOOTER --- */}
                            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 'auto', paddingTop: 40 }}>
                                <Text style={{ color: '#71717A', fontSize: 16 }}>Don't have an account? </Text>
                                <TouchableOpacity onPress={() => router.replace('/sign-up')}>
                                    <Text style={{ color: '#B4F05F', fontSize: 16, fontWeight: '700' }}>Sign up</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </View>
        </TouchableWithoutFeedback>
    );
}