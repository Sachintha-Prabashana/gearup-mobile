import React, { useState, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    FlatList,
    Image,
    Platform,
    LayoutAnimation,
    UIManager,
    Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

// Service Imports
import { getCategories, getGearByCategory, getTrendingGear } from '@/service/gearService';
import PromoCarousel from "@/components/PromoCarousel";
import SkeletonCard from "@/components/SkeletonCard";
import GearCard from "@/components/GearCard";
import FeaturedCard from "@/components/FeaturedCard";


// Enable Layout Animation
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}
const { width } = Dimensions.get('window');

const Home = () => {
    const router = useRouter();

    // --- STATE ---
    const [activeCategoryId, setActiveCategoryId] = useState<number>(1);
    const [activeBrand, setActiveBrand] = useState<string>("All");
    const [categories, setCategories] = useState<any[]>([]);
    const [trendingItems, setTrendingItems] = useState<any[]>([]);
    const [categoryItems, setCategoryItems] = useState<any[]>([]);
    const [loadingInitial, setLoadingInitial] = useState(true);
    const [loadingCategory, setLoadingCategory] = useState(false);

    // --- DATA LOADING ---
    useEffect(() => {
        const loadBaseData = async () => {
            try {
                const [catsData, trendsData] = await Promise.all([
                    getCategories(),
                    getTrendingGear()
                ]);
                const sortedCats = catsData.sort((a: any, b: any) => a.id - b.id);
                setCategories(sortedCats);
                setTrendingItems(trendsData);

                if (sortedCats.length > 0) {
                    await loadCategoryItems(Number(sortedCats[0].id));
                }
            } catch (e) {
                console.error("Failed to load home data", e);
            } finally {
                setLoadingInitial(false);
            }
        };
        loadBaseData();
    }, []);

    const handleCategoryChange = async (catId: number) => {
        if (catId === activeCategoryId) return;
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setActiveCategoryId(catId);
        setActiveBrand("All");
        await loadCategoryItems(catId);
    };

    const loadCategoryItems = async (catId: number) => {
        setLoadingCategory(true);
        const items = await getGearByCategory(catId);
        setCategoryItems(items);
        setLoadingCategory(false);
    };

    const availableBrands = useMemo(() => {
        const brands = new Set(categoryItems.map(item => item.brand));
        return ["All", ...Array.from(brands)];
    }, [categoryItems]);

    const filteredCategoryItems = useMemo(() => {
        if (activeBrand === "All") return categoryItems;
        return categoryItems.filter(item => item.brand === activeBrand);
    }, [categoryItems, activeBrand]);

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            <StatusBar style="dark" />

            {/* --- HEADER SECTION --- */}
            <View className="px-5 pt-2 pb-2 bg-white z-50">

                {/* 1. Location & Profile Row */}
                <View className="flex-row items-center justify-between mb-4">
                    {/* Location Info */}
                    <View>
                        {/* font-sans added for Inter Regular */}
                        <Text className="text-xs text-slate-400 font-medium font-sans mb-0.5">Location</Text>
                        <TouchableOpacity className="flex-row items-center gap-1 active:opacity-70">
                            <Ionicons name="location" size={18} color="#0F172A" />
                            {/* font-sans + font-bold for Inter Bold */}
                            <Text className="text-lg font-bold text-slate-900 font-sans">Colombo, SL</Text>
                            <Ionicons name="chevron-down" size={14} color="#94A3B8" />
                        </TouchableOpacity>
                    </View>

                    {/* Right Side: Notify + Profile */}
                    <View className="flex-row items-center gap-3">
                        {/* Notify Icon */}
                        <TouchableOpacity className="w-10 h-10 bg-white rounded-full items-center justify-center border border-slate-200 shadow-sm relative">
                            <View className="absolute top-2.5 right-3 w-2 h-2 bg-red-500 rounded-full z-10 border border-white" />
                            <Ionicons name="notifications-outline" size={22} color="#0F172A" />
                        </TouchableOpacity>

                        {/* Profile Image */}
                        <TouchableOpacity
                            onPress={() => router.push("/profile")}
                            className="w-10 h-10 rounded-full overflow-hidden border border-slate-200"
                        >
                            <Image
                                source={{ uri: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&auto=format&fit=crop&q=60" }}
                                className="w-full h-full"
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Search Bar */}
                <TouchableOpacity
                    className="flex-row items-center bg-white rounded-2xl h-[52px] px-4 border border-slate-200 shadow-sm shadow-slate-100"
                    activeOpacity={0.9}
                >
                    <Ionicons name="search-outline" size={22} color="#0F172A" />
                    <View className="flex-1 ml-3 h-full justify-center">
                        {/* font-sans + font-semibold for Inter SemiBold */}
                        <Text className="text-slate-900 font-semibold font-sans text-[14px]">Search equipment</Text>
                    </View>
                    <View className="bg-slate-900 w-8 h-8 rounded-xl items-center justify-center">
                        <Ionicons name="options" size={16} color="white" />
                    </View>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

                {/* Promo Carousel (Hero Section) */}
                <PromoCarousel />

                {/* --- CATEGORIES (PILL STYLE) --- */}
                <View className="mb-6">
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
                    >
                        {loadingInitial ? (
                            [1,2,3,4,5].map(i => <View key={i} className="w-24 h-12 bg-gray-100 rounded-full animate-pulse" />)
                        ) : (
                            categories.map((cat) => {
                                const isActive = activeCategoryId === Number(cat.id);
                                return (
                                    <TouchableOpacity
                                        key={cat.id}
                                        onPress={() => handleCategoryChange(Number(cat.id))}
                                        activeOpacity={0.7}
                                        className={`flex-row items-center justify-center px-5 py-3 rounded-full border transition-all ${
                                            isActive
                                                ? 'bg-slate-900 border-slate-900'
                                                : 'bg-white border-slate-200'
                                        }`}
                                    >
                                        <Ionicons
                                            name={cat.icon as any}
                                            size={18}
                                            color={isActive ? "white" : "#0F172A"}
                                        />
                                        {/* font-sans applied here */}
                                        <Text className={`ml-2 text-[13px] font-bold font-sans ${
                                            isActive ? "text-white" : "text-slate-700"
                                        }`}>
                                            {cat.name}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })
                        )}
                    </ScrollView>
                </View>

                {/* --- TRENDING SECTION --- */}
                <View className="mb-8">
                    <View className="px-5 mb-4 flex-row justify-between items-center">
                        {/* Explicit font-sans and font-bold */}
                        <Text className="text-lg font-bold text-slate-900 font-sans">Featured Listing</Text>
                        <TouchableOpacity>
                            <Text className="text-slate-500 text-xs font-bold font-sans">View All</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        horizontal
                        data={loadingInitial ? [1, 2, 3] : trendingItems}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingLeft: 20, paddingRight: 20 }}
                        keyExtractor={(item, index) => loadingInitial ? `skel-${index}` : `pop-${item.id}`}
                        renderItem={({ item }) =>
                            loadingInitial ? <SkeletonCard /> : <FeaturedCard item={item} />
                        }
                        snapToInterval={width - 20}
                        decelerationRate="fast"
                    />
                </View>

                {/* --- AVAILABLE ITEMS --- */}
                <View className="mb-10">
                    <View className="px-5 mb-4">
                        <Text className="text-lg font-bold text-slate-900 font-sans">
                            Available {categories.find(c => Number(c.id) === activeCategoryId)?.name}
                        </Text>
                    </View>

                    {/* Brand Filter Chips */}
                    {!loadingCategory && availableBrands.length > 1 && (
                        <View className="mb-5">
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
                            >
                                {availableBrands.map((brand) => {
                                    const isSelected = activeBrand === brand;
                                    return (
                                        <TouchableOpacity
                                            key={brand}
                                            onPress={() => {
                                                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                                setActiveBrand(brand);
                                            }}
                                            className={`px-4 py-2 rounded-full border ${
                                                isSelected
                                                    ? "bg-slate-900 border-slate-900"
                                                    : "bg-white border-slate-200"
                                            }`}
                                        >
                                            <Text className={`text-[12px] font-bold font-sans ${isSelected ? "text-white" : "text-slate-600"}`}>
                                                {brand}
                                            </Text>
                                        </TouchableOpacity>
                                    )
                                })}
                            </ScrollView>
                        </View>
                    )}

                    <FlatList
                        horizontal
                        data={loadingCategory ? [1, 2, 3] : filteredCategoryItems}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingLeft: 20, paddingRight: 20 }}
                        keyExtractor={(item, index) => loadingCategory ? `cat-skel-${index}` : `cat-${item.id}`}
                        renderItem={({ item }) => loadingCategory ? <SkeletonCard /> : <GearCard item={item} />}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Home;