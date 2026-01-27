import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

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
            style={{ width: width - 40, marginRight: 20 }}
            className={`w-full rounded-3xl bg-gray-200 ${isOutOfStock ? 'opacity-60' : ''}`}
            activeOpacity={0.9}
            onPress={() => router.push({ pathname: "/product/[id]", params: { id: item.id } })}
        >
            {/* --- Image Section --- */}
            <View className="relative">
                <Image
                    source={{ uri: item.image }}
                    className="w-full h-[220px] rounded-3xl bg-gray-100"
                    resizeMode="cover"
                />

                {/*  SOLD OUT Overlay */}
                {isOutOfStock && (
                    <View className="absolute top-0 left-0 w-full h-full justify-center items-center bg-black/10 rounded-t-3xl">
                        <View className="bg-red-500 px-5 py-2 rounded-full shadow-lg transform scale-110">
                            <Text className="text-white font-bold uppercase tracking-widest text-sm">Sold Out</Text>
                        </View>
                    </View>
                )}

                {/*  Left Side: Status Badge (Available / Low Stock) */}
                <View className="absolute top-4 left-4 z-20">
                    <View className="bg-white/95 px-3 py-1.5 rounded-full flex-row items-center gap-1.5 shadow-sm backdrop-blur-md">
                        <View className={`w-2 h-2 rounded-full ${
                            isOutOfStock ? 'bg-red-500' : isLowStock ? 'bg-orange-500' : 'bg-green-500'
                        }`} />

                        <Text className={`text-[10px] font-bold uppercase tracking-wide ${
                            isOutOfStock ? 'text-red-600' : isLowStock ? 'text-orange-600' : 'text-slate-900'
                        }`}>
                            {isOutOfStock ? "Sold Out" : isLowStock ? `Only ${quantity} Left` : "Available Now"}
                        </Text>
                    </View>
                </View>

                {/*  Right Side: Heart Button (Glass Effect) */}
                <TouchableOpacity
                    onPress={onToggle}
                    className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/20 items-center justify-center backdrop-blur-md border border-white/20 active:scale-90 transition-all shadow-sm"
                >
                    <Ionicons
                        name={isLiked ? "heart" : "heart-outline"}
                        size={20}
                        color={isLiked ? "#EF4444" : "white"}
                    />
                </TouchableOpacity>

                {/* Bottom Gradient (Optional: Makes text readable if overlaying) */}
                {/* <View className="absolute bottom-0 w-full h-10 bg-gradient-to-t from-black/10 to-transparent" /> */}
            </View>

            {/* Bottom Content Area */}
            <View className="p-5 bg-white rounded-b-3xl border-x border-b border-gray-100 shadow-sm">
                {/* 1. Title & Price Row */}
                <View className="flex-row justify-between items-start mb-2">
                    <Text className="text-xl font-bold text-slate-900 flex-1 mr-2" numberOfLines={1}>
                        {item.name}
                    </Text>
                    <Text className="text-xl font-bold text-slate-900">
                        Rs. {item.pricePerDay.toLocaleString()}
                    </Text>
                </View>

                {/* 2. Subtitle (Location/Brand) */}
                <View className="flex-row items-center gap-1.5 mb-4">
                    <Ionicons name="location-outline" size={16} color="#64748B" />
                    <Text className="text-sm font-medium text-slate-500">
                        {item.brand} • Colombo Store
                    </Text>
                </View>

                {item.specs && item.specs.length > 0 && (
                    <View className="flex-row items-center justify-between pt-4 border-t border-slate-100">
                        {item.specs.map((spec: any, index: number) => (
                            <View key={index} className="flex-row items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg">
                                <Ionicons name={spec.icon as any} size={16} color="#475569" />
                                <Text className="text-xs font-bold text-slate-700">{spec.text}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

export default FeaturedCard;