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
    Image, // Image component එක import කරගන්න
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';

export default function ProfessionalLoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [focusedInput, setFocusedInput] = useState<string | null>(null);


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

                        {/* --- HEADER SECTION --- */}
                        <View className="items-center mb-10">
                            <Text className="text-3xl font-extrabold text-zinc-900 tracking-tight text-center mb-3">
                                Welcome back to GearUp
                            </Text>
                            <Text className="text-zinc-500 text-base text-center max-w-[280px]">
                                Sign in to continue renting top-tier camera gear.
                            </Text>
                        </View>

                        {/* --- SOCIAL LOGIN SECTION --- */}
                        <View className="gap-2 mb-8">

                            {/* Facebook Button (Replaced Apple) */}
                            <TouchableOpacity className="flex-row items-center justify-center h-14 border border-zinc-300 rounded-xl bg-white active:bg-zinc-50 transition-colors shadow-sm relative">
                                {/* Local Image Icon for Facebook */}
                                <Image
                                    source={{ uri: "https://cdn.simpleicons.org/facebook/1877F2" }}
                                    style={{ width: 24, height: 24, position: "absolute", left: 20 }}
                                    resizeMode="contain"
                                />
                                <Text className="text-base font-semibold text-zinc-900">
                                    Continue with Facebook
                                </Text>
                            </TouchableOpacity>

                            {/* Google Button */}
                            <TouchableOpacity className="flex-row items-center justify-center h-14 border border-zinc-300 rounded-xl bg-white active:bg-zinc-50 transition-colors shadow-sm relative">
                                {/* Local Image Icon for Google */}
                                <Image
                                    source={require('../../assets/icons/google.png')} // මෙතන ඔබේ path එක දෙන්න
                                    style={{ width: 24, height: 24, position: 'absolute', left: 20 }}
                                    resizeMode="contain"
                                />
                                <Text className="text-base font-semibold text-zinc-900">
                                    Continue with Google
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* --- DIVIDER --- */}
                        <View className="flex-row items-center mb-8">
                            <View className="flex-1 h-[1px] bg-zinc-200" />
                            <Text className="mx-4 text-sm text-zinc-400 font-medium">or sign in with email</Text>
                            <View className="flex-1 h-[1px] bg-zinc-200" />
                        </View>

                        {/* --- EMAIL & PASSWORD FORM --- */}
                        <View className="space-y-5 mb-4">

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
                                        // onFocus={() => setFocusedInput('email')}
                                        // onBlur={() => setFocusedInput(null)}
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
                                        placeholder="Your password"
                                        placeholderTextColor="#A1A1AA"
                                        secureTextEntry={!showPassword}
                                        value={password}
                                        onChangeText={setPassword}
                                        // onFocus={() => setFocusedInput('password')}
                                        // onBlur={() => setFocusedInput(null)}
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
                        </View>

                        {/* Forgot Password */}
                        <TouchableOpacity className="self-end mb-8 p-1">
                            <Text className="text-sm font-semibold text-zinc-900 underline decoration-zinc-300">
                                Forgot password?
                            </Text>
                        </TouchableOpacity>

                        {/* --- LOGIN BUTTON --- */}
                        <TouchableOpacity
                            className="w-full h-14 bg-zinc-900 rounded-xl items-center justify-center shadow-md shadow-zinc-400/20 active:bg-black active:scale-[0.99] transition-all"
                        >
                            <Text className="text-white text-lg font-bold tracking-wide">Log In</Text>
                        </TouchableOpacity>

                        {/* --- FOOTER (Sign Up Link) --- */}
                        <View className="flex-row justify-center mt-8 mb-4">
                            <Text className="text-zinc-500 font-medium text-base">Dont have an account? </Text>
                            <TouchableOpacity>
                                <Text className="text-zinc-900 font-bold text-base underline decoration-zinc-300">Sign up</Text>
                            </TouchableOpacity>
                        </View>

                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}