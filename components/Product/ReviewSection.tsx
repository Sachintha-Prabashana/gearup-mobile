import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const REVIEWS = [
    { id: 1, name: "Kasun P.", date: "Oct 2023", text: "Best camera I've rented! The equipment was well-maintained and the host was super helpful.", img: "https://randomuser.me/api/portraits/men/32.jpg" },
    { id: 2, name: "Amaya D.", date: "Sep 2023", text: "Gear was in mint condition. The lens was crystal clear. Highly recommended for pros.", img: "https://randomuser.me/api/portraits/women/44.jpg" },
    { id: 3, name: "Sahan K.", date: "Aug 2023", text: "Great value for money. Seamless pickup and return. Will definitely rent again.", img: "https://randomuser.me/api/portraits/men/85.jpg" },
];

const ReviewsSection = ({ rating, count }: { rating: number, count: number }) => {
    return (
        <View style={styles.container}>
            {/* Header Row */}
            <View className="flex-row justify-between items-center mb-6">
                <View className="flex-row items-center gap-2">
                    <Ionicons name="star" size={20} color="#B4F05F" />
                    <Text className="text-xl font-black text-white tracking-tight">
                        {rating} <Text className="text-[#666666] font-bold">·</Text> {count} Reviews
                    </Text>
                </View>
                <TouchableOpacity
                    style={{ backgroundColor: '#1A1A1A' }}
                    className="w-10 h-10 rounded-full items-center justify-center border border-white/5"
                >
                    <Ionicons name="chevron-forward" size={20} color="white" />
                </TouchableOpacity>
            </View>

            {/* Horizontal Review Cards */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 16, paddingRight: 20 }}
            >
                {REVIEWS.map((review) => (
                    <View
                        key={review.id}
                        style={{ backgroundColor: '#1A1A1A', borderColor: '#2A2A2A' }}
                        className="w-72 border p-5 rounded-[28px]"
                    >
                        {/* User Info */}
                        <View className="flex-row items-center gap-3 mb-4">
                            <Image
                                source={{ uri: review.img }}
                                className="w-10 h-10 rounded-full bg-black border border-white/10"
                            />
                            <View>
                                <Text className="font-bold text-[15px] text-white">
                                    {review.name}
                                </Text>
                                <Text className="text-xs text-[#666666] font-black uppercase tracking-widest">
                                    {review.date}
                                </Text>
                            </View>
                        </View>

                        {/* Review Text */}
                        <Text className="text-[#999999] text-sm leading-6 font-medium" numberOfLines={3}>
                            "{review.text}"
                        </Text>

                        {/* Verified Badge (Subtle touch) */}
                        <View className="mt-4 flex-row items-center gap-1.5">
                            <Ionicons name="shield-checkmark" size={12} color="#B4F05F" />
                            <Text className="text-[10px] font-black text-[#B4F05F] uppercase tracking-widest">
                                Verified Rent
                            </Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 32,
        marginTop: 10,
    }
});

export default ReviewsSection;