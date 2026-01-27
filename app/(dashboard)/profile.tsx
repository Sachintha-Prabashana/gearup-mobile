import React, {useCallback, useEffect, useState} from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    RefreshControl, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';

// Components
import ProfileMenuItem from "@/components/ProfileMenuItem";
import LogoutModal from "@/components/LogoutModal";

// Hooks
import { useAuth } from "@/hooks/useAuth";
import { useLoader } from "@/hooks/useLoader";

// Services
import { getUserProfile, logoutUser, updateUserProfileImage } from "@/service/userService";

export default function Profile() {
    const router = useRouter();
    const { user } = useAuth();
    const { showLoader, hideLoader } = useLoader(); // Global Loader

    const [userData, setUserData] = useState<any>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [isAvatarUploading, setAvatarUploading] = useState(false);

    // Logout Modal Visibility State
    const [isLogoutVisible, setLogoutVisible] = useState(false);

    // --- Data Load Function ---
    const loadData = useCallback(async (isPullToRefresh = false) => {
        if (!user) return;

        try {
            if (!isPullToRefresh) showLoader();

            const data = await getUserProfile();
            setUserData(data);
        } catch (error) {
            console.error(error);
        } finally {
            if (!isPullToRefresh) hideLoader();
        }
    }, [user]);


    useEffect(() => {
        loadData(false); // Initial load with Global Loader
    }, [loadData]);

    // --- Pull-to-Refresh ---
    const onRefresh = async () => {
        setRefreshing(true);
        await loadData(true); // Pass true to avoid global loader
        setRefreshing(false);
    };

    // --- Logout Logic ---
    const handleLogoutPress = () => {
        setLogoutVisible(true); // Open Modal
    };

    const handleProfilePicUpdate = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            Toast.show({ type: 'error', text1: 'Permission Required', text2: 'Allow gallery access to change photo.' });
            return;
        }

        // 2. Pick Image
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1], // Square Crop
            quality: 0.5, // Optimize size
        });

        if (!result.canceled) {
            try {
                setAvatarUploading(true);

                // 3. Upload & Update
                const newUrl = await updateUserProfileImage(result.assets[0].uri);

                // 4. Update UI Immediately
                setUserData((prev: any) => ({ ...prev, photoURL: newUrl }));

                Toast.show({ type: 'success', text1: 'Updated!', text2: 'Profile picture changed successfully.' });

            } catch (error) {
                Toast.show({ type: 'error', text1: 'Upload Failed', text2: 'Please try again.' });
            } finally {
                setAvatarUploading(false); // Spinner OFF
            }
        }
    }

    const confirmLogout = async () => {
        setLogoutVisible(false); // Close Modal first

        try {
            showLoader(); // Show Loader while logging out ⏳
            await logoutUser();

            // Give a small delay for better UX
            setTimeout(() => {
                hideLoader();
                router.replace("/login");
            }, 500);

        } catch (error) {
            hideLoader();
            console.error("Logout failed", error);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top']}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {/* --- 1. MODERN HEADER --- */}
                <View className="bg-white px-6 pt-6 pb-10 rounded-b-[40px] shadow-sm mb-6 border-b border-gray-50">

                    {/* Top Bar */}
                    <View className="flex-row items-center justify-between mb-8">
                        <Text className="text-3xl font-extrabold text-slate-900 font-sans tracking-tight">Profile</Text>
                        <TouchableOpacity
                            onPress={() => router.push("/profile/personal-info")}
                            className="w-10 h-10 bg-slate-50 rounded-full items-center justify-center border border-slate-100"
                        >
                            <Ionicons name="settings-outline" size={22} color="#0F172A" />
                        </TouchableOpacity>
                    </View>

                    {/* Profile Card */}
                    <View className="flex-row items-center gap-5">

                        {/* Avatar with Edit Overlay */}
                        <TouchableOpacity
                            onPress={handleProfilePicUpdate}
                            disabled={isAvatarUploading}
                            className="relative active:opacity-80"
                        >
                            <Image
                                source={{ uri: userData?.photoURL || "https://i.pravatar.cc/300" }}
                                className={`w-24 h-24 rounded-full border-4 border-slate-50 ${isAvatarUploading ? 'opacity-50' : ''}`}
                            />

                            {/* Loading Spinner for Avatar */}
                            {isAvatarUploading && (
                                <View className="absolute inset-0 items-center justify-center">
                                    <ActivityIndicator color="#0F172A" />
                                </View>
                            )}

                            {/* Camera Icon Badge */}
                            {!isAvatarUploading && (
                                <View className="absolute bottom-0 right-0 bg-slate-900 w-8 h-8 rounded-full items-center justify-center border-2 border-white shadow-sm">
                                    <Ionicons name="camera" size={14} color="white" />
                                </View>
                            )}
                        </TouchableOpacity>

                        {/* Text Info */}
                        <View className="flex-1">
                            <Text className="text-2xl font-bold text-slate-900 font-sans leading-tight mb-1">
                                {userData?.displayName?.split(" ")[0] || "User"}
                            </Text>
                            <Text className="text-slate-500 text-sm font-sans mb-3 font-medium">
                                {userData?.email}
                            </Text>

                            {/* Verification Chip */}
                            <TouchableOpacity
                                onPress={() => !userData?.isIdVerified && router.push("/verification/id-upload")}
                                className={`self-start px-3 py-1.5 rounded-full flex-row items-center gap-1.5 ${
                                    userData?.isVerified ? "bg-green-100/80" : "bg-orange-100/80"
                                }`}
                            >
                                <Ionicons
                                    name={userData?.isIdVerified ? "shield-checkmark" : "alert-circle"}
                                    size={14}
                                    color={userData?.isIdVerified ? "#15803d" : "#c2410c"}
                                />
                                <Text className={`text-[11px] font-bold uppercase tracking-wide ${
                                    userData?.isIdVerified ? "text-green-700" : "text-orange-700"
                                }`}>
                                    {userData?.isIdVerified ? "Verified" : "Action Required"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* --- 2. STATS GRID (Card Style) --- */}
                <View className="mx-6 mb-8 flex-row gap-4">
                    <View className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-slate-50 items-center">
                        <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center mb-2">
                            <Ionicons name="receipt" size={20} color="#3B82F6" />
                        </View>
                        <Text className="text-xl font-bold text-slate-900">0</Text>
                        <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rentals</Text>
                    </View>
                    <View className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-slate-50 items-center">
                        <View className="w-10 h-10 bg-yellow-50 rounded-full items-center justify-center mb-2">
                            <Ionicons name="star" size={20} color="#F59E0B" />
                        </View>
                        <Text className="text-xl font-bold text-slate-900">5.0</Text>
                        <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rating</Text>
                    </View>
                    <View className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-slate-50 items-center">
                        <View className="w-10 h-10 bg-red-50 rounded-full items-center justify-center mb-2">
                            <Ionicons name="heart" size={20} color="#EF4444" />
                        </View>
                        <Text className="text-xl font-bold text-slate-900">0</Text>
                        <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Saved</Text>
                    </View>
                </View>

                {/* --- 3. MENU SECTIONS --- */}
                <View className="px-6">

                    {/* Content Group */}
                    <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-2 font-sans">Content</Text>
                    <View className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-50 mb-8">
                        <ProfileMenuItem icon="calendar-outline" label="My Bookings" onPress={() => router.push("/rentals")} />
                        <ProfileMenuItem icon="heart-outline" label="Favorites" onPress={() => router.push("/saved")} showBadge={true} badgeText="New" />
                    </View>

                    {/* Preferences Group */}
                    <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-2 font-sans">Preferences</Text>
                    <View className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-50 mb-8">
                        <ProfileMenuItem icon="person-outline" label="Personal Info" onPress={() => router.push("/profile/personal-info")} />
                        <ProfileMenuItem icon="card-outline" label="Payment Methods" onPress={() => router.push("/profile/payments")} />
                        <ProfileMenuItem icon="shield-checkmark-outline" label="Security" onPress={() => {}} />
                    </View>

                    {/* Support Group */}
                    <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-2 font-sans">Support</Text>
                    <View className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-50 mb-10">
                        <ProfileMenuItem icon="help-circle-outline" label="Help & Support" onPress={() => {}} />
                        <ProfileMenuItem icon="document-text-outline" label="Terms & Privacy" onPress={() => {}} />
                        <ProfileMenuItem
                            icon="log-out-outline"
                            label="Log Out"
                            onPress={() => setLogoutVisible(true)}
                            isDestructive={true}
                        />
                    </View>

                </View>

                <View className="items-center mb-5">
                    <Text className="text-slate-300 text-[10px] font-bold tracking-widest font-sans uppercase">GearUp Version 1.0.0</Text>
                </View>

            </ScrollView>

            <LogoutModal
                isVisible={isLogoutVisible}
                onClose={() => setLogoutVisible(false)}
                onConfirm={confirmLogout}
            />
        </SafeAreaView>
    );
}