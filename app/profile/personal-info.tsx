import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { StatusBar } from 'expo-status-bar';

// Components
import LocationPickerModal from "@/components/LocationPickerModal";

// Services & Hooks
import { updateUserProfile, getUserProfile } from "@/service/userService";
import { useAuth } from "@/hooks/useAuth";

export default function PersonalInfo() {
    const router = useRouter();
    const { user } = useAuth();

    // Form States
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState({ address: "", city: "", lat: 0, lng: 0 });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isLocationModalVisible, setLocationModalVisible] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchInfo = async () => {
            if (user) {
                try {
                    const data: any = await getUserProfile();
                    if (data && isMounted) {
                        setName(data.displayName || "");
                        setPhone(data.phoneNumber || "");
                        const coords = data.coordinates || {};
                        setLocation({
                            address: data.address || "",
                            city: data.city || "",
                            lat: coords.lat || 0,
                            lng: coords.lng || 0
                        });
                    }
                } catch (error) {
                    console.error("Failed to fetch user data", error);
                }
            }
            if (isMounted) setLoading(false);
        };

        fetchInfo();
        return () => { isMounted = false; };
    }, [user]);

    const handleSave = async () => {
        if (!name.trim()) {
            Toast.show({ type: 'error', text1: 'Name Required', text2: 'Please enter your full name.' });
            return;
        }

        try {
            setSaving(true);
            await updateUserProfile({
                displayName: name,
                phoneNumber: phone,
                address: location.address,
                city: location.city,
                coordinates: { lat: location.lat, lng: location.lng }
            });

            Toast.show({ type: 'success', text1: 'Profile Updated!' });
            router.back();

        } catch (error) {
            Toast.show({ type: 'error', text1: 'Update Failed', text2: 'Something went wrong.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <View style={{ flex: 1, backgroundColor: '#000000' }} className="items-center justify-center">
            <ActivityIndicator color="#B4F05F"/>
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#000000' }}>
            <StatusBar style="light" />
            <SafeAreaView className="flex-1" edges={['top']}>

                {/* Header */}
                <View style={{ borderBottomColor: '#1A1A1A' }} className="px-5 py-5 flex-row items-center gap-4 border-b">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{ backgroundColor: '#1A1A1A' }}
                        className="w-10 h-10 rounded-full items-center justify-center border border-white/5"
                    >
                        <Ionicons name="arrow-back" size={22} color="white" />
                    </TouchableOpacity>
                    <Text className="text-xl font-black text-white tracking-tighter">Personal Details</Text>
                </View>

                <ScrollView className="px-6 pt-8" showsVerticalScrollIndicator={false}>

                    {/* Full Name */}
                    <View className="mb-8">
                        <Text className="text-[#666666] mb-3 font-black text-[10px] uppercase tracking-[2px] ml-1">Full Name</Text>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            style={{ backgroundColor: '#1A1A1A', borderColor: '#2A2A2A' }}
                            className="p-4 rounded-2xl border text-white font-bold text-base"
                            placeholder="e.g. Sachintha Prabashana"
                            placeholderTextColor="#444"
                        />
                    </View>

                    {/* Phone Number */}
                    <View className="mb-8">
                        <Text className="text-[#666666] mb-3 font-black text-[10px] uppercase tracking-[2px] ml-1">Phone Number</Text>
                        <TextInput
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                            style={{ backgroundColor: '#1A1A1A', borderColor: '#2A2A2A' }}
                            className="p-4 rounded-2xl border text-white font-bold text-base"
                            placeholder="e.g. 077 123 4567"
                            placeholderTextColor="#444"
                        />
                    </View>

                    {/* LOCATION INPUT */}
                    <View className="mb-12">
                        <Text className="text-[#666666] mb-3 font-black text-[10px] uppercase tracking-[2px] ml-1">Current Address</Text>
                        <TouchableOpacity
                            onPress={() => setLocationModalVisible(true)}
                            activeOpacity={0.8}
                            style={{ backgroundColor: '#1A1A1A', borderColor: location.address ? '#B4F05F40' : '#2A2A2A' }}
                            className="p-5 rounded-2xl border flex-row justify-between items-center"
                        >
                            <View className="flex-1 pr-4">
                                <Text className={`text-base font-bold ${location.address ? 'text-white' : 'text-[#444]'}`} numberOfLines={1}>
                                    {location.address || "Tap to select on map"}
                                </Text>
                                {location.city ? (
                                    <View className="flex-row items-center mt-2">
                                        <Ionicons name="location" size={12} color="#B4F05F" />
                                        <Text className="text-xs text-[#666666] font-bold ml-1 uppercase tracking-widest">{location.city}</Text>
                                    </View>
                                ) : null}
                            </View>
                            <Ionicons name="map-outline" size={24} color={location.address ? "#B4F05F" : "#666"} />
                        </TouchableOpacity>
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity
                        onPress={handleSave}
                        disabled={saving}
                        style={{
                            backgroundColor: '#B4F05F',
                            shadowColor: '#B4F05F',
                            shadowOffset: { width: 0, height: 8 },
                            shadowOpacity: 0.3,
                            shadowRadius: 12,
                            elevation: 8
                        }}
                        className="py-5 rounded-[24px] items-center active:scale-[0.98]"
                    >
                        {saving ? (
                            <ActivityIndicator color="black" />
                        ) : (
                            <Text className="text-black font-black text-base uppercase tracking-widest">Update Profile</Text>
                        )}
                    </TouchableOpacity>

                    <View className="h-20" />
                </ScrollView>
            </SafeAreaView>

            {/* LOCATION MODAL */}
            <LocationPickerModal
                isVisible={isLocationModalVisible}
                onClose={() => setLocationModalVisible(false)}
                onConfirm={(details) => {
                    setLocation({
                        address: details.address,
                        city: details.city,
                        lat: details.lat,
                        lng: details.lng
                    });
                }}
            />
        </View>
    );
}