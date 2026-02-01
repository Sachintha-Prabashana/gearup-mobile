import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {getTopReviews} from "@/service/ratingService";

// const REVIEWS = [
//     { id: 1, name: "Kasun P.", date: "Oct 2023", text: "Best camera I've rented! The equipment was well-maintained and the host was super helpful.", img: "https://randomuser.me/api/portraits/men/32.jpg" },
//     { id: 2, name: "Amaya D.", date: "Sep 2023", text: "Gear was in mint condition. The lens was crystal clear. Highly recommended for pros.", img: "https://randomuser.me/api/portraits/women/44.jpg" },
//     { id: 3, name: "Sahan K.", date: "Aug 2023", text: "Great value for money. Seamless pickup and return. Will definitely rent again.", img: "https://randomuser.me/api/portraits/men/85.jpg" },
// ];

// --- TYPES ---
interface ReviewData {
    id: string;
    userName: string;
    userAvatar: string;
    comment: string;
    createdAt: any;
    rating: number;
}

interface ReviewsSectionProps {
    itemId: string; // ID of the product to fetch reviews for
    rating: number;
    count: number;
}

const ReviewsSection = ({ itemId, rating, count }: ReviewsSectionProps) => {

    const [reviews, setReviews] = useState<ReviewData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadReviews = async () => {
            if (!itemId) {
                setLoading(false);
                return;
            }
            setLoading(true);

            // Service Call
            const data = await getTopReviews(itemId);

            setReviews(data);
            setLoading(false);
        };

        loadReviews();
    }, [itemId]);

    // Date Format Helper
    const formatDate = (timestamp: any) => {
        if (!timestamp) return "Recent";
        try {
            const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
            return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        } catch (e) {
            return "Recent";
        }
    };

    if (loading) {
        return (
            <View style={styles.container} className="h-40 items-center justify-center">
                <ActivityIndicator color="#B4F05F" />
            </View>
        );
    }

    console.log("Fetched Reviews:", JSON.stringify(reviews, null, 2));

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

                {reviews.length > 0 && (
                    <TouchableOpacity
                        style={{ backgroundColor: '#1A1A1A' }}
                        className="w-10 h-10 rounded-full items-center justify-center border border-white/5"
                    >
                        <Ionicons name="chevron-forward" size={20} color="white" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Content */}
            {reviews.length > 0 ? (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 16, paddingRight: 20 }}
                >
                    {reviews.map((review) => (
                        <View
                            key={review.id}
                            style={{ backgroundColor: '#1A1A1A', borderColor: '#2A2A2A' }}
                            className="w-72 border p-5 rounded-[28px]"
                        >
                            {/* User Info */}
                            <View className="flex-row items-center gap-3 mb-4">
                                <Image
                                    source={{
                                        uri: review.userAvatar || `https://ui-avatars.com/api/?name=${review.userName}&background=random`
                                    }}
                                    className="w-10 h-10 rounded-full bg-black border border-white/10"
                                />
                                <View>
                                    <Text className="font-bold text-[15px] text-white">
                                        {review.userName}
                                    </Text>
                                    <Text className="text-xs text-[#666666] font-black uppercase tracking-widest">
                                        {formatDate(review.createdAt)}
                                    </Text>
                                </View>
                            </View>

                            {/* Review Text */}
                            <Text className="text-[#999999] text-sm leading-6 font-medium" numberOfLines={3}>
                                "{review.comment}"
                            </Text>

                            {/* Stars Display */}
                            <View className="mt-4 flex-row items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Ionicons
                                        key={i}
                                        name={i < review.rating ? "star" : "star-outline"}
                                        size={12}
                                        color="#B4F05F"
                                    />
                                ))}
                            </View>
                        </View>
                    ))}
                </ScrollView>
            ) : (
                // Empty State
                <View
                    style={{ backgroundColor: '#1A1A1A', borderColor: '#2A2A2A' }}
                    className="p-8 rounded-[28px] border items-center justify-center"
                >
                    <Ionicons name="chatbox-ellipses-outline" size={32} color="#333333" />
                    <Text className="text-white font-bold mt-2">No reviews yet</Text>
                    <Text className="text-[#666666] text-xs text-center mt-1">
                        Be the first to rent and rate this gear!
                    </Text>
                </View>
            )}
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