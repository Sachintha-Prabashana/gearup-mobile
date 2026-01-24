import React, { useState, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    FlatList,
    Platform,
    LayoutAnimation,
    UIManager,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

// Service Imports
import { getCategories, getGearByCategory, getTrendingGear } from '@/service/gearService';

const { width } = Dimensions.get('window');

// Enable Layout Animation
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

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

    // --- COMPONENT: HERO BANNER (New Addition) ---
    const PromoBanner = () => (
        <View className="px-5 mb-6">
            <View className="bg-slate-900 rounded-3xl p-5 flex-row items-center justify-between overflow-hidden relative h-[140px]">
                {/* Decorative Circles */}
                <View className="absolute -right-10 -top-10 w-40 h-40 bg-slate-800 rounded-full opacity-50" />
                <View className="absolute right-10 bottom-0 w-20 h-20 bg-slate-700 rounded-full opacity-30" />

                <View className="z-10 w-2/3">
                    <View className="bg-orange-500 self-start px-2 py-1 rounded-md mb-2">
                        <Text className="text-[10px] font-bold text-white uppercase">New Arrival</Text>
                    </View>
                    <Text className="text-white text-xl font-bold leading-6">
                        Rent the new{'\n'}Sony A7S III today
                    </Text>
                    <Text className="text-slate-400 text-xs mt-2 font-medium">Starting from Rs. 15,000/day</Text>
                </View>

                {/* Hero Image (Static for now) */}
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=300&q=80' }}
                    className="absolute -right-5 bottom-0 w-32 h-32 rounded-xl rotate-[-10deg]"
                    resizeMode="cover"
                />
            </View>
        </View>
    );

    // --- COMPONENT: SKELETON CARD ---
    const SkeletonCard = () => (
        <View className="mr-4 w-[240px]">
            <View className="w-full h-[300px] rounded-2xl bg-gray-100 animate-pulse" />
            <View className="mt-3 space-y-2 px-1">
                <View className="h-4 w-3/4 bg-gray-100 rounded" />
                <View className="h-3 w-1/2 bg-gray-100 rounded" />
            </View>
        </View>
    );

    // --- COMPONENT: PRO GEAR CARD ---
    const GearCard = ({ item }: { item: any }) => (
        <TouchableOpacity
            className="mr-4 w-[240px]"
            activeOpacity={0.9}
            onPress={() => router.push({ pathname: "/product/[id]", params: { id: item.id } })}
        >
            <View className="relative shadow-sm shadow-black/5">
                <Image
                    source={{ uri: item.image }}
                    className="w-full h-[300px] rounded-2xl bg-gray-200"
                    resizeMode="cover"
                />

                {/* Floating Gradient Overlay at bottom for text readability */}
                <View className="absolute bottom-0 w-full h-20 rounded-b-2xl bg-black/5" />

                {/* Rating Badge (Glassmorphism) */}
                <View className="absolute top-3 right-3 flex-row items-center gap-1 bg-white/90 px-2 py-1 rounded-lg backdrop-blur-md shadow-sm">
                    <Ionicons name="star" size={12} color="#F59E0B" />
                    <Text className="text-[11px] font-bold text-slate-900">{item.rating}</Text>
                </View>

                {/* Fav Button */}
                <TouchableOpacity className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/20 items-center justify-center backdrop-blur-sm">
                    <Ionicons name="heart-outline" size={18} color="white" />
                </TouchableOpacity>
            </View>

            <View className="mt-3 px-1">
                <View className="flex-row justify-between items-start">
                    <View>
                        <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                            {item.brand}
                        </Text>
                        <Text className="text-[16px] font-bold text-slate-900 leading-tight" numberOfLines={1}>
                            {item.name}
                        </Text>
                    </View>
                </View>

                <View className="flex-row items-center mt-2 justify-between">
                    <View className="flex-row items-baseline">
                        <Text className="text-[15px] font-extrabold text-slate-900">
                            Rs. {item.pricePerDay.toLocaleString()}
                        </Text>
                        <Text className="text-slate-400 text-xs font-medium ml-1">/day</Text>
                    </View>
                    {item.verificationRequired && (
                        <View className="bg-green-50 px-1.5 py-0.5 rounded border border-green-100">
                            <Text className="text-[9px] font-bold text-green-700">VERIFIED</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            <StatusBar style="dark" />

            {/* --- HEADER --- */}
            <View className="px-5 pt-1 pb-2 bg-white z-50">
                <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-1">
                        <Text className="text-xs text-slate-400 font-medium mb-0.5">Pick up location</Text>
                        <TouchableOpacity className="flex-row items-center gap-1 active:opacity-70">
                            <Ionicons name="location" size={18} color="#0F172A" />
                            <Text className="text-lg font-bold text-slate-900">Colombo, Sri Lanka</Text>
                            <Ionicons name="chevron-down" size={14} color="#94A3B8" />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity className="w-10 h-10 bg-slate-50 rounded-full items-center justify-center border border-slate-100 shadow-sm relative">
                        <View className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full z-10 border border-white" />
                        <Ionicons name="notifications-outline" size={22} color="#0F172A" />
                    </TouchableOpacity>
                </View>

                {/* HIGH END SEARCH BAR */}
                <TouchableOpacity
                    className="flex-row items-center bg-white rounded-2xl h-[52px] px-4 border border-slate-200 shadow-sm shadow-slate-100"
                    activeOpacity={0.9}
                >
                    <Ionicons name="search-outline" size={22} color="#0F172A" />
                    <View className="flex-1 ml-3 h-full justify-center">
                        <Text className="text-slate-900 font-semibold text-[14px]">Search equipment</Text>
                        <Text className="text-slate-400 text-[11px]">Dates • Guests • Brands</Text>
                    </View>
                    <View className="bg-slate-900 w-8 h-8 rounded-xl items-center justify-center">
                        <Ionicons name="options" size={16} color="white" />
                    </View>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

                {/* --- PROMO BANNER --- */}
                <PromoBanner />

                {/* --- CATEGORIES --- */}
                <View className="mb-6">
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
                    >
                        {loadingInitial ? (
                            [1,2,3,4,5].map(i => <View key={i} className="w-16 h-20 bg-gray-50 rounded-2xl animate-pulse" />)
                        ) : (
                            categories.map((cat) => {
                                const isActive = activeCategoryId === Number(cat.id);
                                return (
                                    <TouchableOpacity
                                        key={cat.id}
                                        onPress={() => handleCategoryChange(Number(cat.id))}
                                        activeOpacity={0.7}
                                        className={`items-center justify-center py-3 px-1 rounded-2xl w-[72px] transition-all ${
                                            isActive ? 'bg-slate-900 shadow-md shadow-slate-300' : 'bg-white border border-slate-100'
                                        }`}
                                    >
                                        <View className={`w-10 h-10 rounded-full items-center justify-center mb-1.5 ${
                                            isActive ? 'bg-white/10' : 'bg-slate-50'
                                        }`}>
                                            <Ionicons
                                                name={cat.icon as any}
                                                size={20}
                                                color={isActive ? "white" : "#64748B"}
                                            />
                                        </View>
                                        <Text className={`text-[10px] font-bold text-center ${
                                            isActive ? "text-white" : "text-slate-500"
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
                        <Text className="text-lg font-bold text-slate-900">Featured Gear</Text>
                        <TouchableOpacity>
                            <Text className="text-slate-500 text-xs font-bold">View All</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        horizontal
                        data={loadingInitial ? [1, 2, 3] : trendingItems}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingLeft: 20, paddingRight: 20 }}
                        keyExtractor={(item, index) => loadingInitial ? `skel-${index}` : `pop-${item.id}`}
                        renderItem={({ item }) => loadingInitial ? <SkeletonCard /> : <GearCard item={item} />}
                    />
                </View>

                {/* --- FILTER SECTION --- */}
                <View className="mb-10">
                    <View className="px-5 mb-4">
                        <Text className="text-lg font-bold text-slate-900">
                            Available {categories.find(c => Number(c.id) === activeCategoryId)?.name}
                        </Text>
                    </View>

                    {/* Minimalist Brand Chips */}
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
                                            <Text className={`text-[12px] font-bold ${isSelected ? "text-white" : "text-slate-600"}`}>
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
                        renderItem={({ item }) =>
                            loadingCategory ? <SkeletonCard /> : <GearCard item={item} />
                        }
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Home;