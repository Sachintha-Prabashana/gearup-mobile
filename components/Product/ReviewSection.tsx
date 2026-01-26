import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const REVIEWS = [
    { id: 1, name: "Kasun P.", date: "Oct 2023", text: "Best camera I've rented! The host was super helpful.", img: "https://randomuser.me/api/portraits/men/32.jpg" },
    { id: 2, name: "Amaya D.", date: "Sep 2023", text: "Gear was in mint condition. Highly recommended.", img: "https://randomuser.me/api/portraits/women/44.jpg" },
    { id: 3, name: "Sahan K.", date: "Aug 2023", text: "Great value for money. Will rent again.", img: "https://randomuser.me/api/portraits/men/85.jpg" },
];

const ReviewsSection = ({ rating, count }: { rating: number, count: number }) => {
    return (
        <View className="mb-8">
            <View className="flex-row justify-between items-center mb-4">
                <View className="flex-row items-center gap-1.5">
                    <Ionicons name="star" size={18} color="#1A1A1A" />
                    <Text className="text-xl font-bold text-slate-900 font-sans">
                        {rating} · {count} Reviews
                    </Text>
                </View>
                <TouchableOpacity>
                    <Ionicons name="chevron-forward" size={24} color="#1A1A1A" />
                </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
                {REVIEWS.map((review) => (
                    <View key={review.id} className="w-72 border border-gray-200 p-4 rounded-2xl bg-white">
                        <View className="flex-row items-center gap-3 mb-3">
                            <Image source={{uri: review.img}} className="w-10 h-10 rounded-full"/>
                            <View>
                                <Text className="font-bold text-sm font-sans text-slate-900">{review.name}</Text>
                                <Text className="text-xs text-slate-500 font-sans">{review.date}</Text>
                            </View>
                        </View>
                        <Text className="text-slate-600 text-sm font-sans leading-5" numberOfLines={3}>
                            {review.text}
                        </Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

export default ReviewsSection;