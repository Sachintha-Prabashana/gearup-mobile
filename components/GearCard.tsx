import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const GearCard = ({ item }: { item: any }) => {
    const router = useRouter();
    const quantity = Number(item.quantity || 0);
    const isOutOfStock = quantity === 0;
    const isLowStock = quantity > 0 && quantity < 3;

    return (
        <TouchableOpacity
            className="mr-4 w-[240px]"
            activeOpacity={0.9}
            onPress={() => router.push({ pathname: "/product/[id]", params: { id: item.id } })}
        >
            <View className="relative shadow-sm shadow-black/5">
                <Image
                    source={{ uri: item.image }}
                    className={`w-full h-[300px] rounded-2xl bg-gray-200 ${isOutOfStock ? 'opacity-60' : ''}`}
                    resizeMode="cover"
                />

                {/* Sold Out Badge */}
                {isOutOfStock && (
                    <View className="absolute top-0 left-0 w-full h-full justify-center items-center bg-black/30 rounded-2xl">
                        <View className="bg-red-500 px-4 py-1.5 rounded-full shadow-lg">
                            <Text className="text-white text-xs font-bold uppercase tracking-wide">Sold Out</Text>
                        </View>
                    </View>
                )}

                {/* Floating Gradient Overlay */}
                <View className="absolute bottom-0 w-full h-20 rounded-b-2xl bg-black/5" />

                {/* Rating Badge */}
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
                        {/* Brand Name */}
                        <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                            {item.brand}
                        </Text>
                        {/* Item Name */}
                        <Text className="text-[16px] font-bold text-slate-900 leading-tight" numberOfLines={1}>
                            {item.name}
                        </Text>
                    </View>
                </View>

                {/*  Low Stock Warning  */}
                {!isOutOfStock && isLowStock && (
                    <Text className="text-[10px] text-orange-600 font-bold mt-1">
                        Only {quantity} left! 🔥
                    </Text>
                )}

                <View className="flex-row items-center mt-2 justify-between">
                    <View className="flex-row items-baseline">
                        {/* Price - Using ExtraBold */}
                        <Text className="text-[15px] font-extrabold text-slate-900">
                            Rs. {item.pricePerDay.toLocaleString()}
                        </Text>
                        {/* Duration - Using Medium */}
                        <Text className="text-slate-400 text-xs font-medium ml-1">/day</Text>
                    </View>
                    {item.verificationRequired && (
                        <View className="bg-green-50 px-1.5 py-0.5 rounded border border-green-100">
                            {/* Verified Tag */}
                            <Text className="text-[9px] font-bold text-green-700">VERIFIED</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default GearCard;