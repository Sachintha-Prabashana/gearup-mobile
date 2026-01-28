import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

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
        let isMounted = true; // 1. stop memory leaks

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

        return () => { isMounted = false; }; // Cleanup function
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
                // Location Data Group
                address: location.address,
                city: location.city,
                coordinates: { lat: location.lat, lng: location.lng } //  Lat/Lon Save
            });

            Toast.show({ type: 'success', text1: 'Profile Updated!' });
            router.back();

        } catch (error) {
            Toast.show({ type: 'error', text1: 'Update Failed', text2: 'Something went wrong.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <View className="flex-1 bg-white items-center justify-center"><ActivityIndicator color="#000"/></View>;

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="px-5 py-4 flex-row items-center gap-4 border-b border-slate-50">
                <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-slate-50 rounded-full items-center justify-center">
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-slate-900">Personal Info</Text>
            </View>

            <ScrollView className="p-6">

                {/* Full Name */}
                <View className="mb-6">
                    <Text className="text-slate-500 mb-2 font-bold text-xs uppercase tracking-wider">Full Name</Text>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-900 font-medium text-base"
                        placeholder="e.g. Sachintha Prabashana"
                    />
                </View>

                {/* Phone Number */}
                <View className="mb-6">
                    <Text className="text-slate-500 mb-2 font-bold text-xs uppercase tracking-wider">Phone Number</Text>
                    <TextInput
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-900 font-medium text-base"
                        placeholder="e.g. 077 123 4567"
                    />
                </View>

                {/* LOCATION INPUT (Clickable) */}
                <View className="mb-8">
                    <Text className="text-slate-500 mb-2 font-bold text-xs uppercase tracking-wider">Address / Location</Text>

                    <TouchableOpacity
                        onPress={() => setLocationModalVisible(true)} // Open Modal
                        activeOpacity={0.7}
                        className={`bg-slate-50 p-4 rounded-xl border flex-row justify-between items-center ${location.address ? 'border-slate-300' : 'border-slate-200'}`}
                    >
                        <View className="flex-1 pr-3">

                            <Text className={`text-base font-medium ${location.address ? 'text-slate-900' : 'text-slate-400'}`} numberOfLines={1}>
                                {location.address || "Tap to set location"}
                            </Text>

                            {location.city ? (
                                <Text className="text-xs text-slate-500 mt-1">
                                    <Ionicons name="location" size={10} color="#64748B" /> {location.city}
                                </Text>
                            ) : null}
                        </View>
                        <Ionicons name="map-outline" size={24} color="#0F172A" />
                    </TouchableOpacity>
                </View>

                {/* Save Button */}
                <TouchableOpacity
                    onPress={handleSave}
                    disabled={saving}
                    className="bg-slate-900 py-4 rounded-xl items-center shadow-md active:scale-95 transition-all"
                >
                    {saving ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-bold text-lg">Save Changes</Text>
                    )}
                </TouchableOpacity>

            </ScrollView>

            {/*  LOCATION MODAL COMPONENT */}
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
        </SafeAreaView>
    );
}