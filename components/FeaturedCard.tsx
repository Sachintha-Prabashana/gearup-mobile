import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';

const { width } = Dimensions.get('window');

const CARD_WIDTH = width * 0.75;

interface FeaturedCardProps {
    item: any;
    isLiked: boolean;
    onToggle: () => void;
}

const FeaturedCard = ({ item, isLiked, onToggle }: FeaturedCardProps) => {
    const router = useRouter();

    const quantity = Number(item.quantity || 0);
    const isOutOfStock = quantity === 0;
    const isLowStock = quantity > 0 && quantity < 3;

    return (
        <TouchableOpacity
            style={{ width: CARD_WIDTH, marginRight: 16 }}
            className={`rounded-[32px] p-2.5 bg-[#1A1A1A] ${isOutOfStock ? 'opacity-50' : ''}`}
            activeOpacity={0.9}
            onPress={() => router.push({ pathname: "/product/[id]", params: { id: item.id } })}
        >
            {/* --- Image Section --- */}
            <View className="relative">
                <Image
                    source={{ uri: item.image }}
                    className="h-[240px]  "
                    style={{ width: '100%', height: 240, borderRadius: 24 }}
                    contentFit="cover"
                    transition={1000}
                    placeholder="L6PZfSi_.AyE_3t7t7R**0o#DgR4" // A simple blurred placeholder
                    cachePolicy="memory-disk"
                />

                {/* SOLD OUT Overlay */}
                {isOutOfStock && (
                    <View className="absolute top-0 left-0 w-full h-full justify-center items-center bg-black/60 rounded-[32px]">
                        <View className="bg-red-600 px-6 py-2 rounded-full shadow-2xl">
                            <Text className="text-white font-black uppercase tracking-widest text-xs">Sold Out</Text>
                        </View>
                    </View>
                )}

                {/* Left Side: Status Badge */}
                <View className="absolute top-5 left-5 z-20">
                    <View className="bg-black/60 px-3 py-1.5 rounded-full flex-row items-center gap-2 border border-white/10">
                        <View className={`w-2 h-2 rounded-full ${
                            isOutOfStock ? 'bg-red-500' : isLowStock ? 'bg-orange-500' : 'bg-[#B4F05F]'
                        }`} />

                        <Text className={`text-[10px] font-bold uppercase tracking-wider ${
                            isOutOfStock ? 'text-red-400' : isLowStock ? 'text-orange-400' : 'text-[#B4F05F]'
                        }`}>
                            {isOutOfStock ? "Out of Stock" : isLowStock ? `Only ${quantity} Left` : "Available"}
                        </Text>
                    </View>
                </View>

                {/* Right Side: Heart Button */}
                <TouchableOpacity
                    onPress={onToggle}
                    className="absolute top-5 right-5 z-20 w-11 h-11 rounded-full bg-black/40 items-center justify-center border border-white/20 active:scale-90"
                >
                    <Ionicons
                        name={isLiked ? "heart" : "heart-outline"}
                        size={22}
                        color={isLiked ? "#FF3B30" : "white"}
                    />
                </TouchableOpacity>
            </View>

            {/* Bottom Content Area */}
            <View className="p-6">
                {/* 1. Title & Price Row */}
                <View className="flex-row justify-between items-start mb-1">
                    <Text className="text-2xl font-bold text-white flex-1 mr-2" numberOfLines={1}>
                        {item.name}
                    </Text>
                    <Text className="text-2xl font-bold text-[#B4F05F]">
                        Rs.{item.pricePerDay.toLocaleString()}
                    </Text>
                </View>

                {/* 2. Subtitle (Brand/Location) */}
                <View className="flex-row items-center gap-1.5 mb-5">
                    <Text className="text-sm font-semibold text-[#999999]">
                        {item.brand}
                    </Text>
                    <View className="w-1 h-1 rounded-full bg-[#333333]" />
                    <Ionicons name="location" size={14} color="#666666" />
                    <Text className="text-sm font-medium text-[#666666]">
                        Colombo Store
                    </Text>
                </View>

                {/* 3. Specs / Badges */}
                {item.specs && item.specs.length > 0 && (
                    <View className="flex-row items-center gap-3 pt-5 border-t border-white/5">
                        {item.specs.slice(0, 2).map((spec: any, index: number) => (
                            <View key={index} className="flex-row items-center gap-2 bg-[#262626] px-3 py-2 rounded-xl border border-white/5">
                                <Ionicons name={spec.icon as any} size={14} color="#B4F05F" />
                                <Text className="text-[10px] font-bold text-[#EAEAEA] uppercase tracking-wide">
                                    {spec.text}
                                </Text>
                            </View>
                        ))}

                         {/*Additional Specs Indicator*/}
                        {item.specs.length > 2 && (
                            <Text className="text-[10px] text-[#666666] font-bold ml-1">
                                +{item.specs.length - 2} more
                            </Text>
                        )}
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

export default FeaturedCard;