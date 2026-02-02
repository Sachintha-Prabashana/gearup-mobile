import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Alert,
    Platform,
    StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { format, differenceInDays, parseISO, isPast, isToday, isFuture } from 'date-fns';
import Toast from 'react-native-toast-message';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import AdminActionModal from "@/components/AdminActionModal";
import { addReview } from "@/service/ratingService";
import RatingModal from "@/components/RatingModal";
import BookingQRModal from "@/components/BookingQRModal";

// Services
import { getUserBookings, Booking, markBookingAsCompleted } from "@/service/bookingService";
import { useAuth } from "@/hooks/useAuth";

const Rentals = () => {
    const router = useRouter();
    const { user } = useAuth();

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');

    // Modals & Selections
    const [isAdminModalVisible, setAdminModalVisible] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

    // Rating States
    const [isRatingModalVisible, setRatingModalVisible] = useState(false);
    const [isSubmittingReview, setSubmittingReview] = useState(false);

    // QR Code State
    const [isQRModalVisible, setQRModalVisible] = useState(false);


    const loadData = async () => {
        if (!user) return;
        try {
            const data = await getUserBookings();
            setBookings(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [user])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    }

    // Admin Modal State
    const handleLongPress = (item: Booking) => {
        setSelectedBooking(item);
        setAdminModalVisible(true);
    };

    // Dev Only:
    const handleConfirmReturn = async () => {
        if (!selectedBooking) return;

        try {
            setLoading(true);

            await markBookingAsCompleted(selectedBooking.id, selectedBooking.itemId);

            Toast.show({ type: 'success', text1: 'Success', text2: 'Item marked as returned' });
            setAdminModalVisible(false);
            loadData();
        } catch (error: any) {
            Toast.show({ type: 'error', text1: 'Error', text2: error.message });
        } finally {
            setLoading(false);
        }
    };

    // 2. Rating Logic
    const handleRateClick = (item: Booking) => {
        setSelectedBooking(item);
        setRatingModalVisible(true);
    };

    const handleSubmitReview = async (rating: number, comment: string) => {
        if (!selectedBooking) return;

        try {
            setSubmittingReview(true);
            await addReview(
                selectedBooking.id,
                selectedBooking.itemId,
                rating,
                comment
            );

            Toast.show({ type: 'success', text1: 'Thank You!', text2: 'Review submitted successfully.' });
            setRatingModalVisible(false);
            loadData(); // Refresh list to update UI (show "Rated")
        } catch (error: any) {
            Toast.show({ type: 'error', text1: 'Error', text2: error.message });
        } finally {
            setSubmittingReview(false);
        }
    };

    // QR Logic
    const handleViewTicket = (item: Booking) => { 
        setSelectedBooking(item);
        setQRModalVisible(true);
    };

    const getCalculatedStatus = (booking: Booking) => {
        const endDate = parseISO(booking.endDate);
        if (booking.status === 'active' && isPast(endDate) && !isToday(endDate)) {
            return 'overdue';
        }
        return booking.status;
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'active':
                return { bg: 'bg-[#B4F05F]/10', text: 'text-[#B4F05F]', icon: 'pulse', label: 'Active Now' };
            case 'overdue':
                return { bg: 'bg-red-500/10', text: 'text-red-500', icon: 'alert-circle', label: 'Overdue' };
            case 'completed':
                return { bg: 'bg-white/10', text: 'text-[#999999]', icon: 'checkmark-circle', label: 'Returned' };
            default:
                return { bg: 'bg-white/5', text: 'text-[#666666]', icon: 'time', label: status };
        }
    };

    const getDateMessage = (booking: Booking, status: string) => {
        const end = parseISO(booking.endDate);
        const start = parseISO(booking.startDate);
        const today = new Date();

        if (status === 'overdue') {
            const daysOver = differenceInDays(today, end);
            return { text: `Overdue by ${daysOver} days`, color: 'text-red-500' };
        }
        if (status === 'active') {
            const daysLeft = differenceInDays(end, today);
            if (daysLeft === 0) return { text: 'Return Today', color: 'text-orange-500' };
            return { text: `${daysLeft} days left`, color: 'text-[#B4F05F]' };
        }
        if (isFuture(start)) {
            const daysToStart = differenceInDays(start, today);
            return { text: `Starts in ${daysToStart} days`, color: 'text-blue-400' };
        }
        return { text: 'Rental Completed', color: 'text-[#666666]' };
    };

    const displayData = activeTab === 'current'
        ? bookings.filter(b => ['active', 'overdue'].includes(getCalculatedStatus(b)))
        : bookings.filter(b => ['completed', 'cancelled'].includes(getCalculatedStatus(b)));

    const renderItem = ({ item }: { item: Booking }) => {
        const status = getCalculatedStatus(item);
        const config = getStatusConfig(status);
        const dateMsg = getDateMessage(item, status);

        let progress = 0;
        if (status === 'active' || status === 'overdue') {
            const total = differenceInDays(parseISO(item.endDate), parseISO(item.startDate)) || 1;
            const passed = differenceInDays(new Date(), parseISO(item.startDate));
            progress = Math.min(Math.max((passed / total) * 100, 5), 100);
        }

        const imageUrl = item.itemImage || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200";

        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onLongPress={() => handleLongPress(item)}
                style={{ backgroundColor: '#1A1A1A', borderColor: status === 'overdue' ? '#EF444450' : '#2A2A2A' }}
                className="p-5 mb-5 rounded-[28px] border"
                onPress={() => router.push({ pathname: "/product/[id]", params: { id: item.itemId } })}
            >
                <View className="flex-row gap-4 mb-4">
                    <Image source={{ uri: imageUrl }} className="w-16 h-16 rounded-2xl bg-[#000]" resizeMode="cover" />

                    <View className="flex-1 justify-center">
                        <View className="flex-row justify-between items-start">
                            <Text className="text-[10px] text-[#666666] font-black uppercase tracking-widest mb-1">
                                {item.bookingRef || '#ORD-REF'}
                            </Text>
                            <View className={`${config.bg} px-2.5 py-1 rounded-full flex-row items-center gap-1.5`}>
                                <Ionicons name={config.icon as any} size={10} color={config.text.includes('B4F05F') ? '#B4F05F' : '#EF4444'} />
                                <Text className={`text-[9px] font-black uppercase ${config.text}`}>{config.label}</Text>
                            </View>
                        </View>
                        <Text className="text-base font-bold text-white leading-tight" numberOfLines={1}>
                            {item.itemName || "Unknown Item"}
                        </Text>
                    </View>
                </View>

                <View style={{ backgroundColor: '#00000050', borderColor: '#333333' }} className="p-4 rounded-2xl mb-4 border">
                    <View className="flex-row justify-between items-center mb-3">
                        <View className="flex-row items-center gap-2">
                            <Ionicons name="time-outline" size={16} color="#999999" />
                            <Text className={`text-xs font-black ${dateMsg.color}`}>{dateMsg.text}</Text>
                        </View>
                        <Text className="text-[11px] text-[#666666] font-bold">
                            {format(parseISO(item.startDate), 'MMM dd')} - {format(parseISO(item.endDate), 'MMM dd')}
                        </Text>
                    </View>

                    {(status === 'active' || status === 'overdue') && (
                        <View className="h-1.5 bg-[#333333] rounded-full overflow-hidden w-full">
                            <View
                                style={{ width: `${progress}%` }}
                                className={`h-full rounded-full ${status === 'overdue' ? 'bg-red-500' : 'bg-[#B4F05F]'}`}
                            />
                        </View>
                    )}
                </View>

               {/* Footer Buttons */}
                <View className="mt-2">
                    {(status === 'active' || status === 'overdue') ? (
                        <View className="flex-row items-stretch gap-3">
                            
                            {/* 1. Ticket Button (Expanded) */}
                            <TouchableOpacity
                                onPress={() => handleViewTicket(item)}
                                style={{ backgroundColor: '#333333' }}
                                className="flex-1 py-3 rounded-xl flex-row justify-center items-center gap-2 active:scale-95"
                            >
                                <Ionicons name="qr-code-outline" size={16} color="white" />
                                <Text className="text-white text-[11px] font-black uppercase tracking-wider">
                                    Ticket
                                </Text>
                            </TouchableOpacity>

                            {/* 2. Return Status Badge (Fixed Width based on content) */}
                            <View
                                style={{
                                    backgroundColor: status === 'overdue' ? '#EF444420' : '#1A1A1A',
                                    borderColor: status === 'overdue' ? '#EF4444' : '#333333',
                                    borderWidth: 1
                                }}
                                className="px-5 py-3 rounded-xl justify-center items-center"
                            >
                                <Text
                                    style={{ color: status === 'overdue' ? '#EF4444' : '#B4F05F' }}
                                    className="text-[10px] font-black uppercase tracking-wider"
                                >
                                    {status === 'overdue' ? 'Overdue' : `Return: ${format(parseISO(item.endDate), 'MMM dd')}`}
                                </Text>
                            </View>
                        </View>
                    ) : (
                        // History Items (Completed/Cancelled)
                        <View className="flex-row items-center justify-between w-full mt-1">
                            <View className="flex-row items-baseline">
                                <Text className="text-lg font-black text-white">Rs.{item.totalPrice?.toLocaleString()}</Text>
                                <Text className="text-[#666666] text-[10px] font-bold ml-1">total</Text>
                            </View>

                            {!item.isRated ? (
                                <TouchableOpacity
                                    onPress={() => handleRateClick(item)}
                                    style={{ backgroundColor: '#B4F05F', shadowColor: '#B4F05F', shadowOpacity: 0.3, shadowRadius: 8 }}
                                    className="px-5 py-2.5 rounded-xl flex-row items-center gap-2"
                                >
                                    <Ionicons name="star" size={14} color="black" />
                                    <Text className="text-black text-[10px] font-black uppercase">Rate</Text>
                                </TouchableOpacity>
                            ) : (
                                <View style={{ backgroundColor: '#333333' }} className="px-6 py-3 rounded-xl">
                                    <Text className="text-[#666666] text-xs font-black uppercase">Completed</Text>
                                </View>
                            )}
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#000000' }}>
            <StatusBar style="light" />
            <LinearGradient colors={['#121212', '#000000']} style={StyleSheet.absoluteFillObject} />

            <SafeAreaView className="flex-1" edges={['top']}>
                <View className="px-6 pt-5 pb-4">
                    <Text className="text-4xl font-black text-white tracking-tighter mb-6">My Rentals</Text>

                    <View style={{ backgroundColor: '#1A1A1A', borderColor: '#2A2A2A' }} className="flex-row p-1.5 rounded-2xl border">
                        <TouchableOpacity
                            onPress={() => setActiveTab('current')} // Removed LayoutAnimation to fix Navigation Error
                            style={{ backgroundColor: activeTab === 'current' ? '#B4F05F' : 'transparent' }}
                            className="flex-1 py-3 rounded-xl items-center"
                        >
                            <Text className={`text-xs font-black uppercase ${activeTab === 'current' ? 'text-black' : 'text-[#666666]'}`}>Active</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setActiveTab('history')} // Removed LayoutAnimation to fix Navigation Error
                            style={{ backgroundColor: activeTab === 'history' ? '#B4F05F' : 'transparent' }}
                            className="flex-1 py-3 rounded-xl items-center"
                        >
                            <Text className={`text-xs font-black uppercase ${activeTab === 'history' ? 'text-black' : 'text-[#666666]'}`}>History</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {loading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#B4F05F" />
                    </View>
                ) : (
                    <FlatList
                        data={displayData}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
                        showsVerticalScrollIndicator={false}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#B4F05F" />}
                        ListEmptyComponent={() => (
                            <View className="items-center justify-center mt-20 px-10">
                                <View style={{ backgroundColor: '#1A1A1A' }} className="w-20 h-20 rounded-full items-center justify-center mb-6">
                                    <Ionicons name={activeTab === 'current' ? "calendar-outline" : "time-outline"} size={32} color="#333333" />
                                </View>
                                <Text className="text-xl font-bold text-white mb-2">No {activeTab} bookings</Text>
                                <Text className="text-[#666666] text-center text-sm leading-6">
                                    {activeTab === 'current' ? "You don't have any active rentals right now." : "You haven't rented anything yet."}
                                </Text>
                            </View>
                        )}
                    />
                )}
            </SafeAreaView>

             {/*Admin Action Modal*/}
            <AdminActionModal
                isVisible={isAdminModalVisible}
                onClose={() => setAdminModalVisible(false)}
                onConfirm={handleConfirmReturn}
                itemName={selectedBooking?.itemName || "Item"}
                loading={loading}
            />

            {/* Rating Modal */}
            <RatingModal
                isVisible={isRatingModalVisible}
                onClose={() => setRatingModalVisible(false)}
                onSubmit={handleSubmitReview}
                itemName={selectedBooking?.itemName || "Item"}
                isSubmitting={isSubmittingReview}
            />

            <BookingQRModal
                visible={isQRModalVisible}
                onClose={() => setQRModalVisible(false)}
                bookingId={selectedBooking?.id || ""}
                itemName={selectedBooking?.itemName || "Rental Item"}
            />
        </View>
    );
};

export default Rentals;