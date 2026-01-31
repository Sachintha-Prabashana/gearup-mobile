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
    Dimensions,
    StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient';

import { getCategories, getGearByCategory, getTrendingGear } from '@/service/gearService';
import { toggleFavorite, getUserFavoriteIds } from "@/service/favoriteService";
import { useAuth } from "@/hooks/useAuth";
import PromoCarousel from "@/components/PromoCarousel";
import SkeletonCard from "@/components/SkeletonCard";
import GearCard from "@/components/GearCard";
import FeaturedCard from "@/components/FeaturedCard";

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}
const { width } = Dimensions.get('window');

const Home = () => {
    const router = useRouter();
    const { user } = useAuth();

    // --- STATE ---
    const [activeCategoryId, setActiveCategoryId] = useState<number>(1);
    const [activeBrand, setActiveBrand] = useState<string>("All");
    const [categories, setCategories] = useState<any[]>([]);
    const [trendingItems, setTrendingItems] = useState<any[]>([]);
    const [categoryItems, setCategoryItems] = useState<any[]>([]);
    const [loadingInitial, setLoadingInitial] = useState(true);
    const [loadingCategory, setLoadingCategory] = useState(false);
    const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

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

                if (user) {
                    const ids = await getUserFavoriteIds();
                    setFavoriteIds(new Set(ids));
                }

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
    }, [user]);

    const handleToggleFavorite = async (item: any) => {
        if(!user) {
            Toast.show({ type: 'error', text1: 'Login Required', text2: 'Please login to save items.' });
            return;
        }
        const newFavorites = new Set(favoriteIds);
        const isCurrentlyLiked = newFavorites.has(item.id);
        isCurrentlyLiked ? newFavorites.delete(item.id) : newFavorites.add(item.id);
        setFavoriteIds(newFavorites);
        try {
            await toggleFavorite(item);
        } catch (error) {
            isCurrentlyLiked ? newFavorites.add(item.id) : newFavorites.delete(item.id);
            setFavoriteIds(new Set(newFavorites));
            Toast.show({ type: 'error', text1: 'Connection Error' });
        }
    }

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
        let items = categoryItems;
        if (activeBrand !== "All") {
            items = items.filter(item => item.brand === activeBrand);
        }
        return items.sort((a, b) => {
            const qtyA = Number(a.quantity || 0);
            const qtyB = Number(b.quantity || 0);
            if (qtyA === 0 && qtyB > 0) return 1;
            if (qtyA > 0 && qtyB === 0) return -1;
            return 0;
        });
    }, [categoryItems, activeBrand]);

    return (
        <View style={{ flex: 1, backgroundColor: '#000000' }}>
            <StatusBar style="light" />

            <SafeAreaView className="flex-1" edges={['top']}>
                {/* --- HEADER SECTION --- */}
                <View className="px-5 pt-2 pb-4 bg-transparent">
                    {/* Location & Profile Row */}
                    <View className="flex-row items-center justify-between mb-5">
                        <View>
                            <Text className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Location</Text>
                            <TouchableOpacity className="flex-row items-center gap-1">
                                <Ionicons name="location" size={16} color="#B4F05F" />
                                <Text className="text-base font-bold text-white">Colombo, SL</Text>
                                <Ionicons name="chevron-down" size={14} color="#666666" />
                            </TouchableOpacity>
                        </View>

                        <View className="flex-row items-center gap-3">
                            <TouchableOpacity style={{ backgroundColor: '#1A1A1A', borderColor: '#333333' }} className="w-10 h-10 rounded-full items-center justify-center border relative">
                                <View className="absolute top-2.5 right-3 w-2 h-2 bg-red-600 rounded-full z-10 border border-black" />
                                <Ionicons name="notifications-outline" size={20} color="white" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => router.push("/profile")}
                                style={{ borderColor: '#333333' }}
                                className="w-10 h-10 rounded-full overflow-hidden border bg-gray-900"
                            >
                                <Image
                                    source={{ uri: user?.photoURL || "https://i.pravatar.cc/300" }}
                                    className="w-full h-full"
                                    resizeMode="cover"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Search Bar */}
                    <TouchableOpacity
                        style={{ backgroundColor: '#1A1A1A', borderColor: '#2A2A2A' }}
                        className="flex-row items-center rounded-2xl h-[56px] px-4 border"
                        activeOpacity={0.9}
                    >
                        <Ionicons name="search-outline" size={20} color="#999999" />
                        <View className="flex-1 ml-3">
                            <Text className="text-[#666666] font-medium text-[14px]">Search equipment...</Text>
                        </View>
                        <View style={{ backgroundColor: '#B4F05F' }} className="w-9 h-9 rounded-xl items-center justify-center">
                            <Ionicons name="options" size={18} color="black" />
                        </View>
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                    <PromoCarousel />

                    {/* --- CATEGORIES --- */}
                    <View className="mb-8 mt-4">
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
                        >
                            {loadingInitial ? (
                                [1,2,3].map(i => <View key={i} className="w-24 h-12 bg-[#1A1A1A] rounded-full" />)
                            ) : (
                                categories.map((cat) => {
                                    const isActive = activeCategoryId === Number(cat.id);
                                    return (
                                        <TouchableOpacity
                                            key={cat.id}
                                            onPress={() => handleCategoryChange(Number(cat.id))}
                                            style={{
                                                backgroundColor: isActive ? '#B4F05F' : '#1A1A1A',
                                                borderColor: isActive ? '#B4F05F' : '#2A2A2A'
                                            }}
                                            className="flex-row items-center px-6 py-3.5 rounded-full border"
                                        >
                                            <Ionicons
                                                name={cat.icon as any}
                                                size={18}
                                                color={isActive ? "black" : "#999999"}
                                            />
                                            <Text className={`ml-2 text-[13px] font-bold ${isActive ? "text-black" : "text-[#999999]"}`}>
                                                {cat.name}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })
                            )}
                        </ScrollView>
                    </View>

                    {/* --- FEATURED SECTION --- */}
                    <View className="mb-8">
                        <View className="px-5 mb-5 flex-row justify-between items-end">
                            <View>
                                <Text className="text-xs text-[#B4F05F] font-bold uppercase tracking-widest mb-1">Recommended</Text>
                                <Text className="text-xl font-bold text-white">Featured Listing</Text>
                            </View>
                            <TouchableOpacity>
                                <Text className="text-[#999999] text-xs font-bold underline">View All</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            horizontal
                            data={loadingInitial ? [1, 2] : trendingItems}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingLeft: 20, paddingRight: 20 }}
                            renderItem={({ item }) =>
                                loadingInitial ? <SkeletonCard /> : (
                                    <FeaturedCard
                                        item={item}
                                        isLiked={favoriteIds.has(item.id)}
                                        onToggle={() => handleToggleFavorite(item)}
                                    />
                                )
                            }
                            snapToInterval={width - 40}
                            decelerationRate="fast"
                        />
                    </View>

                    {/* --- AVAILABLE ITEMS --- */}
                    <View className="mb-10">
                        <View className="px-5 mb-5">
                            <Text className="text-xl font-bold text-white">
                                Available {categories.find(c => Number(c.id) === activeCategoryId)?.name}
                            </Text>
                        </View>

                        {!loadingCategory && availableBrands.length > 1 && (
                            <View className="mb-6">
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}>
                                    {availableBrands.map((brand) => {
                                        const isSelected = activeBrand === brand;
                                        return (
                                            <TouchableOpacity
                                                key={brand}
                                                onPress={() => {
                                                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                                    setActiveBrand(brand);
                                                }}
                                                style={{
                                                    backgroundColor: isSelected ? 'white' : 'transparent',
                                                    borderColor: isSelected ? 'white' : '#333333'
                                                }}
                                                className="px-5 py-2.5 rounded-full border"
                                            >
                                                <Text className={`text-[12px] font-bold ${isSelected ? "text-black" : "text-[#666666]"}`}>
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
                            renderItem={({ item }) =>
                                loadingCategory ? <SkeletonCard /> : (
                                    <GearCard
                                        item={item}
                                        isLiked={favoriteIds.has(item.id)}
                                        onToggle={() => handleToggleFavorite(item)}
                                    />
                                )
                            }
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default Home;