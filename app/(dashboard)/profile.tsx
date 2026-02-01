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
    StyleSheet, Linking
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient';

// Components
import ConfirmationModal from "@/components/ConfirmationModal";

// Hooks
import { useAuth } from "@/hooks/useAuth";
import { useLoader } from "@/hooks/useLoader";

// Services
import { getUserProfile, logoutUser, updateUserProfileImage, getUserStats } from "@/service/userService";

export default function Profile() {
    const router = useRouter();
    const { user } = useAuth();
    const { showLoader, hideLoader } = useLoader();

    const [userData, setUserData] = useState<any>(null);
    const [stats, setStats] = useState({ rentals: 0, saved: 0 });
    const [refreshing, setRefreshing] = useState(false);
    const [isAvatarUploading, setAvatarUploading] = useState(false);
    const [isLogoutVisible, setLogoutVisible] = useState(false);

    const loadData = useCallback(async (isPullToRefresh = false) => {
        if (!user) return;
        try {
            if (!isPullToRefresh) showLoader();
            const [profileData, statsData] = await Promise.all([
                getUserProfile(),
                getUserStats(user.uid)
            ]);
            setUserData(profileData);
            setStats(statsData);
        } catch (error) {
            console.error("Error loading profile:", error);
            Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to load profile' });
        } finally {
            if (!isPullToRefresh) hideLoader();
        }
    }, [user]);

    useEffect(() => {
        loadData(false);
    }, [loadData]);

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData(true);
        setRefreshing(false);
    };

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

    const handleSupport = () => {
        const phone = "947XXXXXXXX";
        const msg = "Hi! I need help with CamMart app.";
        Linking.openURL(`whatsapp://send?phone=${phone}&text=${msg}`);
    };

    const ModernMenuItem = ({ icon, label, onPress, isDestructive = false, subtitle = "" }: any) => (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            style={{ backgroundColor: '#1A1A1A', borderColor: '#2A2A2A' }}
            className="flex-row items-center justify-between p-4 mb-3 rounded-2xl border"
        >
            <View className="flex-row items-center gap-4">
                <View style={{ backgroundColor: isDestructive ? '#EF444415' : '#262626' }} className="w-10 h-10 rounded-full items-center justify-center">
                    <Ionicons name={icon} size={20} color={isDestructive ? '#EF4444' : '#B4F05F'} />
                </View>
                <View>
                    <Text className={`text-[15px] font-bold ${isDestructive ? 'text-red-500' : 'text-white'}`}>
                        {label}
                    </Text>
                    {subtitle ? <Text className="text-xs text-[#666666] font-medium">{subtitle}</Text> : null}
                </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#333333" />
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#000000' }}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#B4F05F" />}
            >
                {/* --- 1. HERO HEADER --- */}
                <View className="relative overflow-hidden rounded-b-[48px]">
                    <LinearGradient
                        colors={['#1A1A1A', '#000000']}
                        className="pt-16 pb-24 px-6 items-center"
                    >
                        <TouchableOpacity
                            onPress={() => router.push("/profile/personal-info")}
                            className="absolute top-14 right-6 w-10 h-10 bg-white/5 rounded-full items-center justify-center border border-white/10"
                        >
                            <Ionicons name="settings-outline" size={20} color="white" />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleProfilePicUpdate} activeOpacity={0.9} className="relative mb-5">
                            <View className="p-1 bg-[#B4F05F]/20 rounded-full">
                                <Image
                                    source={{
                                        uri: user?.photoURL
                                            ? user.photoURL
                                            : `https://ui-avatars.com/api/?name=${user?.displayName || "User"}&background=333333&color=B4F05F&bold=true`
                                    }}
                                    className={`w-28 h-28 rounded-full bg-slate-900 ${isAvatarUploading ? 'opacity-50' : ''}`}
                                />
                            </View>
                            {!isAvatarUploading && (
                                <View style={{ backgroundColor: '#B4F05F' }} className="absolute bottom-1 right-1 w-8 h-8 rounded-full items-center justify-center border-4 border-[#000000]">
                                    <Ionicons name="camera" size={14} color="black" />
                                </View>
                            )}
                        </TouchableOpacity>

                        <Text className="text-3xl font-black text-white mb-1">
                            {userData?.displayName || "Loading..."}
                        </Text>
                        <Text className="text-[#666666] text-sm font-bold mb-5">
                            {userData?.email}
                        </Text>

                        <TouchableOpacity
                            onPress={() => !userData?.isIdVerified && router.push("/verification/id-upload")}
                            className={`px-5 py-2 rounded-full flex-row items-center gap-2 border ${
                                userData?.isIdVerified
                                    ? 'bg-[#B4F05F]/10 border-[#B4F05F]/30'
                                    : 'bg-orange-500/10 border-orange-500/30'
                            }`}
                        >
                            <Ionicons
                                name={userData?.isIdVerified ? "shield-checkmark" : "alert-circle"}
                                size={14}
                                color={userData?.isIdVerified ? "#B4F05F" : "#fb923c"}
                            />
                            <Text className={`text-[10px] font-black uppercase tracking-widest ${
                                userData?.isIdVerified ? "text-[#B4F05F]" : "text-orange-400"
                            }`}>
                                {userData?.isIdVerified ? "Verified Pro" : "Verify Identity"}
                            </Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>

                {/* --- 2. FLOATING STATS --- */}
                <View className="px-6 -mt-12 mb-10">
                    <View style={{ backgroundColor: '#1A1A1A' }} className="rounded-[32px] p-6 shadow-2xl flex-row justify-between items-center border border-white/5">
                        <TouchableOpacity onPress={() => router.push('/rentals')} className="items-center flex-1 border-r border-white/5">
                            <Text className="text-2xl font-black text-white">{stats.rentals}</Text>
                            <Text className="text-[10px] text-[#666666] font-black uppercase tracking-[2px] mt-1">Rentals</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => router.push('/saved')} className="items-center flex-1 border-r border-white/5">
                            <Text className="text-2xl font-black text-white">{stats.saved}</Text>
                            <Text className="text-[10px] text-[#666666] font-black uppercase tracking-[2px] mt-1">Saved</Text>
                        </TouchableOpacity>

                        <TouchableOpacity className="items-center flex-1">
                            <View className="flex-row items-center gap-1">
                                <Text className="text-2xl font-black text-white">5.0</Text>
                                <Ionicons name="star" size={16} color="#B4F05F" />
                            </View>
                            <Text className="text-[10px] text-[#666666] font-black uppercase tracking-[2px] mt-1">Rating</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* --- 3. MENU LIST --- */}
                <View className="px-6 pb-10">
                    <Text className="text-[11px] font-black text-[#666666] uppercase tracking-[3px] mb-5 ml-2">Management</Text>

                    <ModernMenuItem
                        icon="cube-outline"
                        label="My Rentals"
                        subtitle="Manage active gear & history"
                        onPress={() => router.push("/rentals")}
                    />
                    <ModernMenuItem
                        icon="heart-outline"
                        label="Wishlist"
                        subtitle="Gear you're watching"
                        onPress={() => router.push("/saved")}
                    />
                    <ModernMenuItem
                        icon="person-outline"
                        label="Personal Details"
                        onPress={() => router.push("/profile/personal-info")}
                    />
                    <ModernMenuItem
                        icon="wallet-outline"
                        label="Payments"
                        onPress={() => router.push("/profile/payments")}
                    />

                    <Text className="text-[11px] font-black text-[#666666] uppercase tracking-[3px] mb-5 mt-8 ml-2">Support</Text>

                    <ModernMenuItem
                        icon="chatbubble-ellipses-outline"
                        label="Customer Support"
                        onPress={handleSupport}
                    />
                    <ModernMenuItem
                        icon="log-out-outline"
                        label="Sign Out"
                        isDestructive={true}
                        onPress={() => setLogoutVisible(true)}
                    />
                </View>

                <View className="items-center mb-8">
                    <Text className="text-[#333333] text-[9px] font-black tracking-[6px] uppercase">CamMart v1.0.0</Text>
                </View>

            </ScrollView>

            <ConfirmationModal
                isVisible={isLogoutVisible}
                onClose={() => setLogoutVisible(false)}
                onConfirm={confirmLogout}
                title="Sign Out"
                message="Are you sure you want to log out? You'll need to sign back in."
                confirmText="Logout"
                icon="log-out-outline"
                isDanger={true}
            />
        </View>
    );
}