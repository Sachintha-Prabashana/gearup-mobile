import { View, Text, TouchableOpacity, ScrollView, Image, Alert, Modal, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';

import { useLoader } from "@/hooks/useLoader";
import Toast from 'react-native-toast-message';
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { createBooking } from "@/service/bookingService";
import { useStripe } from '@stripe/stripe-react-native';
import LocationPickerModal from "@/components/LocationPickerModal";
import { getUserProfile, updateUserProfile } from "@/service/userService";
import { useAuth } from "@/hooks/useAuth";
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

const Checkout = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { user } = useAuth();
    // initialize stripe hooks
    const { initPaymentSheet, presentPaymentSheet } = useStripe();

    const { itemId, startDate, endDate, pricePerDay, image, name } = params;
    const { showLoader, hideLoader } = useLoader();
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
    const [userAddress, setUserAddress] = useState<string | null>(null);
    const [isLocationModalVisible, setLocationModalVisible] = useState(false);
    const [isAlertVisible, setAlertVisible] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const checkAddress = async () => {
            if (user) {
                try {
                    const profile: any = await getUserProfile();
                    if (isMounted && profile?.address) {
                        setUserAddress(profile.address);
                    }
                } catch (error) {
                    console.error("Error loading address:", error);
                }
            }
        };
        checkAddress();

        // Cleanup function
        return () => { isMounted = false; };
    }, [user]);

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);
    const nights = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    const price = Number(pricePerDay);
    const basePrice = price * nights;
    const serviceFee = basePrice * 0.10; // 10% Platform Fee
    const taxes = basePrice * 0.02; // 2% Tax
    const totalPrice = basePrice + serviceFee + taxes;

    const fetchPaymentSheetParams = async () => {
        try {
            const IP_ADDRESS = "192.168.8.189";
            const response = await fetch(`http://${IP_ADDRESS}:4000/api/payment-sheet`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: totalPrice,
                }),
            });

            const { paymentIntent, ephemeralKey, customer } = await response.json();

            return {
                paymentIntent,
                ephemeralKey,
                customer,
            };

        } catch (error) {
            console.error("Error fetching payment params:", error);
            throw new Error("Server Connection Failed");
        }
    };

    const openPaymentSheet = async () => {
        try {
            showLoader();

            const { paymentIntent, ephemeralKey, customer } = await fetchPaymentSheetParams();

            const { error } = await initPaymentSheet({
                merchantDisplayName: "CamMart Rentals",
                customerId: customer,
                customerEphemeralKeySecret: ephemeralKey,
                paymentIntentClientSecret: paymentIntent,
                defaultBillingDetails: {
                    name: user?.displayName || 'Sachintha Prabashana',
                },
            });

            hideLoader();

            if (error) {
                Toast.show({ type: 'error', text1: 'Error', text2: error.message });
                return;
            }

            const { error: paymentError } = await presentPaymentSheet();

            if (paymentError) {
                Toast.show({ type: 'info', text1: 'Canceled', text2: 'Payment was canceled.' });
            } else {
                await handleConfirmBooking(true);
            }

        } catch (error) {
            hideLoader();
            console.log(error);
            Toast.show({ type: 'error', text1: 'Payment Error', text2: 'Could not connect to payment server.' });
        }
    };

    const handleConfirmBooking = async (ispaid: boolean = false) => {
        try {
            showLoader();

            await createBooking({
                itemId: itemId as string,
                itemName: name as string,
                itemImage: image as string,
                startDate: startDate as string,
                endDate: endDate as string,
                nights: nights,
                totalPrice: totalPrice,
                paymentMethod: paymentMethod
            });

            hideLoader();

            Toast.show({
                type: 'success',
                text1: 'Booking Confirmed! 🎉',
                text2: 'Your gear is ready for pickup.',
                position: 'top'
            });

            setTimeout(() => {
                router.dismissAll();
                router.replace("/(dashboard)/home");
            }, 2000);

        } catch (error: any) {
            hideLoader();
            const errorMessage = error.message === "User not authenticated"
                ? "Please login to continue."
                : "Booking failed. Please try again.";

            Toast.show({
                type: 'error',
                text1: 'Booking Failed',
                text2: errorMessage,
                position: 'bottom'
            });
        }
    };

    const handlePress = () => {
        if (!userAddress) {
            setAlertVisible(true);
            return;
        }
        if (paymentMethod === 'card') {
            openPaymentSheet();
        } else {
            handleConfirmBooking(false);
        }
    };

    const handleLocationSelect = async (details: { address: string; city: string; lat: number; lng: number }) => {
        try {
            showLoader();

            await updateUserProfile({
                address: details.address,
                city: details.city,
                coordinates: {
                    lat: details.lat,
                    lng: details.lng
                }
            });

            setUserAddress(details.address);
            hideLoader();

            Toast.show({ type: 'success', text1: 'Location Saved', text2: 'You can now proceed with payment.' });
            handlePress();

        } catch (error) {
            hideLoader();
            Toast.show({ type: 'error', text1: 'Save Failed', text2: 'Could not save location.' });
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#000000' }}>
            <StatusBar style="light" />
            <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
                {/* --- HEADER --- */}
                <View style={{ borderColor: '#1A1A1A' }} className="px-5 py-4 flex-row items-center border-b bg-black z-10">
                    <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
                        <Ionicons name="chevron-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-xl font-black ml-2 text-white">Request to book</Text>
                </View>

                <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false}>
                    {/* --- 1. PRODUCT PREVIEW --- */}
                    <View style={{ borderColor: '#1A1A1A' }} className="flex-row gap-4 mb-8 border-b pb-6">
                        <Image
                            source={{ uri: image as string }}
                            className="w-28 h-24 rounded-2xl bg-[#1A1A1A]"
                            resizeMode="cover"
                        />
                        <View className="flex-1 justify-center">
                            <Text className="text-[10px] text-[#B4F05F] font-black mb-1 uppercase tracking-widest">Gear Rental</Text>
                            <Text className="text-base font-bold text-white leading-5 mb-2">{name}</Text>
                            <View className="flex-row items-center gap-1">
                                <Ionicons name="star" size={14} color="#FFC107" />
                                <Text className="text-xs font-bold text-white">5.0</Text>
                                <Text className="text-xs text-[#666666] font-bold"> (Top Rated)</Text>
                            </View>
                        </View>
                    </View>

                    {/* --- 2. TRIP DETAILS --- */}
                    <View style={{ borderColor: '#1A1A1A' }} className="mb-8 border-b pb-6">
                        <Text className="text-xl font-black text-white mb-4">Your trip</Text>
                        <View className="flex-row justify-between items-start mb-4">
                            <View>
                                <Text className="text-sm font-black text-[#666666] uppercase mb-1">Dates</Text>
                                <Text className="text-white font-bold">{startDate} – {endDate}</Text>
                            </View>
                            <TouchableOpacity><Text className="text-[#B4F05F] font-bold underline">Edit</Text></TouchableOpacity>
                        </View>
                        <View>
                            <Text className="text-sm font-black text-[#666666] uppercase mb-1">Duration</Text>
                            <Text className="text-white font-bold">{nights} nights</Text>
                        </View>
                    </View>

                    {/* --- LOCATION CHECK --- */}
                    <View style={{ borderColor: '#1A1A1A' }} className="mb-8 border-b pb-6">
                        <Text className="text-xl font-black text-white mb-4">Your Location</Text>
                        {userAddress ? (
                            <TouchableOpacity
                                onPress={() => setLocationModalVisible(true)}
                                style={{ backgroundColor: '#1A1A1A', borderColor: '#2A2A2A' }}
                                className="flex-row items-center gap-3 p-4 rounded-2xl border"
                            >
                                <Ionicons name="location" size={24} color="#B4F05F" />
                                <Text className="flex-1 text-white font-medium" numberOfLines={2}>{userAddress}</Text>
                                <Text className="text-xs font-black text-[#B4F05F] uppercase">Edit</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                onPress={() => setLocationModalVisible(true)}
                                style={{ backgroundColor: '#EF444410', borderColor: '#EF444430' }}
                                className="flex-row items-center gap-3 p-4 rounded-2xl border"
                            >
                                <Ionicons name="alert-circle" size={24} color="#EF4444" />
                                <Text className="flex-1 text-red-500 font-bold">Location Required</Text>
                                <Text className="text-xs font-black text-red-500 underline uppercase">Add</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* --- 3. PAYMENT METHOD --- */}
                    <View style={{ borderColor: '#1A1A1A' }} className="mb-8 border-b pb-6">
                        <Text className="text-xl font-black text-white mb-4">Pay with</Text>

                        <TouchableOpacity
                            onPress={() => setPaymentMethod('card')}
                            style={{
                                backgroundColor: paymentMethod === 'card' ? '#B4F05F10' : '#1A1A1A',
                                borderColor: paymentMethod === 'card' ? '#B4F05F' : '#2A2A2A'
                            }}
                            className="flex-row items-center justify-between border rounded-2xl p-4 mb-3"
                        >
                            <View className="flex-row items-center gap-3">
                                <Ionicons name="card-outline" size={24} color={paymentMethod === 'card' ? '#B4F05F' : "white"} />
                                <Text className={`font-bold ${paymentMethod === 'card' ? 'text-[#B4F05F]' : 'text-white'}`}>Credit or Debit Card</Text>
                            </View>
                            {paymentMethod === 'card' && <Ionicons name="checkmark-circle" size={24} color="#B4F05F" />}
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setPaymentMethod('cash')}
                            style={{
                                backgroundColor: paymentMethod === 'cash' ? '#B4F05F10' : '#1A1A1A',
                                borderColor: paymentMethod === 'cash' ? '#B4F05F' : '#2A2A2A'
                            }}
                            className="flex-row items-center justify-between border rounded-2xl p-4"
                        >
                            <View className="flex-row items-center gap-3">
                                <Ionicons name="cash-outline" size={24} color={paymentMethod === 'cash' ? '#B4F05F' : "white"} />
                                <Text className={`font-bold ${paymentMethod === 'cash' ? 'text-[#B4F05F]' : 'text-white'}`}>Pay on Pickup</Text>
                            </View>
                            {paymentMethod === 'cash' && <Ionicons name="checkmark-circle" size={24} color="#B4F05F" />}
                        </TouchableOpacity>
                    </View>

                    {/* --- 4. PRICE DETAILS --- */}
                    <View style={{ borderColor: '#1A1A1A' }} className="mb-8 border-b pb-6">
                        <Text className="text-xl font-black text-white mb-4">Price details</Text>
                        <View className="flex-row justify-between mb-3">
                            <Text className="text-[#999999] font-bold">Rs. {price.toLocaleString()} x {nights} nights</Text>
                            <Text className="text-white font-black">Rs. {basePrice.toLocaleString()}</Text>
                        </View>
                        <View className="flex-row justify-between mb-3">
                            <Text className="text-[#999999] font-bold underline">CamMart service fee</Text>
                            <Text className="text-white font-black">Rs. {serviceFee.toLocaleString()}</Text>
                        </View>
                        <View className="flex-row justify-between mb-3">
                            <Text className="text-[#999999] font-bold">Taxes</Text>
                            <Text className="text-white font-black">Rs. {taxes.toLocaleString()}</Text>
                        </View>
                        <View style={{ borderColor: '#1A1A1A' }} className="flex-row justify-between mt-2 pt-4 border-t">
                            <Text className="text-lg font-black text-white">Total (LKR)</Text>
                            <Text className="text-xl font-black text-[#B4F05F]">Rs. {totalPrice.toLocaleString()}</Text>
                        </View>
                    </View>

                    <View className="mb-10">
                        <Text className="text-xs text-[#666666] leading-5 font-bold">
                            Cancellation policy: Free cancellation before {startDate}. After that, the reservation is non-refundable.
                        </Text>
                    </View>
                    <View className="h-20" />
                </ScrollView>

                {/* --- FOOTER --- */}
                <View style={{ borderColor: '#1A1A1A' }} className="p-6 border-t bg-black">
                    <TouchableOpacity
                        style={{ backgroundColor: !userAddress ? '#333333' : '#B4F05F' }}
                        className="w-full py-5 rounded-[24px] items-center active:scale-[0.98] transition-all flex-row justify-center"
                        onPress={handlePress}
                    >
                        <Text style={{ color: !userAddress ? '#666666' : '#000000' }} className="font-black text-lg uppercase tracking-widest">
                            {!userAddress ? 'Add Location' : (paymentMethod === 'card' ? `Pay Rs. ${totalPrice.toLocaleString()}` : 'Confirm Booking')}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* --- MODAL --- */}
                <Modal transparent visible={isAlertVisible} animationType="fade">
                    <View className="flex-1 justify-center items-center px-8 bg-black/80">
                        <View className="bg-[#1A1A1A] w-full rounded-[32px] p-8 items-center border border-white/5 shadow-2xl">
                            <View className="w-16 h-16 bg-red-500/10 rounded-full items-center justify-center mb-4">
                                <Ionicons name="location" size={32} color="#EF4444" />
                            </View>
                            <Text className="text-2xl font-black text-white text-center mb-2">Location Required</Text>
                            <Text className="text-[#999999] text-center mb-8 font-bold leading-5">We need your address to arrange pickup. Please add a location to proceed.</Text>
                            <View className="w-full gap-3">
                                <TouchableOpacity
                                    onPress={() => { setAlertVisible(false); setLocationModalVisible(true); }}
                                    className="bg-[#B4F05F] w-full py-4 rounded-2xl items-center"
                                >
                                    <Text className="text-black font-black uppercase tracking-widest">Add Location</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setAlertVisible(false)} className="w-full py-3 items-center">
                                    <Text className="text-[#666666] font-black uppercase tracking-widest">Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                <LocationPickerModal isVisible={isLocationModalVisible} onClose={() => setLocationModalVisible(false)} onConfirm={handleLocationSelect} />
            </SafeAreaView>
        </View>
    );
};

export default Checkout;