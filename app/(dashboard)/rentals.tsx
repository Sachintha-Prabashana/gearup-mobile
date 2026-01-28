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
    UIManager,
    LayoutAnimation
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { format, differenceInDays, parseISO, isPast, isToday, isFuture } from 'date-fns';
import Toast from 'react-native-toast-message';

// Services
import { getUserBookings, returnItem, Booking } from "@/service/bookingService";
import { useAuth } from "@/hooks/useAuth";

// Enable Layout Animation for Android
// if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
//     UIManager.setLayoutAnimationEnabledExperimental(true);
// }

const Rentals = () => {
    const router = useRouter();
    const { user } = useAuth();

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');

    // --- DATA LOADING ---
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

    // --- LOGIC HELPERS ---

    const getCalculatedStatus = (booking: Booking) => {
        const endDate = parseISO(booking.endDate);
        if (booking.status === 'active' && isPast(endDate) && !isToday(endDate)) {
            return 'overdue';
        }
        return booking.status;
    };

    const getStatusConfig = (calculatedStatus: string) => {
        switch (calculatedStatus) {
            case 'active':
                return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-100', icon: 'pulse', label: 'Active Now' };
            case 'overdue':
                return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-100', icon: 'alert-circle', label: 'Overdue !' };
            case 'completed':
                return { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200', icon: 'checkmark-circle', label: 'Returned' };
            default:
                return { bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-100', icon: 'time', label: calculatedStatus };
        }
    };

    const getDateMessage = (booking: Booking, status: string) => {
        const end = parseISO(booking.endDate);
        const start = parseISO(booking.startDate);
        const today = new Date();

        if (status === 'overdue') {
            const daysOver = differenceInDays(today, end);
            return { text: `Overdue by ${daysOver} days`, color: 'text-red-600' };
        }
        if (status === 'active') {
            const daysLeft = differenceInDays(end, today);
            if (daysLeft === 0) return { text: 'Return Today', color: 'text-orange-600' };
            return { text: `${daysLeft} days left`, color: 'text-slate-600' };
        }
        if (isFuture(start)) {
            const daysToStart = differenceInDays(start, today);
            return { text: `Starts in ${daysToStart} days`, color: 'text-blue-600' };
        }
        return { text: 'Rental Completed', color: 'text-gray-400' };
    };

    const handleReturn = (item: Booking) => {
        Alert.alert(
            "Return Item",
            `Confirm return of ${item.itemName}?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Confirm",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setLoading(true);
                            await returnItem(item.id, item.itemId); // Service Call
                            Toast.show({ type: 'success', text1: 'Success', text2: 'Item returned successfully' });
                            loadData(); // Reload List
                        } catch (error: any) {
                            Toast.show({ type: 'error', text1: 'Error', text2: error.message });
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    // --- FILTERING ---
    const currentBookings = bookings.filter(b => {
        const s = getCalculatedStatus(b);
        return ['active', 'overdue'].includes(s);
    });

    const historyBookings = bookings.filter(b => {
        const s = getCalculatedStatus(b);
        return ['completed', 'cancelled'].includes(s);
    });

    const displayData = activeTab === 'current' ? currentBookings : historyBookings;

    // --- RENDER COMPONENT (CARD) ---
    const renderItem = ({ item }: { item: Booking }) => {
        const status = getCalculatedStatus(item);
        const config = getStatusConfig(status);
        const dateMsg = getDateMessage(item, status);

        // Progress Calculation
        let progress = 0;
        if (status === 'active' || status === 'overdue') {
            const total = differenceInDays(parseISO(item.endDate), parseISO(item.startDate)) || 1;
            const passed = differenceInDays(new Date(), parseISO(item.startDate));
            progress = Math.min(Math.max((passed / total) * 100, 5), 100);
        }

        //  FIX: Safe Image URL Logic
        // 1. itemImage (New format) -> 2. image (Old format) -> 3. Placeholder
        const imageUrl = item.itemImage || "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=200";

        return (
            <TouchableOpacity
                activeOpacity={0.9}
                className={`bg-white p-4 mb-4 rounded-[24px] border shadow-sm ${status === 'overdue' ? 'border-red-200' : 'border-gray-100'}`}
                onPress={() => router.push({ pathname: "/product/[id]", params: { id: item.itemId } })}
            >
                {/* Header: Image & Title */}
                <View className="flex-row gap-4 mb-3">
                    {/*  Updated Image Component with Safe URL */}
                    <Image
                        source={{ uri: imageUrl }}
                        className="w-16 h-16 rounded-2xl bg-gray-100"
                        resizeMode="cover"
                    />

                    <View className="flex-1 justify-center">
                        <View className="flex-row justify-between items-start">
                            <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                                {item.bookingRef || '#ORD-REF'}
                            </Text>
                            {/* Status Badge */}
                            <View className={`${config.bg} px-2 py-0.5 rounded-full flex-row items-center gap-1`}>
                                <Ionicons name={config.icon as any} size={10} color={config.text.includes('red') ? '#DC2626' : '#15803d'} />
                                <Text className={`text-[9px] font-bold uppercase ${config.text}`}>{config.label}</Text>
                            </View>
                        </View>
                        <Text className="text-base font-bold text-slate-900 leading-tight" numberOfLines={1}>
                            {item.itemName || "Unknown Item"}
                        </Text>
                    </View>
                </View>

                {/* Timeline Box */}
                <View className={`p-3 rounded-2xl mb-3 border ${status === 'overdue' ? 'bg-red-50/50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                    <View className="flex-row justify-between items-center mb-2">
                        <View className="flex-row items-center gap-1.5">
                            <Ionicons name="time-outline" size={16} color="#64748B" />
                            <Text className={`text-xs font-bold ${dateMsg.color}`}>{dateMsg.text}</Text>
                        </View>
                        <Text className="text-[11px] text-slate-500 font-medium">
                            {format(parseISO(item.startDate), 'MMM dd')} - {format(parseISO(item.endDate), 'MMM dd')}
                        </Text>
                    </View>

                    {/* Progress Bar (Only for active/overdue) */}
                    {(status === 'active' || status === 'overdue') && (
                        <View className="h-1.5 bg-gray-200 rounded-full overflow-hidden w-full mt-1">
                            <View
                                style={{ width: `${progress}%` }}
                                className={`h-full rounded-full ${status === 'overdue' ? 'bg-red-500' : progress > 80 ? 'bg-orange-500' : 'bg-slate-900'}`}
                            />
                        </View>
                    )}
                </View>

                {/* Footer: Price & Action */}
                <View className="flex-row justify-between items-center pt-1">
                    <Text className="text-sm font-bold text-slate-900">
                        Rs. {item.totalPrice?.toLocaleString() || "0"}
                    </Text>

                    {/* Button Logic */}
                    {(status === 'active' || status === 'overdue') ? (
                        <TouchableOpacity
                            onPress={() => handleReturn(item)}
                            className={`${status === 'overdue' ? 'bg-red-600' : 'bg-slate-900'} px-5 py-2.5 rounded-xl shadow-sm active:scale-95 transition-all`}
                        >
                            <Text className="text-white text-xs font-bold">
                                {status === 'overdue' ? 'Return Now' : 'Return Item'}
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            disabled={true}
                            className="bg-gray-100 px-5 py-2.5 rounded-xl"
                        >
                            <Text className="text-gray-400 text-xs font-bold">Completed</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top']}>

            {/* Header */}
            <View className="px-5 pt-4 pb-2">
                <Text className="text-3xl font-extrabold text-slate-900 font-sans tracking-tight mb-4">
                    My Rentals
                </Text>

                {/* Custom Tabs */}
                <View className="flex-row bg-white p-1.5 rounded-2xl border border-gray-100 mb-2 shadow-sm">
                    <TouchableOpacity
                        onPress={() => {
                            // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                            setActiveTab('current');
                        }}
                        className={`flex-1 py-2.5 rounded-xl items-center ${activeTab === 'current' ? 'bg-slate-900 shadow-sm' : 'bg-transparent'}`}
                    >
                        <Text className={`text-xs font-bold ${activeTab === 'current' ? 'text-white' : 'text-slate-500'}`}>Active</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                            setActiveTab('history');
                        }}
                        className={`flex-1 py-2.5 rounded-xl items-center ${activeTab === 'history' ? 'bg-slate-900 shadow-sm' : 'bg-transparent'}`}
                    >
                        <Text className={`text-xs font-bold ${activeTab === 'history' ? 'text-white' : 'text-slate-500'}`}>History</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Content List */}
            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#0F172A" />
                </View>
            ) : (
                <FlatList
                    data={displayData}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    ListEmptyComponent={() => (
                        <View className="items-center justify-center mt-20 px-10">
                            <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
                                <Ionicons name={activeTab === 'current' ? "calendar-outline" : "time-outline"} size={32} color="#94A3B8" />
                            </View>
                            <Text className="text-lg font-bold text-slate-900 mb-1">No {activeTab} bookings</Text>
                            <Text className="text-slate-400 text-center text-sm mb-6">
                                {activeTab === 'current'
                                    ? "You don't have any active rentals right now."
                                    : "You haven't rented anything yet."}
                            </Text>
                            {activeTab === 'current' && (
                                <TouchableOpacity
                                    onPress={() => router.push('/(dashboard)/home')}
                                    className="bg-slate-900 px-6 py-3 rounded-xl"
                                >
                                    <Text className="text-white font-bold text-sm">Browse Gear</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                />
            )}
        </SafeAreaView>
    );
};

export default Rentals;