import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import StoreLocationCard from "@/components/StoreLocationCard"; //  Reused Component

export default function StoreLocations() {
    const router = useRouter();

    const handleCall = () => {
        Linking.openURL('tel:+94762717290');
    };

    const handleWhatsApp = () => {
        Linking.openURL('whatsapp://send?phone=+94762717290&text=Hi GearUp!');
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#000000' }}>
            <StatusBar style="light" />
            <SafeAreaView className="flex-1">

                {/* Header */}
                <View className="px-6 py-4 flex-row items-center gap-4 mb-4">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 bg-[#1A1A1A] rounded-full items-center justify-center border border-white/10"
                    >
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-2xl font-black text-white">Our Locations</Text>
                </View>

                <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>

                    {/* Intro Text */}
                    <Text className="text-[#999999] text-base mb-8 leading-6">
                        Visit our showroom to inspect gear, pick up rentals, or just to say hi! We are open 7 days a week.
                    </Text>

                    {/*  REUSED MAP COMPONENT */}
                    <StoreLocationCard />

                    {/* Contact Section */}
                    <View className="mt-4 mb-10">
                        <Text className="text-xl font-black text-white mb-4">Contact Us</Text>

                        <View className="bg-[#1A1A1A] rounded-[24px] p-2 border border-white/5 gap-2">
                            {/* Call Button */}
                            <TouchableOpacity
                                onPress={handleCall}
                                className="flex-row items-center bg-black/40 p-4 rounded-2xl active:bg-black/60"
                            >
                                <View className="w-10 h-10 bg-[#B4F05F] rounded-full items-center justify-center mr-4">
                                    <Ionicons name="call" size={20} color="black" />
                                </View>
                                <View>
                                    <Text className="text-white font-bold text-base">Call Support</Text>
                                    <Text className="text-[#666666] text-xs font-bold">+94 77 123 4567</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#666666" style={{ marginLeft: 'auto' }} />
                            </TouchableOpacity>

                            {/* WhatsApp Button */}
                            <TouchableOpacity
                                onPress={handleWhatsApp}
                                className="flex-row items-center bg-black/40 p-4 rounded-2xl active:bg-black/60"
                            >
                                <View className="w-10 h-10 bg-[#25D366] rounded-full items-center justify-center mr-4">
                                    <Ionicons name="logo-whatsapp" size={20} color="white" />
                                </View>
                                <View>
                                    <Text className="text-white font-bold text-base">WhatsApp Us</Text>
                                    <Text className="text-[#666666] text-xs font-bold">Chat for quick help</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#666666" style={{ marginLeft: 'auto' }} />
                            </TouchableOpacity>
                        </View>
                    </View>

                </ScrollView>
            </SafeAreaView>
        </View>
    );
}