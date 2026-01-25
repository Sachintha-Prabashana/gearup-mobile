import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const FeaturedCard = ({ item }: { item: any }) => {
    const router = useRouter();

    return (
        <TouchableOpacity
            style={{ width: width - 40 }}
            className="mr-5 mb-2 bg-white rounded-3xl shadow-sm border border-slate-100"
            activeOpacity={0.9}
            onPress={() => router.push({ pathname: "/product/[id]", params: { id: item.id } })}
        >
            {/* --- Image Section --- */}
            <View className="relative">
                <Image
                    source={{ uri: item.image }}
                    className="w-full h-[220px] rounded-t-3xl"
                    resizeMode="cover"
                />

                <View className="absolute top-4 left-4 bg-white/95 px-3 py-1.5 rounded-full flex-row items-center gap-1.5">
                    <View className="w-2 h-2 rounded-full bg-green-500" />
                    <Text className="text-[11px] font-bold text-slate-900">Available Now</Text>
                </View>

                <TouchableOpacity className="absolute top-4 right-4 w-10 h-10 bg-black/20 rounded-full items-center justify-center backdrop-blur-md border border-white/10">
                    <Ionicons name="heart-outline" size={22} color="white" />
                </TouchableOpacity>
            </View>

            <View className="p-5">
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