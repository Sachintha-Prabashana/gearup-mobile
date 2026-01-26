import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions,
    FlatList,
    StatusBar,
    Platform
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import Data (Service)
import { gearItems } from "@/constants/gearData";
import ReviewsSection from "@/components/Product/ReviewSection";
import LocationSection from "@/components/Product/LocationSection";
import DateSelectModal from "@/components/Product/DateSelectModal"; // නැත්නම් DB service එක import කරන්න

// Import Custom Components


const { width } = Dimensions.get('window');

export default function ProductDetails() {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    // Find Item

    const item = gearItems.find(g => g.id === parseInt(id as string));

    // State
    const [activeSlide, setActiveSlide] = useState(0);
    const [isCalendarOpen, setCalendarOpen] = useState(false);
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);

    if (!item) return <View className="flex-1 bg-white items-center justify-center"><Text>Item not found</Text></View>;

    // Image Slider Handler
    const onScroll = (event: any) => {
        const slideSize = event.nativeEvent.layoutMeasurement.width;
        const index = event.nativeEvent.contentOffset.x / slideSize;
        setActiveSlide(Math.round(index));
    };

    const calculateNights = (start: string, end:string) => {
        if (!start || !end) return 0;
        const d1 = new Date(start);
        const d2 = new Date(end);
        const diffTime = Math.abs(d2.getTime() - d1.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    }

    const nights = (startDate && endDate) ? calculateNights(startDate, endDate) : 0;
    const totalPrice = nights * item.pricePerDay;

    const handleReserve = () => {
        if (!startDate || !endDate) {
            setCalendarOpen(true);
            return;
        }

        // --- MOCK LOGIC  ---
        const isUserVerified = false;

        if (!isUserVerified) {

            router.push({
                pathname: "/verification/id-upload",
                params: {
                    itemId: item.id,
                    startDate: startDate,
                    endDate: endDate,
                    pricePerDay: item.pricePerDay,
                    image: item.image,
                    name: item.name
                }
            });

        } else {
            console.log("Proceed to Checkout", { startDate, endDate, item });
        }
    }

    return (
        <View className="flex-1 bg-white">
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

                {/* --- A. HERO IMAGE SLIDER --- */}
                <View className="relative">
                    <FlatList
                        data={item.gallery && item.gallery.length > 0 ? item.gallery : [item.image]}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={onScroll}
                        renderItem={({ item: imageUrl }) => (
                            <Image
                                source={{ uri: imageUrl }}
                                style={{ width: width, height: 350 }}
                                resizeMode="cover"
                            />
                        )}
                        keyExtractor={(_, index) => index.toString()}
                    />

                    {/* Navigation Buttons */}
                    <View className="absolute top-12 left-5 right-5 flex-row justify-between items-center z-10">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-md active:scale-95 transition-all"
                        >
                            <Ionicons name="chevron-back" size={22} color="black" />
                        </TouchableOpacity>

                        <View className="flex-row gap-3">
                            <TouchableOpacity className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-md active:scale-95">
                                <Ionicons name="share-outline" size={20} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-md active:scale-95">
                                <Ionicons name="heart-outline" size={20} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Page Counter */}
                    <View className="absolute bottom-5 right-5 bg-black/70 px-3 py-1.5 rounded-lg backdrop-blur-md">
                        <Text className="text-white text-xs font-bold font-sans">
                            {activeSlide + 1} / {item.gallery ? item.gallery.length : 1}
                        </Text>
                    </View>
                </View>

                {/* --- B. MAIN CONTENT --- */}
                <View className="px-5 pt-6">

                    {/* Header Info */}
                    <Text className="text-2xl font-bold text-slate-900 leading-8 mb-2 font-sans">
                        {item.name}
                    </Text>
                    <View className="flex-row items-center gap-1 mb-6">
                        <Ionicons name="star" size={14} color="#1A1A1A" />
                        <Text className="text-sm font-bold text-slate-900 font-sans">{item.rating} · </Text>
                        <Text className="text-sm font-bold underline text-slate-900 font-sans">{item.reviewCount} reviews</Text>
                        <Text className="text-sm text-slate-500 font-sans"> · Colombo, Sri Lanka</Text>
                    </View>

                    <View className="h-[1px] bg-gray-100 w-full mb-6" />

                    {/* Host Info */}
                    <View className="flex-row items-center justify-between mb-6">
                        <View>
                            <Text className="text-base font-bold text-slate-900 font-sans">Hosted by GearUp</Text>
                            <Text className="text-slate-500 text-sm font-sans">Verified Owner · 3 years hosting</Text>
                        </View>
                        <Image
                            source={{ uri: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100" }}
                            className="w-14 h-14 rounded-full border border-gray-200"
                        />
                    </View>

                    <View className="h-[1px] bg-gray-100 w-full mb-6" />

                    {/* Description */}
                    <View className="mb-6">
                        <Text className="text-[15px] leading-6 text-slate-700 font-sans">
                            {item.description}
                        </Text>
                        <TouchableOpacity className="mt-2 flex-row items-center">
                            <Text className="font-bold underline text-slate-900 font-sans mr-1">Show more</Text>
                            <Ionicons name="chevron-forward" size={14} color="black"/>
                        </TouchableOpacity>
                    </View>

                    <View className="h-[1px] bg-gray-100 w-full mb-6" />

                    {/* Features / Included Items */}
                    <View className="mb-6">
                        <Text className="text-lg font-bold text-slate-900 font-sans mb-4">What's included</Text>
                        {item.features && item.features.map((feature: string, index: number) => (
                            <View key={index} className="flex-row items-start mb-4">
                                <Ionicons name="checkmark-circle-outline" size={22} color="#475569" style={{ marginTop: 1 }} />
                                <Text className="ml-3 text-slate-700 text-[15px] flex-1 font-sans">{feature}</Text>
                            </View>
                        ))}
                    </View>

                    <View className="h-[1px] bg-gray-100 w-full mb-6" />

                    {/* --- C. NEW MODULAR COMPONENTS --- */}

                    {/* Date Picker Trigger (UI Only) */}
                    <View className={"mb-8 p-4 bg-gray-50 rounded-2xl border border-b-gray-100"}>
                        <Text className="text-lg font-bold text-slate-900 font-sans mb-1">
                            {startDate && endDate
                                ? `${calculateNights(startDate, endDate)} nights in Colombo`
                                : "Add dates for prices"}
                        </Text>

                        <Text className="text-slate-500 font-sans text-sm mb-4">
                            {startDate && endDate
                                ? `${startDate} - ${endDate}`
                                : "Check availability to see total price"}
                        </Text>

                        <TouchableOpacity
                            onPress={() => setCalendarOpen(true)}
                            className="w-full border-t border-gray-200 pt-3 flex-row justify-between items-center"
                        >
                            <Text className="font-bold text-slate-900 font-sans">
                                {startDate && endDate ? "Change dates" : "Select dates"}
                            </Text>
                            <Ionicons name="calendar-outline" size={20} color="black"/>
                        </TouchableOpacity>

                    </View>

                    <ReviewsSection rating={item.rating} count={item.reviewCount} />

                    <LocationSection />

                    {/* Bottom Padding for Footer */}
                    <View className="h-10"/>

                </View>
            </ScrollView>

            {/* --- CHANGE 3: Footer Logic */}
            <View
                className="absolute bottom-0 w-full bg-white border-t border-gray-100 px-5 pt-4 pb-8 flex-row items-center justify-between z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]"
                style={{ paddingBottom: Platform.OS === 'ios' ? 30 : 20 }}
            >
                <View>
                    {startDate && endDate ? (
                        <View>
                            <Text className="text-lg font-bold text-slate-900 font-sans">
                                Rs. {totalPrice.toLocaleString()}
                            </Text>
                            <Text className="text-slate-500 text-xs font-sans font-medium underline mt-0.5">
                                Rs. {item.pricePerDay.toLocaleString()} x {nights} nights
                            </Text>
                        </View>
                    ) : (
                        <View>
                            <View className="flex-row items-end">
                                <Text className="text-lg font-bold text-slate-900 font-sans">
                                    Rs. {item.pricePerDay.toLocaleString()}
                                </Text>
                                <Text className="text-slate-500 text-sm mb-0.5 font-sans font-medium"> / night</Text>
                            </View>
                            <TouchableOpacity onPress={() => setCalendarOpen(true)}>
                                <Text className="text-xs text-slate-500 underline font-bold font-sans mt-0.5">
                                    Add dates
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                <TouchableOpacity
                    className={`px-8 py-3.5 rounded-xl shadow-md active:opacity-90 ${startDate && endDate ? 'bg-[#FF385C]' : 'bg-slate-900'}`}
                    activeOpacity={0.8}
                    onPress={handleReserve}
                >
                    <Text className="text-white font-bold text-base font-sans">
                        {startDate && endDate ? "Reserve" : "Check availability"}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* --- CHANGE 4: Modal Data Handling */}
            <DateSelectModal
                isVisible={isCalendarOpen}
                onClose={() => setCalendarOpen(false)}
                onSave={(start, end) => {
                    setStartDate(start);
                    setEndDate(end);
                }}
            />

        </View>
    );
}