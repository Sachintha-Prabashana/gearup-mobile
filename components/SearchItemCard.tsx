import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface SearchItemProps {
    item: any;
}

const SearchItemCard = ({ item }: SearchItemProps) => {
    const router = useRouter();
    const isOutOfStock = Number(item.quantity || 0) === 0;

    return (
        <TouchableOpacity
            onPress={() => router.push({ pathname: "/product/[id]", params: { id: item.id } })}
            activeOpacity={0.7}
            className="flex-row bg-[#1A1A1A] mb-3 rounded-2xl overflow-hidden border border-white/5 p-2"
        >
            {/* --- Left Side: Image (Square) --- */}
            <View className="w-[100px] h-[100px] bg-[#2A2A2A] rounded-xl relative">
                <Image
                    source={{ uri: item.image }}
                    style={{ width: '100%', height: '100%', borderRadius: 12 }}
                    contentFit="cover"
                    transition={500}
                />

                {/* Sold Out Overlay  */}
                {isOutOfStock && (
                    <View className="absolute inset-0 bg-black/60 items-center justify-center rounded-xl">
                        <Text className="text-white text-[10px] font-bold uppercase">Sold Out</Text>
                    </View>
                )}
            </View>

            {/* --- Right Side: Details --- */}
            <View className="flex-1 ml-3 justify-between py-1">
                <View>
                    {/* Brand & Rating Row */}
                    <View className="flex-row justify-between items-center mb-1">
                        <Text className="text-[10px] font-bold text-[#888888] uppercase tracking-wider">
                            {item.brand}
                        </Text>
                        <View className="flex-row items-center gap-1">
                            <Ionicons name="star" size={10} color="#FFC107" />
                            <Text className="text-[10px] text-white font-bold">{item.rating || "5.0"}</Text>
                        </View>
                    </View>

                    {/* Title */}
                    <Text className="text-white font-semibold text-[15px] leading-tight" numberOfLines={2}>
                        {item.name}
                    </Text>
                </View>

                {/* Price Section */}
                <View>
                    <Text className="text-[#B4F05F] font-bold text-lg">
                        Rs.{item.pricePerDay.toLocaleString()}
                        <Text className="text-[#666666] text-xs font-medium"> /day</Text>
                    </Text>

                    {/* Optional: Available Status */}
                    {!isOutOfStock && (
                        <Text className="text-[10px] text-[#666666]">Available Now</Text>
                    )}
                </View>
            </View>

            {/* Arrow Icon (Optional - දකුණු කෙළවරේ) */}
            <View className="justify-center pr-2">
                <Ionicons name="chevron-forward" size={18} color="#333333" />
            </View>
        </TouchableOpacity>
    );
};

export default SearchItemCard;