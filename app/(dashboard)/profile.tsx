import React, {useCallback, useEffect, useState} from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
    StatusBar,
    Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

// Components
import LogoutModal from "@/components/LogoutModal";

// Hooks
import { useAuth } from "@/hooks/useAuth";
import { useLoader } from "@/hooks/useLoader";

// Services
import { getUserProfile, logoutUser, updateUserProfileImage, getUserStats } from "@/service/userService";

export default function Profile() {
    const router = useRouter();
    const { user } = useAuth();
    const { showLoader, hideLoader } = useLoader(); //  Global Loader Hook

    const [userData, setUserData] = useState<any>(null);
    const [stats, setStats] = useState({ rentals: 0, saved: 0 }); //  Real Stats State
    const [refreshing, setRefreshing] = useState(false);
    const [isAvatarUploading, setAvatarUploading] = useState(false);
    const [isLogoutVisible, setLogoutVisible] = useState(false);

    // --- DATA LOAD (With Global Loader) ---
    const loadData = useCallback(async (isPullToRefresh = false) => {
        if (!user) return;

        try {
            // Pull to refresh
            if (!isPullToRefresh) showLoader();

            //  Parallel Fetching: (Fast)
            const [profileData, statsData] = await Promise.all([
                getUserProfile(),
                getUserStats(user.uid)
            ]);

            setUserData(profileData);
            setStats(statsData);

        } catch (error) {
            console.error("Error loading profile:", error);
            Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to load profile data' });
        } finally {
            if (!isPullToRefresh) hideLoader();
        }
    }, [user]);

    // Initial Load
    useEffect(() => {
        loadData(false);
    }, [loadData]);

    // Pull to Refresh Handler
    const onRefresh = async () => {
        setRefreshing(true);
        await loadData(true);
        setRefreshing(false);
    };

    // --- AVATAR UPDATE ---
    const handleProfilePicUpdate = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Toast.show({ type: 'error', text1: 'Permission Denied', text2: 'Need gallery access.' });
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            try {
                setAvatarUploading(true);
                const newUrl = await updateUserProfileImage(result.assets[0].uri);
                setUserData((prev: any) => ({ ...prev, photoURL: newUrl }));
                Toast.show({ type: 'success', text1: 'Updated!', text2: 'Profile picture changed.' });
            } catch (error) {
                Toast.show({ type: 'error', text1: 'Failed', text2: 'Could not upload image.' });
            } finally {
                setAvatarUploading(false);
            }
        }
    };

    // --- LOGOUT ---
    const confirmLogout = async () => {
        setLogoutVisible(false);
        try {
            showLoader();
            await logoutUser();
            setTimeout(() => {
                hideLoader();
                router.replace("/login");
            }, 500);
        } catch (error) {
            hideLoader();
            console.error(error);
        }
    };

    // --- MODERN MENU ITEM COMPONENT ---
    const ModernMenuItem = ({ icon, label, onPress, isDestructive = false, subtitle = "" }: any) => (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className="flex-row items-center justify-between p-4 bg-white mb-3 rounded-2xl shadow-sm border border-slate-50"
        >
            <View className="flex-row items-center gap-4">
                <View className={`w-10 h-10 rounded-full items-center justify-center ${isDestructive ? 'bg-red-50' : 'bg-slate-50'}`}>
                    <Ionicons name={icon} size={20} color={isDestructive ? '#EF4444' : '#1E293B'} />
                </View>
                <View>
                    <Text className={`text-[15px] font-bold ${isDestructive ? 'text-red-600' : 'text-slate-800'}`}>
                        {label}
                    </Text>
                    {subtitle ? <Text className="text-xs text-slate-400 font-medium">{subtitle}</Text> : null}
                </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
        </TouchableOpacity>
    );

    return (
        <View className="flex-1 bg-[#F8FAFC]">
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />}
            >
                {/* --- 1. HERO HEADER (Gradient) --- */}
                <View className="relative overflow-hidden rounded-b-[40px]">
                    <LinearGradient
                        colors={['#0F172A', '#1E293B', '#334155']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        className="pt-16 pb-24 px-6 items-center"
                    >
                        {/* Settings Icon */}
                        <TouchableOpacity
                            onPress={() => router.push("/profile/personal-info")}
                            className="absolute top-14 right-6 w-10 h-10 bg-white/10 rounded-full items-center justify-center backdrop-blur-md border border-white/10"
                        >
                            <Ionicons name="settings-outline" size={20} color="white" />
                        </TouchableOpacity>

                        {/* Avatar */}
                        <TouchableOpacity onPress={handleProfilePicUpdate} activeOpacity={0.9} className="relative mb-4">
                            <View className="p-1 bg-white/20 rounded-full backdrop-blur-sm">
                                <Image
                                    source={{ uri: userData?.photoURL || "https://i.pravatar.cc/300" }}
                                    className={`w-28 h-28 rounded-full bg-slate-800 ${isAvatarUploading ? 'opacity-50' : ''}`}
                                />
                            </View>
                            {!isAvatarUploading && (
                                <View className="absolute bottom-1 right-1 bg-blue-500 w-8 h-8 rounded-full items-center justify-center border-2 border-[#1E293B]">
                                    <Ionicons name="camera" size={14} color="white" />
                                </View>
                            )}
                            {isAvatarUploading && (
                                <View className="absolute inset-0 items-center justify-center">
                                    <ActivityIndicator color="white" />
                                </View>
                            )}
                        </TouchableOpacity>

                        {/* Name & Email */}
                        <Text className="text-2xl font-bold text-white mb-1">
                            {userData?.displayName || "Loading..."}
                        </Text>
                        <Text className="text-slate-400 text-sm font-medium mb-4">
                            {userData?.email}
                        </Text>

                        {/* Verification Badge (Glass) */}
                        <TouchableOpacity
                            onPress={() => !userData?.isIdVerified && router.push("/verification/id-upload")}
                            className={`px-4 py-1.5 rounded-full flex-row items-center gap-2 border ${
                                userData?.isIdVerified
                                    ? 'bg-green-500/20 border-green-500/30'
                                    : 'bg-orange-500/20 border-orange-500/30'
                            }`}
                        >
                            <Ionicons
                                name={userData?.isIdVerified ? "shield-checkmark" : "alert-circle"}
                                size={14}
                                color={userData?.isIdVerified ? "#4ade80" : "#fb923c"}
                            />
                            <Text className={`text-xs font-bold uppercase tracking-wide ${
                                userData?.isIdVerified ? "text-green-400" : "text-orange-400"
                            }`}>
                                {userData?.isIdVerified ? "Verified User" : "Verify ID Now"}
                            </Text>
                        </TouchableOpacity>

                    </LinearGradient>
                </View>

                {/* --- 2. FLOATING STATS (REAL DATA) --- */}
                <View className="px-6 -mt-10 mb-8">
                    <View className="bg-white rounded-3xl p-5 shadow-lg shadow-black/5 flex-row justify-between items-center">
                        <TouchableOpacity
                            onPress={() => router.push('/rentals')}
                            className="items-center flex-1 border-r border-slate-100"
                        >
                            {/* Rentals Count from DB */}
                            <Text className="text-xl font-extrabold text-slate-900">{stats.rentals}</Text>
                            <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Rentals</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => router.push('/saved')}
                            className="items-center flex-1 border-r border-slate-100"
                        >
                            {/* Saved Count from DB */}
                            <Text className="text-xl font-extrabold text-slate-900">{stats.saved}</Text>
                            <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Saved</Text>
                        </TouchableOpacity>

                        <TouchableOpacity className="items-center flex-1">
                            <View className="flex-row items-center gap-1">
                                <Text className="text-xl font-extrabold text-slate-900">5.0</Text>
                                <Ionicons name="star" size={14} color="#F59E0B" />
                            </View>
                            <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Rating</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* --- 3. MENU LIST --- */}
                <View className="px-6 pb-10">
                    <Text className="text-sm font-bold text-slate-900 mb-4 ml-1">Account & Settings</Text>

                    <ModernMenuItem
                        icon="cube-outline"
                        label="My Rentals"
                        subtitle="Active bookings & history"
                        onPress={() => router.push("/rentals")}
                    />
                    <ModernMenuItem
                        icon="heart-outline"
                        label="Saved Items"
                        subtitle="Your wishlist"
                        onPress={() => router.push("/saved")}
                    />
                    <ModernMenuItem
                        icon="person-outline"
                        label="Personal Info"
                        onPress={() => router.push("/profile/personal-info")}
                    />
                    <ModernMenuItem
                        icon="wallet-outline"
                        label="Payment Methods"
                        onPress={() => router.push("/profile/payments")}
                    />

                    <Text className="text-sm font-bold text-slate-900 mb-4 mt-4 ml-1">Support</Text>

                    <ModernMenuItem
                        icon="help-circle-outline"
                        label="Help & Support"
                        onPress={() => {}}
                    />
                    <ModernMenuItem
                        icon="log-out-outline"
                        label="Log Out"
                        isDestructive={true}
                        onPress={() => setLogoutVisible(true)}
                    />
                </View>

                <View className="items-center mb-6">
                    <Text className="text-slate-300 text-[10px] font-bold tracking-[4px] uppercase">GearUp v1.0.0</Text>
                </View>

            </ScrollView>

            <LogoutModal
                isVisible={isLogoutVisible}
                onClose={() => setLogoutVisible(false)}
                onConfirm={confirmLogout}
            />
        </View>
    );
}