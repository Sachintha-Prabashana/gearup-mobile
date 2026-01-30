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
    StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useLoader } from "@/hooks/useLoader";
import { register } from '@/service/authService';
import { LinearGradient } from 'expo-linear-gradient'; // Ensure expo-linear-gradient is installed

export default function SignUp() {
    const router = useRouter();
    const { showLoader, hideLoader, isLoading } = useLoader();

    // Form States
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // UI States
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [focusedInput, setFocusedInput] = useState<string | null>(null);

    const handleRegister = async () => {
        if (isLoading) return;

        if (!fullName || !email || !password || !confirmPassword) {
            Alert.alert("Please fill all fields");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Passwords do not match");
            return;
        }

        try {
            showLoader();
            await register(fullName, email, password);
            Alert.alert("Account created successfully");
            router.replace("/(auth)/login");
        } catch (error) {
            Alert.alert("Registration Failed");
        } finally {
            hideLoader();
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1, backgroundColor: '#000000' }}>
                <StatusBar barStyle="light-content" />

                {/* Modern Dark Gradient Background */}
                <LinearGradient
                    colors={['#121212', '#000000']}
                    style={StyleSheet.absoluteFillObject}
                />

                <SafeAreaView style={{ flex: 1 }}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ flex: 1 }}
                    >
                        <ScrollView
                            contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingBottom: 30 }}
                            showsVerticalScrollIndicator={false}
                        >
                            {/* --- HEADER --- */}
                            <View style={{ marginTop: 40, marginBottom: 35 }}>
                                <Text style={{ color: '#FFFFFF', fontSize: 38, fontWeight: '700', letterSpacing: -1 }}>
                                    Create Account
                                </Text>
                                <Text style={{ color: '#A1A1AA', fontSize: 16, marginTop: 8, lineHeight: 24 }}>
                                    Join GearUp today and start your creative journey.
                                </Text>
                            </View>

                            {/* --- FORM INPUTS --- */}
                            <View style={{ gap: 20 }}>
                                {/* Full Name Input */}
                                <View>
                                    <Text style={styles.inputLabel}>Full Name</Text>
                                    <View style={[styles.inputContainer, focusedInput === 'fullname' && styles.inputFocused]}>
                                        <Ionicons name="person-outline" size={22} color={focusedInput === 'fullname' ? "#B4F05F" : "#71717A"} />
                                        <TextInput
                                            style={styles.textInput}
                                            placeholder="John Doe"
                                            placeholderTextColor="#52525B"
                                            value={fullName}
                                            onChangeText={setFullName}
                                            onFocus={() => setFocusedInput('fullname')}
                                            onBlur={() => setFocusedInput(null)}
                                        />
                                    </View>
                                </View>

                                {/* Email Input */}
                                <View>
                                    <Text style={styles.inputLabel}>Email Address</Text>
                                    <View style={[styles.inputContainer, focusedInput === 'email' && styles.inputFocused]}>
                                        <Ionicons name="mail-outline" size={22} color={focusedInput === 'email' ? "#B4F05F" : "#71717A"} />
                                        <TextInput
                                            style={styles.textInput}
                                            placeholder="name@example.com"
                                            placeholderTextColor="#52525B"
                                            value={email}
                                            onChangeText={setEmail}
                                            autoCapitalize="none"
                                            keyboardType="email-address"
                                            onFocus={() => setFocusedInput('email')}
                                            onBlur={() => setFocusedInput(null)}
                                        />
                                    </View>
                                </View>

                                {/* Password Input */}
                                <View>
                                    <Text style={styles.inputLabel}>Password</Text>
                                    <View style={[styles.inputContainer, focusedInput === 'password' && styles.inputFocused]}>
                                        <Ionicons name="lock-closed-outline" size={22} color={focusedInput === 'password' ? "#B4F05F" : "#71717A"} />
                                        <TextInput
                                            style={styles.textInput}
                                            placeholder="Create a password"
                                            placeholderTextColor="#52525B"
                                            secureTextEntry={!showPassword}
                                            value={password}
                                            onChangeText={setPassword}
                                            onFocus={() => setFocusedInput('password')}
                                            onBlur={() => setFocusedInput(null)}
                                        />
                                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                            <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#71717A" />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* Confirm Password Input */}
                                <View>
                                    <Text style={styles.inputLabel}>Confirm Password</Text>
                                    <View style={[styles.inputContainer, focusedInput === 'confirm' && styles.inputFocused]}>
                                        <Ionicons name="lock-closed-outline" size={22} color={focusedInput === 'confirm' ? "#B4F05F" : "#71717A"} />
                                        <TextInput
                                            style={styles.textInput}
                                            placeholder="Re-enter your password"
                                            placeholderTextColor="#52525B"
                                            secureTextEntry={!showConfirmPassword}
                                            value={confirmPassword}
                                            onChangeText={setConfirmPassword}
                                            onFocus={() => setFocusedInput('confirm')}
                                            onBlur={() => setFocusedInput(null)}
                                        />
                                        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                            <Ionicons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#71717A" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                            {/* --- SIGN UP BUTTON --- */}
                            <TouchableOpacity
                                style={styles.primaryButton}
                                activeOpacity={0.8}
                                onPress={handleRegister}
                            >
                                <Text style={styles.primaryButtonText}>Sign Up</Text>
                            </TouchableOpacity>

                            {/* --- DIVIDER --- */}
                            <View style={styles.dividerContainer}>
                                <View style={styles.dividerLine} />
                                <Text style={styles.dividerText}>or join with</Text>
                                <View style={styles.dividerLine} />
                            </View>

                            {/* --- SOCIAL BUTTONS --- */}
                            <View style={{ flexDirection: 'row', gap: 16 }}>
                                <TouchableOpacity style={styles.socialButton}>
                                    <Ionicons name="logo-facebook" size={24} color="#FFFFFF" />
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.socialButton}>
                                    <Image
                                        source={require('../../assets/icons/google.png')}
                                        style={{ width: 24, height: 24 }}
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* --- FOOTER --- */}
                            <View style={styles.footer}>
                                <Text style={{ color: '#71717A', fontSize: 16 }}>Already have an account? </Text>
                                <TouchableOpacity onPress={() => router.push('/login')}>
                                    <Text style={{ color: '#B4F05F', fontSize: 16, fontWeight: '700' }}>Log in</Text>
                                </TouchableOpacity>
                            </View>

                        </ScrollView>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    inputLabel: {
        color: '#A1A1AA',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        marginLeft: 4
    },
    inputContainer: {
        height: 64,
        backgroundColor: '#1A1A1A',
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: '#2A2A2A',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    inputFocused: {
        borderColor: '#B4F05F',
    },
    textInput: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 16,
        marginLeft: 12,
        fontWeight: '500'
    },
    primaryButton: {
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
    },
    primaryButtonText: {
        color: '#000000',
        fontSize: 18,
        fontWeight: '800'
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 35
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#2A2A2A'
    },
    dividerText: {
        color: '#52525B',
        marginHorizontal: 16,
        fontSize: 14,
        fontWeight: '600'
    },
    socialButton: {
        flex: 1,
        height: 64,
        backgroundColor: '#1A1A1A',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2A2A2A'
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 40,
        paddingBottom: 10
    }
});