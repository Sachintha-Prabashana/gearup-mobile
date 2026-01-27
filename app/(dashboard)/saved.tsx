import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Platform,
    UIManager,
    LayoutAnimation
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

// Services & Hooks
import { getSavedItems, toggleFavorite } from "@/service/favoriteService";
import { useAuth } from "@/hooks/useAuth";
import { useLoader } from "@/hooks/useLoader";

// Enable Layout Animation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Saved() {
    const router = useRouter();
    const { user } = useAuth();

    const [savedItems, setSavedItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Data Fetch
    const loadFavorites = async () => {
        if (!user) {
            setLoading(false);
            return;
        }
        try {
            const data = await getSavedItems();
            setSavedItems(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadFavorites();
        }, [user])
    );

    const handleRemove = async (item: any) => {
        // 1. Trigger Animation
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

        // 2. Optimistic Update
        const prevItems = [...savedItems];
        setSavedItems(prevItems.filter(i => i.id !== item.id));

        try {
            await toggleFavorite(item);
            Toast.show({ type: 'success', text1: 'Removed', text2: 'Removed from favorites' });
        } catch (error) {
            setSavedItems(prevItems);
            Toast.show({ type: 'error', text1: 'Error', text2: 'Could not remove item.' });
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadFavorites();
        setRefreshing(false);
    };

    // --- MODERN CARD COMPONENT ---
    const renderItem = ({ item }: { item: any }) => {
        const quantity = Number(item.quantity || 0);
        const isOutOfStock = quantity === 0;

        return (
            <TouchableOpacity
                onPress={() => router.push({ pathname: "/product/[id]", params: { id: item.id } })}
                activeOpacity={0.9}
                className="bg-white p-3 mb-4 rounded-3xl border border-gray-100 shadow-sm flex-row"
            >
                {/* Left: Image */}
                <View className="relative">
                    <Image
                        source={{ uri: item.image }}
                        className={`w-32 h-32 rounded-2xl bg-gray-100 ${isOutOfStock ? 'opacity-50' : ''}`}
                        resizeMode="cover"
                    />
                    {isOutOfStock && (
                        <View className="absolute inset-0 items-center justify-center bg-black/10 rounded-2xl">
                            <View className="bg-red-500 px-2 py-1 rounded">
                                <Text className="text-white text-[10px] font-bold uppercase">Sold Out</Text>
                            </View>
                        </View>
                    )}
                </View>

                {/* Right: Details */}
                <View className="flex-1 ml-4 justify-between py-1">

                    {/* Top Section */}
                    <View>
                        <View className="flex-row justify-between items-start">
                            <View className="flex-1">
                                <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                    {item.brand || "Gear"}
                                </Text>
                                <Text className="text-base font-bold text-slate-900 leading-5 pr-2" numberOfLines={2}>
                                    {item.name}
                                </Text>
                            </View>

                            {/* Modern Delete Button */}
                            <TouchableOpacity
                                onPress={() => handleRemove(item)}
                                className="bg-red-50 p-2 rounded-full active:bg-red-100"
                            >
                                <Ionicons name="trash-outline" size={18} color="#EF4444" />
                            </TouchableOpacity>
                        </View>

                        {/* Stock Status */}
                        {!isOutOfStock && (
                            <Text className="text-[11px] text-green-600 font-bold mt-1">
                                In Stock
                            </Text>
                        )}
                    </View>

                    {/* Bottom Section */}
                    <View className="flex-row items-end justify-between mt-2">
                        <View>
                            <Text className="text-lg font-extrabold text-slate-900">
                                Rs. {item.pricePerDay?.toLocaleString()}
                            </Text>
                            <Text className="text-xs text-slate-400 font-medium">per day</Text>
                        </View>

                        {/* Rent Button */}
                        <TouchableOpacity
                            onPress={() => router.push({ pathname: "/product/[id]", params: { id: item.id } })}
                            className={`px-4 py-2 rounded-xl ${isOutOfStock ? 'bg-gray-100' : 'bg-slate-900'}`}
                            disabled={isOutOfStock}
                        >
                            <Text className={`text-xs font-bold ${isOutOfStock ? 'text-gray-400' : 'text-white'}`}>
                                {isOutOfStock ? "No Stock" : "Rent Now"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    // --- EMPTY STATE ---
    if (!loading && savedItems.length === 0) {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center px-8">
                <View className="w-24 h-24 bg-red-50 rounded-full items-center justify-center mb-6 animate-pulse">
                    <Ionicons name="heart" size={48} color="#EF4444" />
                </View>
                <Text className="text-2xl font-bold text-slate-900 mb-2 font-sans text-center">Your wishlist is empty</Text>
                <Text className="text-slate-500 text-center mb-10 font-sans leading-6">
                    Tap the heart icon on any gear you like to save it here for later.
                </Text>
                <TouchableOpacity
                    onPress={() => router.push("/(dashboard)/home")}
                    className="bg-slate-900 w-full py-4 rounded-2xl shadow-lg active:scale-95 transition-all"
                >
                    <Text className="text-white text-center font-bold font-sans text-base">Start Exploring</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top']}>

            {/* Modern Header (Big Title) */}
            <View className="px-5 pt-4 pb-2 bg-[#F8FAFC]">
                <View className="flex-row items-center justify-between mb-4">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 bg-white rounded-full items-center justify-center border border-gray-100 shadow-sm"
                    >
                        <Ionicons name="arrow-back" size={20} color="#1E293B" />
                    </TouchableOpacity>
                    {/* Clear all button placeholder (optional) */}
                    <View className="w-10" />
                </View>

                <Text className="text-3xl font-extrabold text-slate-900 font-sans tracking-tight">
                    Saved Items
                </Text>
                <Text className="text-slate-500 font-sans mt-1">
                    {savedItems.length} items collected
                </Text>
            </View>

            {/* List */}
            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#0F172A" />
                </View>
            ) : (
                <FlatList
                    data={savedItems}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                />
            )}
        </SafeAreaView>
    );
}