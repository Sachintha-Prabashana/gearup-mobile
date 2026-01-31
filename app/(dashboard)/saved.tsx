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
    LayoutAnimation,
    StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

// Services & Hooks
import { getSavedItems, toggleFavorite } from "@/service/favoriteService";
import { useAuth } from "@/hooks/useAuth";

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Saved() {
    const router = useRouter();
    const { user } = useAuth();

    const [savedItems, setSavedItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

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
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        const prevItems = [...savedItems];
        setSavedItems(prevItems.filter(i => i.id !== item.id));

        try {
            await toggleFavorite(item);
            Toast.show({ type: 'success', text1: 'Removed', text2: 'Item removed from wishlist' });
        } catch (error) {
            setSavedItems(prevItems);
            Toast.show({ type: 'error', text1: 'Error', text2: 'Could not update favorites.' });
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadFavorites();
        setRefreshing(false);
    };

    const renderItem = ({ item }: { item: any }) => {
        const quantity = Number(item.quantity || 0);
        const isOutOfStock = quantity === 0;

        return (
            <TouchableOpacity
                onPress={() => router.push({ pathname: "/product/[id]", params: { id: item.id } })}
                activeOpacity={0.9}
                style={{ backgroundColor: '#1A1A1A', borderColor: '#2A2A2A' }}
                className="p-4 mb-5 rounded-[28px] border flex-row items-center"
            >
                {/* Left: Image with Status Overlay */}
                <View className="relative">
                    <Image
                        source={{ uri: item.image }}
                        className={`w-24 h-24 rounded-2xl bg-black/20 ${isOutOfStock ? 'opacity-40' : ''}`}
                        resizeMode="cover"
                    />
                    {isOutOfStock && (
                        <View className="absolute inset-0 items-center justify-center bg-black/40 rounded-2xl">
                            <Text className="text-white text-[8px] font-black uppercase bg-red-600 px-1.5 py-0.5 rounded">Sold Out</Text>
                        </View>
                    )}
                </View>

                {/* Right: Product Details */}
                <View className="flex-1 ml-5 justify-between h-24">
                    <View>
                        <View className="flex-row justify-between items-start">
                            <View className="flex-1 pr-2">
                                <Text className="text-[10px] font-black text-[#666666] uppercase tracking-widest mb-1">
                                    {item.brand || "Camera Gear"}
                                </Text>
                                <Text className="text-base font-bold text-white leading-tight" numberOfLines={1}>
                                    {item.name}
                                </Text>
                            </View>

                            <TouchableOpacity
                                onPress={() => handleRemove(item)}
                                className="bg-[#2A2A2A] p-2 rounded-full"
                            >
                                <Ionicons name="trash-outline" size={16} color="#FF3B30" />
                            </TouchableOpacity>
                        </View>

                        <Text style={{ color: isOutOfStock ? '#666666' : '#B4F05F' }} className="text-[10px] font-black uppercase mt-1">
                            {isOutOfStock ? "Out of Stock" : "In Stock • Ready to ship"}
                        </Text>
                    </View>

                    <View className="flex-row items-end justify-between">
                        <View className="flex-row items-baseline">
                            <Text className="text-lg font-black text-[#B4F05F]">
                                Rs.{item.pricePerDay?.toLocaleString()}
                            </Text>
                            <Text className="text-[#999999] text-[10px] font-bold ml-1">/day</Text>
                        </View>

                        <TouchableOpacity
                            onPress={() => router.push({ pathname: "/product/[id]", params: { id: item.id } })}
                            style={{ backgroundColor: isOutOfStock ? '#333333' : '#B4F05F' }}
                            className="px-4 py-2 rounded-xl"
                            disabled={isOutOfStock}
                        >
                            <Text style={{ color: isOutOfStock ? '#999999' : '#000000' }} className="text-[11px] font-black uppercase">
                                Rent
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    if (!loading && savedItems.length === 0) {
        return (
            <View style={{ flex: 1, backgroundColor: '#000000' }}>
                <StatusBar style="light" />
                <SafeAreaView className="flex-1 items-center justify-center px-10">
                    <View className="w-24 h-24 bg-[#1A1A1A] rounded-full items-center justify-center mb-8 border border-[#2A2A2A]">
                        <Ionicons name="heart-dislike-outline" size={40} color="#333333" />
                    </View>
                    <Text className="text-2xl font-bold text-white mb-3 text-center">Empty Wishlist</Text>
                    <Text className="text-[#999999] text-center mb-12 leading-6">
                        Save your favorite high-end gear here to rent them later.
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.push("/(dashboard)/home")}
                        style={{ backgroundColor: '#B4F05F' }}
                        className="w-full py-5 rounded-2xl active:scale-95"
                    >
                        <Text className="text-black text-center font-black uppercase tracking-widest">Discover Gear</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#000000' }}>
            <StatusBar style="light" />
            <LinearGradient colors={['#121212', '#000000']} style={StyleSheet.absoluteFillObject} />

            <SafeAreaView className="flex-1" edges={['top']}>
                {/* Header */}
                <View className="px-6 pt-5 pb-6">
                    <View className="flex-row items-center justify-between mb-6">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="w-10 h-10 bg-[#1A1A1A] rounded-full items-center justify-center border border-[#2A2A2A]"
                        >
                            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    <Text className="text-4xl font-black text-white tracking-tighter">Saved Items</Text>
                    <Text className="text-[#B4F05F] font-bold text-xs uppercase tracking-widest mt-2">
                        {savedItems.length} Products in Wishlist
                    </Text>
                </View>

                {/* List */}
                {loading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#B4F05F" />
                    </View>
                ) : (
                    <FlatList
                        data={savedItems}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
                        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
                        showsVerticalScrollIndicator={false}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#B4F05F" />}
                    />
                )}
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    // Keep internal styles empty if using NativeWind for everything else
});