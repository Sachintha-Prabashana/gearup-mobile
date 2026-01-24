import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions,
    FlatList,
    StatusBar, Platform
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import Data
import { gearItems } from "@/constants/gearData"; // Update path if needed

const { width, height } = Dimensions.get('window');

export default function ProductDetails() {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    // Find the specific item
    const item = gearItems.find(g => g.id === parseInt(id as string));
    const [activeSlide, setActiveSlide] = useState(0);

    if (!item) return <View className="flex-1 bg-white" />;

    // --- 1. Image Slider Logic ---
    const onScroll = (event: any) => {
        const slideSize = event.nativeEvent.layoutMeasurement.width;
        const index = event.nativeEvent.contentOffset.x / slideSize;
        setActiveSlide(Math.round(index));
    };

    return (
        <View className="flex-1 bg-white">
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* --- CONTENT SCROLL --- */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

                {/* A. IMMERSIVE IMAGE SLIDER */}
                <View className="relative">
                    <FlatList
                        data={item.gallery && item.gallery.length > 0 ? item.gallery : [item.image]}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={onScroll}
                        renderItem={({ item: imageUrl }) => (
                            <Image
                                source={{ uri: imageUrl }}
                                style={{ width: width, height: 350 }}
                                resizeMode="cover"
                            />
                        )}
                        keyExtractor={(_, index) => index.toString()}
                    />

                    {/* Top Navigation Overlay */}
                    <View className="absolute top-12 left-5 right-5 flex-row justify-between items-center z-10">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="w-8 h-8 bg-white rounded-full items-center justify-center shadow-sm"
                        >
                            <Ionicons name="chevron-back" size={20} color="black" />
                        </TouchableOpacity>

                        <View className="flex-row gap-3">
                            <TouchableOpacity className="w-8 h-8 bg-white rounded-full items-center justify-center shadow-sm">
                                <Ionicons name="share-outline" size={18} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity className="w-8 h-8 bg-white rounded-full items-center justify-center shadow-sm">
                                <Ionicons name="heart-outline" size={18} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Page Counter (Airbnb Style) */}
                    <View className="absolute bottom-4 right-5 bg-black/70 px-3 py-1 rounded-md">
                        <Text className="text-white text-xs font-bold">
                            {activeSlide + 1} / {item.gallery ? item.gallery.length : 1}
                        </Text>
                    </View>
                </View>

                {/* B. MAIN DETAILS */}
                <View className="px-5 pt-6">

                    {/* Title & Rating */}
                    <Text className="text-2xl font-bold text-slate-900 leading-8 mb-2">
                        {item.name}
                    </Text>
                    <View className="flex-row items-center gap-1 mb-6">
                        <Ionicons name="star" size={14} color="#1A1A1A" />
                        <Text className="text-sm font-medium text-slate-900">{item.rating} · </Text>
                        <Text className="text-sm font-medium underline text-slate-900">{item.reviewCount} reviews</Text>
                        <Text className="text-sm text-slate-500"> · Colombo, Sri Lanka</Text>
                    </View>

                    {/* Divider */}
                    <View className="h-[1px] bg-gray-200 w-full mb-6" />

                    {/* C. HOST PROFILE (Trust Signal) */}
                    <View className="flex-row items-center justify-between mb-6">
                        <View>
                            <Text className="text-base font-bold text-slate-900">Hosted by GearUp</Text>
                            <Text className="text-slate-500 text-sm">Verified Owner · 3 years hosting</Text>
                        </View>
                        <Image
                            source={{ uri: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100" }}
                            className="w-12 h-12 rounded-full border border-gray-200"
                        />
                    </View>

                    <View className="h-[1px] bg-gray-200 w-full mb-6" />

                    {/* D. DESCRIPTION */}
                    <View className="mb-6">
                        <Text className="text-base leading-6 text-slate-700">
                            {item.description}
                        </Text>
                        <TouchableOpacity className="mt-2">
                            <Text className="font-bold underline text-slate-900">Show more</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="h-[1px] bg-gray-200 w-full mb-6" />

                    {/* E. "WHAT THIS PLACE OFFERS" (Specs/Features) */}
                    <View className="mb-6">
                        <Text className="text-lg font-bold text-slate-900 mb-4">Whats included</Text>
                        {item.features && item.features.map((feature: string, index: number) => (
                            <View key={index} className="flex-row items-start mb-4">
                                <Ionicons name="checkmark-circle-outline" size={22} color="#475569" style={{ marginTop: 2 }} />
                                <Text className="ml-3 text-slate-700 text-[15px] flex-1">{feature}</Text>
                            </View>
                        ))}
                        <TouchableOpacity className="mt-2 border border-black rounded-lg py-3 items-center">
                            <Text className="font-bold text-slate-900">Show all specs</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </ScrollView>

            {/* --- 3. STICKY FOOTER (The Airbnb "Reserve" Bar) --- */}
            <View
                className="absolute bottom-0 w-full bg-white border-t border-gray-200 px-5 pt-4 pb-8 flex-row items-center justify-between z-20"
                style={{ paddingBottom: Platform.OS === 'ios' ? 30 : 20 }}
            >
                <View>
                    <View className="flex-row items-end">
                        <Text className="text-lg font-bold text-slate-900">
                            Rs. {item.pricePerDay.toLocaleString()}
                        </Text>
                        <Text className="text-slate-500 text-sm mb-0.5"> / day</Text>
                    </View>
                    <Text className="text-xs text-slate-500 underline">Dec 15 – 20</Text>
                </View>

                <TouchableOpacity
                    className="bg-[#FF385C] px-8 py-3.5 rounded-lg shadow-sm" // Airbnb Brand Red
                    activeOpacity={0.8}
                    onPress={() => console.log("Reserve Clicked")}
                >
                    <Text className="text-white font-bold text-base">Reserve</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}