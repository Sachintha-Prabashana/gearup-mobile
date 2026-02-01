import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions,
    FlatList,
    StatusBar,
    Platform,
    StyleSheet
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Import Services & Components
import ReviewsSection from "@/components/Product/ReviewSection";
import LocationSection from "@/components/Product/LocationSection";
import DateSelectModal from "@/components/Product/DateSelectModal";
import { getGearById } from "@/service/gearService";
import { useAuth } from "@/hooks/useAuth";
import { useLoader } from "@/hooks/useLoader";
import { checkUserVerification } from "@/service/authService";
import { checkIsFavorite, toggleFavorite } from "@/service/favoriteService";
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');

export default function ProductDetails() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { user } = useAuth();
    const { showLoader, hideLoader } = useLoader();

    // State
    const [item, setItem] = useState<any>(null);
    const [activeSlide, setActiveSlide] = useState(0);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [isCalendarOpen, setCalendarOpen] = useState(false);
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                try {
                    showLoader();
                    const data = await getGearById(id as string);
                    if (data) {
                        setItem(data);
                        if (user) {
                            const isFav = await checkIsFavorite(id as string);
                            setIsLiked(isFav);
                        }
                        setDataLoaded(true);
                    } else {
                        Toast.show({ type: 'error', text1: 'Item Not Found' });
                        router.back();
                    }
                } catch (error) {
                    console.error(error);
                } finally {
                    hideLoader();
                }
            }
        };
        fetchData();
    }, [id, user]);

    const handleToggleFavorite = async () => {
        if (!user) {
            Toast.show({ type: 'error', text1: 'Login Required', position: 'bottom' });
            return;
        }
        const previousState = isLiked;
        setIsLiked(!isLiked);
        try {
            await toggleFavorite(item);
        } catch (error) {
            setIsLiked(previousState);
            Toast.show({ type: 'error', text1: 'Error', text2: 'Update failed' });
        }
    };

    if (!dataLoaded || !item) {
        return <View style={{ flex: 1, backgroundColor: '#000000' }} />;
    }

    const onScroll = (event: any) => {
        const slideSize = event.nativeEvent.layoutMeasurement.width;
        const index = event.nativeEvent.contentOffset.x / slideSize;
        setActiveSlide(Math.round(index));
    };

    const calculateNights = (start: string, end: string) => {
        if (!start || !end) return 0;
        const d1 = new Date(start);
        const d2 = new Date(end);
        return Math.ceil(Math.abs(d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    };

    const quantity = Number(item.quantity || 0);
    const isOutOfStock = quantity === 0;
    const nights = (startDate && endDate) ? calculateNights(startDate, endDate) : 0;
    const totalPrice = nights * item.pricePerDay;

    const handleReserve = async () => {
        if (isOutOfStock) return;
        if (!startDate || !endDate) {
            setCalendarOpen(true);
            return;
        }
        if (!user) {
            router.push("/login");
            return;
        }

        try {
            showLoader();
            const isVerified = await checkUserVerification(user.uid);
            const bookingParams = {
                itemId: item.id,
                startDate: startDate,
                endDate: endDate,
                pricePerDay: item.pricePerDay,
                image: item.image,
                name: item.name
            };
            hideLoader();

            if (isVerified) {
                router.push({ pathname: "/checkout", params: bookingParams });
            } else {
                Toast.show({ type: 'info', text1: 'Verification Needed' });
                setTimeout(() => {
                    router.push({ pathname: "/verification/id-upload", params: bookingParams });
                }, 1000);
            }
        } catch (error) {
            hideLoader();
            console.error(error);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#000000' }}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>

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
                                style={{ width: width, height: 360 }} // Reduced height to prevent overlapping title
                                resizeMode="cover"
                            />
                        )}
                        keyExtractor={(_, index) => index.toString()}
                    />

                    <LinearGradient colors={['rgba(0,0,0,0.7)', 'transparent']} style={styles.topGradient} />
                    <LinearGradient colors={['transparent', '#000000']} style={styles.bottomGradient} />

                    {isOutOfStock && (
                        <View className="absolute inset-0 bg-black/60 items-center justify-center z-10">
                            <View className="bg-red-600 px-8 py-3 rounded-full">
                                <Text className="text-white font-black text-lg uppercase tracking-widest">Out of Stock</Text>
                            </View>
                        </View>
                    )}

                    {/* Navigation Buttons */}
                    <View className="absolute top-14 left-5 right-5 flex-row justify-between items-center z-20">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="w-11 h-11 bg-black/40 rounded-full items-center justify-center border border-white/10"
                        >
                            <Ionicons name="chevron-back" size={24} color="white" />
                        </TouchableOpacity>

                        <View className="flex-row gap-3">
                            <TouchableOpacity className="w-11 h-11 bg-black/40 rounded-full items-center justify-center border border-white/10">
                                <Ionicons name="share-outline" size={22} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleToggleFavorite}
                                className="w-11 h-11 bg-black/40 rounded-full items-center justify-center border border-white/10"
                            >
                                <Ionicons
                                    name={isLiked ? "heart" : "heart-outline"}
                                    size={22}
                                    color={isLiked ? "#FF3B30" : "white"}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Page Counter */}
                    <View className="absolute bottom-6 right-6 bg-black/60 px-4 py-1.5 rounded-xl border border-white/10">
                        <Text className="text-white text-[10px] font-black uppercase tracking-widest">
                            {activeSlide + 1} / {item.gallery ? item.gallery.length : 1}
                        </Text>
                    </View>
                </View>

                {/* --- B. MAIN CONTENT --- */}
                <View className="px-6 mt-6">

                    {/* Header Info */}
                    <Text className="text-3xl font-black text-white leading-tight mb-3">
                        {item.name}
                    </Text>

                    <View className="flex-row items-center gap-2 mb-6">
                        <Ionicons name="star" size={16} color="#B4F05F" />
                        <Text className="text-sm font-black text-white">{item.rating}</Text>
                        <View className="w-1 h-1 rounded-full bg-[#333333] mx-1" />
                        <Text className="text-sm font-bold text-[#B4F05F] underline">{item.reviewCount} Reviews</Text>
                        <Text className="text-sm text-[#666666] font-bold"> · Colombo, SL</Text>
                    </View>

                    {/* Stock Display Logic */}
                    {!isOutOfStock && (
                        <View
                            style={{
                                backgroundColor: quantity < 3 ? '#EF444415' : '#B4F05F10',
                                borderColor: quantity < 3 ? '#EF444430' : '#B4F05F30'
                            }}
                            className="self-start px-4 py-2 rounded-xl mb-8 border flex-row items-center gap-2"
                        >
                            <Ionicons
                                name={quantity < 3 ? "flame" : "checkmark-circle"}
                                size={16}
                                color={quantity < 3 ? "#EF4444" : "#B4F05F"}
                            />
                            <Text style={{ color: quantity < 3 ? '#EF4444' : '#B4F05F' }} className="text-[11px] font-black uppercase tracking-wider">
                                {quantity < 3 ? `Limited Stock: ${quantity} left` : `Available: ${quantity} in stock`}
                            </Text>
                        </View>
                    )}

                    {/* Host Info (Premium Card) */}
                    <View className="flex-row items-center justify-between mb-8 p-5 bg-[#1A1A1A] rounded-[24px] border border-white/5">
                        <View>
                            <Text className="text-sm font-black text-[#666666] uppercase mb-1">Managed By</Text>
                            <Text className="text-lg font-bold text-white">CamMart Pro Logistics</Text>
                        </View>
                        <Image
                            source={{ uri: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100" }}
                            className="w-14 h-14 rounded-full border-2 border-[#B4F05F]"
                        />
                    </View>

                    {/* Description */}
                    <View className="mb-8">
                        <Text className="text-base leading-7 text-[#999999] font-medium">
                            {item.description}
                        </Text>
                        <TouchableOpacity className="mt-4 flex-row items-center">
                            <Text className="font-black text-[#B4F05F] uppercase text-xs tracking-widest mr-2">Full Specs</Text>
                            <Ionicons name="chevron-forward" size={14} color="#B4F05F"/>
                        </TouchableOpacity>
                    </View>

                    {/* Features & Specs */}
                    <View style={{ backgroundColor: '#1A1A1A' }} className="mb-8 p-6 rounded-[32px] border border-white/5">
                        <Text className="text-xl font-black text-white mb-6 uppercase tracking-widest">Key Features</Text>
                        {item.specs && item.specs.map((spec: any, index: number) => (
                            <View key={index} className="flex-row items-center mb-5">
                                <View className="w-10 h-10 bg-black rounded-full items-center justify-center border border-[#B4F05F20]">
                                    <Ionicons name={spec.icon || "checkmark-circle"} size={20} color="#B4F05F" />
                                </View>
                                <Text className="ml-4 text-white text-base font-bold capitalize">
                                    {spec.text}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* Date Picker Summary Card */}
                    <TouchableOpacity
                        onPress={() => !isOutOfStock && setCalendarOpen(true)}
                        style={{ backgroundColor: '#1A1A1A', borderColor: '#B4F05F40' }}
                        className="mb-8 p-6 rounded-[24px] border border-dashed"
                    >
                        <Text className="text-lg font-black text-white mb-1">
                            {startDate && endDate ? `${calculateNights(startDate, endDate)} Night Rental` : "Check Availability"}
                        </Text>
                        <Text className="text-[#666666] font-bold text-xs mb-4">
                            {startDate && endDate ? `${startDate} to ${endDate}` : "Pick dates to view total price"}
                        </Text>
                        <View className="h-[1px] bg-white/5 w-full mb-4" />
                        <View className="flex-row justify-between items-center">
                            <Text className="font-black text-[#B4F05F] uppercase text-[10px] tracking-[2px]">Select Dates</Text>
                            <Ionicons name="calendar" size={18} color="#B4F05F"/>
                        </View>
                    </TouchableOpacity>

                    <ReviewsSection
                        itemId={item.id}
                        rating={item.rating || item.averageRating || 0}
                        count={item.reviewCount || item.ratingCount || 0}
                    />
                    <LocationSection />
                    <View className="h-10"/>
                </View>
            </ScrollView>

            {/* --- C. STICKY FOOTER --- */}
            <View style={styles.footer} className="absolute bottom-0 w-full bg-black border-t border-white/5 px-6 pt-5 flex-row items-center justify-between z-50">
                <View>
                    {startDate && endDate ? (
                        <View>
                            <Text className="text-2xl font-black text-[#B4F05F]">
                                Rs.{totalPrice.toLocaleString()}
                            </Text>
                            <Text className="text-[#666666] text-[10px] font-black uppercase tracking-widest mt-1">Total</Text>
                        </View>
                    ) : (
                        <View>
                            <View className="flex-row items-baseline">
                                <Text className="text-2xl font-black text-white">Rs.{item.pricePerDay.toLocaleString()}</Text>
                                <Text className="text-[#666666] text-xs font-bold ml-1">/day</Text>
                            </View>
                        </View>
                    )}
                </View>

                <TouchableOpacity
                    style={{ backgroundColor: isOutOfStock ? '#333333' : '#B4F05F' }}
                    className="px-8 py-5 rounded-[20px] active:scale-95" // Increased padding and specific radius
                    disabled={isOutOfStock}
                    onPress={handleReserve}
                >
                    <Text style={{ color: isOutOfStock ? '#666666' : '#000' }} className="font-black text-[15px] uppercase tracking-[1px]">
                        {isOutOfStock ? "Sold Out" : startDate && endDate ? "Reserve" : "Pick Dates"}
                    </Text>
                </TouchableOpacity>
            </View>

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

const styles = StyleSheet.create({
    topGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 140,
        zIndex: 15
    },
    bottomGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100,
        zIndex: 5
    },
    footer: {
        paddingBottom: Platform.OS === 'ios' ? 45 : 30, // Taller footer
        height: Platform.OS === 'ios' ? 130 : 110,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10
    }
});