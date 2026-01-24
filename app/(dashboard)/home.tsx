import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    FlatList,
    Dimensions,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

// Data Import
import { categories, gearItems } from "@/constants/gearData";

const Home = () => {
    const router = useRouter();
    const [activeCategoryId, setActiveCategoryId] = useState(1);

    // Filter Logic
    const filteredItems = useMemo(() => {
        return gearItems.filter(item => item.categoryId === activeCategoryId);
    }, [activeCategoryId]);

    // Trending Logic
    const trendingItems = useMemo(() => {
        return gearItems.filter(item => item.rating >= 4.8);
    }, []);

    // --- COMPONENT: Airbnb Style Card (Vertical & Square) ---
    const GearCard = ({ item }: { item: any }) => (
        <TouchableOpacity
            className="mr-6 w-[280px] mb-2"
            activeOpacity={0.9}
            // onPress={() => router.push(`/product/${item.id}`)}
        >
            <View className="relative">
                {/* Image: Square/4:3 Ratio with Rounded Corners */}
                <Image
                    source={{ uri: item.image }}
                    className="w-full h-[280px] rounded-2xl bg-gray-200"
                    resizeMode="cover"
                />

                {/* "Guest Favourite" Badge (Exact Airbnb Look) */}
                {item.rating >= 4.8 && (
                    <View className="absolute top-3 left-3 bg-white/95 px-3 py-1.5 rounded-full shadow-md shadow-black/20 backdrop-blur-md border border-black/5">
                        <Text className="text-xs font-bold text-black">Guest favourite</Text>
                    </View>
                )}

                {/* Heart Icon (With subtle shadow for readability) */}
                <TouchableOpacity className="absolute top-3 right-3">
                    <Ionicons name="heart" size={26} color="rgba(0,0,0,0.5)" style={{ position: 'absolute' }} />
                    <Ionicons name="heart-outline" size={26} color="white" />
                </TouchableOpacity>
            </View>

            {/* Details Section */}
            <View className="mt-3">
                <View className="flex-row justify-between items-start">
                    <Text className="text-[15px] font-bold text-slate-900 flex-1 mr-2 leading-5">
                        {item.name}
                    </Text>
                    <View className="flex-row items-center gap-1">
                        <Ionicons name="star" size={13} color="#1A1A1A" />
                        <Text className="text-sm text-slate-900">{item.rating}</Text>
                    </View>
                </View>

                {/* Secondary Info: Gray text */}
                <Text className="text-slate-500 text-[14px] mt-0.5">Colombo • 2km away</Text>
                <Text className="text-slate-500 text-[14px]">Professional Kit</Text>

                {/* Price Section */}
                <View className="flex-row items-end mt-1.5">
                    <Text className="text-[15px] font-bold text-slate-900">
                        Rs. {item.pricePerDay.toLocaleString()}
                    </Text>
                    <Text className="text-slate-900 text-[14px]"> night</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            <StatusBar style="dark" />

            {/* --- 1. THE AIRBNB "DOUBLE DECKER" SEARCH BAR --- */}
            {/* White pill with high shadow, Icon Left, Filter Right */}
            {/* --- 1. SEARCH BAR (Airbnb Style) --- */}
            <View className="px-5 pt-2 pb-4 bg-white z-50">
                <TouchableOpacity
                    className="flex-row items-center bg-white rounded-full h-[60px] px-5 border border-gray-100"
                    activeOpacity={0.9}
                    // 👇 THIS IS THE SECRET SAUCE FOR THE "POP"
                    style={{
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 4, // Pushes shadow down (floating effect)
                        },
                        shadowOpacity: 0.15, // Darker than standard tailwind
                        shadowRadius: 10,   // Softer blur
                        elevation: 10,      // High elevation for Android
                    }}
                >
                    {/* Search Icon */}
                    <Ionicons name="search" size={24} color="#1A1A1A" />

                    {/* Text Container */}
                    <View className="flex-1 ml-4 justify-center">
                        <Text className="text-sm font-bold text-slate-900">
                            Where to?
                        </Text>
                        <Text className="text-xs text-slate-500 font-medium">
                            Anywhere • Any week • Add guests
                        </Text>
                    </View>

                    {/* Filter Button */}
                    <View className="w-9 h-9 bg-white border border-gray-200 rounded-full items-center justify-center">
                        <Ionicons name="options-outline" size={18} color="#1A1A1A" />
                    </View>
                </TouchableOpacity>
            </View>

            {/* --- 2. MAIN SCROLL CONTENT --- */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                className="bg-white"
            >

                {/* CATEGORIES (Modern Text Pills) */}
                <View className="mt-2 mb-6 border-b border-gray-50 pb-4">
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 20 }}
                    >
                        {categories.map((cat) => {
                            const isActive = activeCategoryId === cat.id;
                            return (
                                <TouchableOpacity
                                    key={cat.id}
                                    onPress={() => setActiveCategoryId(cat.id)}
                                    activeOpacity={0.8}
                                    className={`mr-3 px-5 py-2.5 rounded-full border transition-all ${
                                        isActive
                                            ? 'bg-black border-black'
                                            : 'bg-white border-gray-200'
                                    }`}
                                >
                                    <Text className={`text-[13px] font-bold ${
                                        isActive ? 'text-white' : 'text-slate-700'
                                    }`}>
                                        {cat.name}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* SECTION 1: Trending / Popular */}
                <View className="mb-10">
                    <View className="px-5 mb-5 flex-row items-center justify-between">
                        <Text className="text-xl font-bold text-slate-900">
                            Popular in Colombo
                        </Text>
                        <Ionicons name="chevron-forward" size={20} color="#1A1A1A" />
                    </View>

                    <FlatList
                        horizontal
                        data={trendingItems}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingLeft: 20, paddingRight: 20 }}
                        keyExtractor={item => `pop-${item.id}`}
                        renderItem={({ item }) => <GearCard item={item} />}
                        snapToInterval={280 + 24} // Card Width + Margin
                        decelerationRate="fast"
                    />
                </View>

                {/* SECTION 2: Available in Category */}
                <View className="mb-10">
                    <View className="px-5 mb-5 flex-row items-center justify-between">
                        <Text className="text-xl font-bold text-slate-900">
                            Available {categories.find(c => c.id === activeCategoryId)?.name}
                        </Text>
                        <Ionicons name="chevron-forward" size={20} color="#1A1A1A" />
                    </View>

                    <FlatList
                        horizontal
                        data={filteredItems}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingLeft: 20, paddingRight: 20 }}
                        keyExtractor={item => `cat-${item.id}`}
                        renderItem={({ item }) => <GearCard item={item} />}
                        snapToInterval={280 + 24}
                        decelerationRate="fast"
                    />
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};
export default Home;