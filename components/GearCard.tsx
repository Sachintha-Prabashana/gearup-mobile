import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

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
            className="mr-5 w-[220px]"
            activeOpacity={0.9}
            onPress={() => router.push({ pathname: "/product/[id]", params: { id: item.id } })}
        >
            <View className="relative">
                <Image
                    source={{ uri: item.image }}
                    className={`w-full h-[280px] rounded-[24px] bg-[#1A1A1A] ${isOutOfStock ? 'opacity-40' : ''}`}
                    resizeMode="cover"
                />

                {/* Sold Out Badge */}
                {isOutOfStock && (
                    <View className="absolute top-0 left-0 w-full h-full justify-center items-center bg-black/50 rounded-[24px]">
                        <View className="bg-red-600 px-4 py-1.5 rounded-full shadow-2xl">
                            <Text className="text-white text-[10px] font-black uppercase tracking-widest">Out of Stock</Text>
                        </View>
                    </View>
                )}

                {/* Rating Badge (CamMart Style) */}
                <View className="absolute top-3 right-3 flex-row items-center gap-1 bg-black/60 px-2.5 py-1.5 rounded-xl border border-white/10">
                    <Ionicons name="star" size={10} color="#FFC107" />
                    <Text className="text-[11px] font-bold text-white">{item.rating}</Text>
                </View>

                {/* Favorite Button */}
                <TouchableOpacity
                    onPress={onToggle}
                    className="absolute top-3 left-3 w-9 h-9 rounded-full bg-black/40 items-center justify-center border border-white/10 active:scale-90"
                >
                    <Ionicons
                        name={isLiked ? "heart" : "heart-outline"}
                        size={18}
                        color={isLiked ? "#FF3B30" : "white"}
                    />
                </TouchableOpacity>

                {/* Glassmorphism Price Tag (Optional visual touch) */}
                <View className="absolute bottom-3 right-3 bg-black/60 px-3 py-1.5 rounded-xl border border-white/5">
                    <Text className="text-[#B4F05F] font-black text-xs">NEW</Text>
                </View>
            </View>

            <View className="mt-4 px-1">
                {/* Brand & Item Name */}
                <View className="mb-2">
                    <Text className="text-[10px] font-black text-[#666666] uppercase tracking-widest mb-1">
                        {item.brand}
                    </Text>
                    <Text className="text-[17px] font-bold text-white leading-tight" numberOfLines={1}>
                        {item.name}
                    </Text>
                </View>

                {/* Status / Stock Warning */}
                {!isOutOfStock && isLowStock && (
                    <Text className="text-[11px] text-orange-500 font-bold mb-2">
                        Only {item.quantity} units left!
                    </Text>
                )}

                <View className="flex-row items-center justify-between mt-1">
                    <View className="flex-row items-baseline">
                        <Text className="text-[16px] font-black text-[#B4F05F]">
                            Rs.{item.pricePerDay.toLocaleString()}
                        </Text>
                        <Text className="text-[#999999] text-xs font-bold ml-1">/day</Text>
                    </View>

                    {item.verificationRequired && (
                        <View className="bg-[#B4F05F]/10 px-2 py-1 rounded-md border border-[#B4F05F]/20">
                            <Text className="text-[9px] font-black text-[#B4F05F]">PRO</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default GearCard;