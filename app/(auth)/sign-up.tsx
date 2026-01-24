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
    Image, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useLoader } from "@/hooks/useLoader";
import { register } from '@/service/authService';

export default function SignUp() {
    const router = useRouter();
    const { showLoader, hideLoader, isLoading } = useLoader()

    // Form States
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // UI States
    const [showPassword, setShowPassword] = useState(false);
    const [focusedInput, setFocusedInput] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleRegister = async () => {
        if (isLoading) {
            return; // Prevent multiple submissions
        }

        if (!fullName || !email || !password || !confirmPassword) {
            Alert.alert("Please fill all fields")
            return
        }

        if (password !== confirmPassword) {
            Alert.alert("Passwords do not match")
            return
        }

        try {
            showLoader()
            await register(fullName, email, password)
            Alert.alert("Account created successfully")
            router.replace("/(auth)/login")
        } catch (error) {
            Alert.alert("Registration Failed")

        } finally {
            hideLoader()
        }

    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView className="flex-1 bg-white">
                <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1"
                >
                    <ScrollView
                        className="flex-1 px-6"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                    >

                        {/* --- HEADER --- */}
                        <View className="items-center mb-8">
                            <Text className="text-3xl font-extrabold text-zinc-900 tracking-tight text-center mb-3">
                                Create an Account
                            </Text>
                            <Text className="text-zinc-500 text-base text-center max-w-[280px]">
                                Join GearUp today and start your creative journey.
                            </Text>
                        </View>

                        {/* --- SOCIAL SIGNUP --- */}
                        <View className="gap-2 mb-8">
                            <TouchableOpacity className="flex-row items-center justify-center h-14 border border-zinc-300 rounded-xl bg-white active:bg-zinc-50 transition-colors shadow-sm relative">
                                <Image
                                    source={{ uri: "https://cdn.simpleicons.org/facebook/1877F2" }}
                                    style={{ width: 24, height: 24, position: "absolute", left: 20 }}
                                    resizeMode="contain"
                                />
                                <Text className="text-base font-semibold text-zinc-900">
                                    Sign up with Facebook
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity className="flex-row items-center justify-center h-14 border border-zinc-300 rounded-xl bg-white active:bg-zinc-50 transition-colors shadow-sm relative">
                                <Image
                                    source={require('../../assets/icons/google.png')}
                                    style={{ width: 24, height: 24, position: 'absolute', left: 20 }}
                                    resizeMode="contain"
                                />
                                <Text className="text-base font-semibold text-zinc-900">
                                    Sign up with Google
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* --- DIVIDER --- */}
                        <View className="flex-row items-center mb-8">
                            <View className="flex-1 h-[1px] bg-zinc-200" />
                            <Text className="mx-4 text-sm text-zinc-400 font-medium">or register with email</Text>
                            <View className="flex-1 h-[1px] bg-zinc-200" />
                        </View>

                        {/* --- FORM inputs --- */}
                        <View className="space-y-5 mb-8">

                            {/* Full Name Input */}
                            <View>
                                <Text className="text-sm font-semibold text-zinc-700 mb-2 ml-1">Full Name</Text>
                                <View
                                    className={`h-14 border rounded-xl px-4 flex-row items-center bg-white transition-all ${
                                        focusedInput === 'fullname' ? 'border-zinc-900 shadow-sm' : 'border-zinc-300'
                                    }`}
                                >
                                    <Ionicons name="person-outline" size={20} color={focusedInput === 'fullname' ? "#18181b" : "#71717a"} style={{ marginRight: 12 }} />
                                    <TextInput
                                        className="flex-1 text-base text-zinc-900 h-full font-medium"
                                        placeholder="John Doe"
                                        placeholderTextColor="#A1A1AA"
                                        value={fullName}
                                        onChangeText={setFullName}
                                    />
                                </View>
                            </View>

                            {/* Email Input */}
                            <View>
                                <Text className="text-sm font-semibold text-zinc-700 mb-2 ml-1">Email Address</Text>
                                <View
                                    className={`h-14 border rounded-xl px-4 flex-row items-center bg-white transition-all ${
                                        focusedInput === 'email' ? 'border-zinc-900 shadow-sm' : 'border-zinc-300'
                                    }`}
                                >
                                    <Ionicons name="mail-outline" size={20} color={focusedInput === 'email' ? "#18181b" : "#71717a"} style={{ marginRight: 12 }} />
                                    <TextInput
                                        className="flex-1 text-base text-zinc-900 h-full font-medium"
                                        placeholder="name@example.com"
                                        placeholderTextColor="#A1A1AA"
                                        value={email}
                                        onChangeText={setEmail}
                                        autoCapitalize="none"
                                        keyboardType="email-address"
                                    />
                                </View>
                            </View>

                            {/* Password Input */}
                            <View>
                                <Text className="text-sm font-semibold text-zinc-700 mb-2 ml-1">Password</Text>
                                <View
                                    className={`h-14 border rounded-xl px-4 flex-row items-center bg-white transition-all ${
                                        focusedInput === 'password' ? 'border-zinc-900 shadow-sm' : 'border-zinc-300'
                                    }`}
                                >
                                    <Ionicons name="lock-closed-outline" size={20} color={focusedInput === 'password' ? "#18181b" : "#71717a"} style={{ marginRight: 12 }} />
                                    <TextInput
                                        className="flex-1 text-base text-zinc-900 h-full font-medium"
                                        placeholder="Create a password"
                                        placeholderTextColor="#A1A1AA"
                                        secureTextEntry={!showPassword}
                                        value={password}
                                        onChangeText={setPassword}
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowPassword(!showPassword)}
                                        className="p-2"
                                    >
                                        <Ionicons
                                            name={showPassword ? "eye-off-outline" : "eye-outline"}
                                            size={22}
                                            color={focusedInput === 'password' ? "#18181b" : "#71717a"}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Confirm Password Input */}
                            <View>
                                <Text className="text-sm font-semibold text-zinc-700 mb-2 ml-1">Confirm Password</Text>
                                <View
                                    className={`h-14 border rounded-xl px-4 flex-row items-center bg-white transition-all ${
                                        focusedInput === 'confirmPassword' ? 'border-zinc-900 shadow-sm' : 'border-zinc-300'
                                    }`}
                                >
                                    <Ionicons
                                        name="lock-closed-outline"
                                        size={20}
                                        color={focusedInput === 'confirmPassword' ? "#18181b" : "#71717a"}
                                        style={{ marginRight: 12 }}
                                    />
                                    <TextInput
                                        className="flex-1 text-base text-zinc-900 h-full font-medium"
                                        placeholder="Re-enter your password"
                                        placeholderTextColor="#A1A1AA"
                                        secureTextEntry={!showConfirmPassword}
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}

                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="p-2"
                                    >
                                        <Ionicons
                                            name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                                            size={22}
                                            color={focusedInput === 'confirmPassword' ? "#18181b" : "#71717a"}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        {/* --- SIGN UP BUTTON --- */}
                        <TouchableOpacity
                            className="w-full h-14 bg-zinc-900 rounded-xl items-center justify-center shadow-md shadow-zinc-400/20 active:bg-black active:scale-[0.99] transition-all"
                            onPress={handleRegister}
                        >
                            <Text className="text-white text-lg font-bold tracking-wide">Sign Up</Text>
                        </TouchableOpacity>

                        {/* --- FOOTER --- */}
                        <View className="flex-row justify-center mt-8 mb-4">
                            <Text className="text-zinc-500 font-medium text-base">Already have an account? </Text>
                            <TouchableOpacity onPress={() => router.push('/login')}>
                                <Text className="text-zinc-900 font-bold text-base underline decoration-zinc-300">Log in</Text>
                            </TouchableOpacity>
                        </View>

                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}