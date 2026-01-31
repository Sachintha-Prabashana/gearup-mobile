import React from 'react';
import {View, Text, TouchableOpacity, Dimensions, ViewStyle} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';

const { width } = Dimensions.get('window');

//  Industry Standard:
const CARD_WIDTH = width * 0.60;
const CARD_HEIGHT = 260;

interface GearCardProps {
    item: any;
    isLiked: boolean;
    onToggle: () => void;
}

const GearCard = ({ item, isLiked, onToggle }: GearCardProps) => {
    const router = useRouter();
    const quantity = Number(item.quantity || 0);

    const isOutOfStock = quantity === 0;
    const isLowStock = quantity > 0 && quantity < 3;

    return (
        <TouchableOpacity
            style={{ width: CARD_WIDTH, marginRight: 16 }}
            activeOpacity={0.8}
            // className={"bg-[#1A1A1A] rounded-[24px] p-3 border border-white/5"}
            onPress={() => router.push({ pathname: "/product/[id]", params: { id: item.id } })}
        >
            {/* --- Image Container --- */}
            <View className="relative w-full mb-3">
                <Image
                    source={{ uri: item.image }}
                    className="bg-[#1A1A1A]"
                    style={{ width: '100%', height: CARD_HEIGHT, borderRadius: 24 }}
                    contentFit="cover"
                    transition={800}
                    placeholder="L6PZfSi_.AyE_3t7t7R**0o#DgR4"
                    cachePolicy="memory-disk"
                />

                {/* Overlays Wrapper (Gradient or dimming optional here) */}

                {/* 1. Status Badges (Top Left) */}
                <View className="absolute top-3 left-3 flex-col gap-1.5 items-start">
                    {/* Rating Badge */}
                    <View className="flex-row items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/5">
                        <Ionicons name="star" size={10} color="#FFC107" />
                        <Text className="text-[10px] font-bold text-white">{item.rating || "5.0"}</Text>
                    </View>

                    {/* Low Stock Warning */}
                    {!isOutOfStock && isLowStock && (
                        <View className="bg-orange-500/90 px-2 py-1 rounded-lg">
                            <Text className="text-[9px] font-bold text-white uppercase">Only {quantity} Left</Text>
                        </View>
                    )}
                </View>

                {/* 2. Heart Button (Top Right - Standard UX) */}
                <TouchableOpacity
                    onPress={onToggle}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md items-center justify-center border border-white/10 active:scale-95"
                >
                    <Ionicons
                        name={isLiked ? "heart" : "heart-outline"}
                        size={16}
                        color={isLiked ? "#FF3B30" : "white"}
                    />
                </TouchableOpacity>

                {/* 3. Sold Out Overlay */}
                {isOutOfStock && (
                    <View className="absolute inset-0 bg-black/60 rounded-[24px] items-center justify-center z-10">
                        <View className="bg-red-600 px-3 py-1.5 rounded-full">
                            <Text className="text-white text-[10px] font-black uppercase tracking-widest">Sold Out</Text>
                        </View>
                    </View>
                )}
            </View>

            {/* --- Product Info Section --- */}
            <View className="px-1">
                {/* Brand Name */}
                <Text className="text-[10px] font-bold text-[#666666] uppercase tracking-wider mb-0.5">
                    {item.brand}
                </Text>

                {/* Product Name (Lines restricted to 1 or 2) */}
                <Text
                    className="text-[15px] font-bold text-white leading-tight mb-2"
                    numberOfLines={1}
                >
                    {item.name}
                </Text>

                {/* Price & Pro Badge Row */}
                <View className="flex-row items-center justify-between">
                    <View>
                        <Text className="text-[#B4F05F] font-bold text-[15px]">
                            Rs.{item.pricePerDay.toLocaleString()}
                            <Text className="text-[#666666] text-[10px] font-medium"> /day</Text>
                        </Text>
                    </View>

                    {item.verificationRequired && (
                        <View className="border border-[#B4F05F]/30 rounded px-1.5 py-0.5">
                            <Text className="text-[9px] font-bold text-[#B4F05F]">PRO</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default GearCard;