import {View, Text, TouchableOpacity, ScrollView, Image, Alert, Modal} from 'react-native'
import React, {useEffect, useState} from 'react'

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
        try{
            const IP_ADDRESS = "192.168.8.189"
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
    }

    const openPaymentSheet = async () => {
        try {
            showLoader()

            const { paymentIntent, ephemeralKey, customer } = await fetchPaymentSheetParams();

            const { error } = await initPaymentSheet({
                merchantDisplayName: "GearUp Rentals",
                customerId: customer,
                customerEphemeralKeySecret: ephemeralKey,
                paymentIntentClientSecret: paymentIntent,
                defaultBillingDetails: {
                    name: 'Sachintha Prabashana',
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

        }catch(error) {
            hideLoader();
            console.log(error);
            Toast.show({ type: 'error', text1: 'Payment Error', text2: 'Could not connect to payment server.' });

        }
    }

    const handleConfirmBooking = async (ispaid: boolean = false) => {
        try {
            showLoader()

            await createBooking({
                itemId: itemId as string,
                itemName: name as string,
                itemImage: image as string,
                startDate: startDate as string,
                endDate: endDate as string,
                nights: nights,
                totalPrice: totalPrice,
                paymentMethod: paymentMethod
                // status: isPaid ? 'PAID' : 'PENDING_PAYMENT' - if supporting payment status
            })

            hideLoader()

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

            // Error Handling
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

    }

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
            showLoader()

            await updateUserProfile({
                address: details.address,
                city: details.city,
                coordinates: {
                    lat: details.lat,
                    lng: details.lng
                }
            })

            setUserAddress(details.address);
            hideLoader()

            Toast.show({ type: 'success', text1: 'Location Saved', text2: 'You can now proceed with payment.' });

            // Auto-trigger payment/booking after saving location? (Optional)
            handlePress();

        } catch (error) {
            hideLoader();
            Toast.show({ type: 'error', text1: 'Save Failed', text2: 'Could not save location.' });
        }
    }

    return (
        <SafeAreaView className={"flex-1 bg-white"} edges={["top"]}>
            <View className={"px-5 py-3 flex-row items-center border-b border-gray-100 bg-white z-10"}>
                <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
                    <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-lg font-bold ml-2 font-sans">Request to book</Text>

            </View>

            <ScrollView className={"flex-1 px-5 pt-6"} showsVerticalScrollIndicator={false}>
                <View className={"flex-row gap-4 mb-8 border-b border-gray-100 pb-6"}>
                    <Image
                        source={{ uri: image as string }}
                        className="w-28 h-24 rounded-xl bg-gray-100"
                        resizeMode="cover"
                    />
                    <View className={"flex-1 justify-center"}>
                        <Text className="text-xs text-slate-500 font-bold mb-1 uppercase tracking-wider">Gear Rental</Text>
                        <Text className="text-base font-bold text-slate-900 leading-5 mb-2">{name}</Text>
                        <View className="flex-row items-center gap-1">
                            <Ionicons name="star" size={12} color="#1A1A1A" />
                            <Text className="text-xs font-bold">5.0</Text>
                            <Text className="text-xs text-slate-500">(Top Rated)</Text>
                        </View>
                    </View>

                </View>

                {/* --- 2. YOUR TRIP DETAILS --- */}
                <View className="mb-8 border-b border-gray-100 pb-6">
                    <Text className="text-xl font-bold text-slate-900 mb-4 font-sans">Your trip</Text>

                    <View className="flex-row justify-between items-start mb-4">
                        <View>
                            <Text className="text-base font-bold text-slate-900">Dates</Text>
                            <Text className="text-slate-600 mt-1">{startDate} – {endDate}</Text>
                        </View>
                        <Text className="text-slate-900 font-bold underline">Edit</Text>
                    </View>

                    <View className="flex-row justify-between items-start">
                        <View>
                            <Text className="text-base font-bold text-slate-900">Duration</Text>
                            <Text className="text-slate-600 mt-1">{nights} nights</Text>
                        </View>
                    </View>
                </View>

                {/* --- LOCATION CHECK (Visual Feedback) --- */}
                <View className="mb-8 border-b border-gray-100 pb-6">
                    <Text className="text-xl font-bold text-slate-900 mb-4 font-sans">Your Location</Text>
                    {userAddress ? (
                        <TouchableOpacity
                            onPress={() => setLocationModalVisible(true)}
                            className="flex-row items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200"
                        >
                            <Ionicons name="location" size={24} color="#0F172A" />
                            <Text className="flex-1 text-slate-900 font-medium" numberOfLines={2}>{userAddress}</Text>
                            <Text className="text-xs font-bold text-blue-600">Change</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            onPress={() => setLocationModalVisible(true)}
                            className="flex-row items-center gap-3 bg-red-50 p-4 rounded-xl border border-red-100"
                        >
                            <Ionicons name="alert-circle" size={24} color="#EF4444" />
                            <Text className="flex-1 text-red-700 font-bold">Location Required</Text>
                            <Text className="text-xs font-bold text-red-700 underline">Add Now</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* --- 3. PAYMENT METHOD SELECTION --- */}
                <View className="mb-8 border-b border-gray-100 pb-6">
                    <Text className="text-xl font-bold text-slate-900 mb-4 font-sans">Pay with</Text>

                    {/* Card Option */}
                    <TouchableOpacity
                        onPress={() => setPaymentMethod('card')}
                        className={`flex-row items-center justify-between border rounded-xl p-4 mb-3 ${paymentMethod === 'card' ? 'border-slate-900 bg-slate-50' : 'border-gray-200'}`}
                    >
                        <View className="flex-row items-center gap-3">
                            <Ionicons name="card-outline" size={24} color="black" />
                            <Text className="font-bold text-slate-900">Credit or Debit Card</Text>
                        </View>
                        {paymentMethod === 'card' && <Ionicons name="checkmark-circle" size={24} color="black" />}
                    </TouchableOpacity>

                    {/* Cash Option */}
                    <TouchableOpacity
                        onPress={() => setPaymentMethod('cash')}
                        className={`flex-row items-center justify-between border rounded-xl p-4 ${paymentMethod === 'cash' ? 'border-slate-900 bg-slate-50' : 'border-gray-200'}`}
                    >
                        <View className="flex-row items-center gap-3">
                            <Ionicons name="cash-outline" size={24} color="black" />
                            <Text className="font-bold text-slate-900">Pay on Pickup</Text>
                        </View>
                        {paymentMethod === 'cash' && <Ionicons name="checkmark-circle" size={24} color="black" />}
                    </TouchableOpacity>
                </View>

                {/* --- 4. PRICE DETAILS --- */}
                <View className="mb-8 border-b border-gray-100 pb-6">
                    <Text className="text-xl font-bold text-slate-900 mb-4 font-sans">Price details</Text>

                    <View className="flex-row justify-between mb-3">
                        <Text className="text-slate-600">Rs. {price.toLocaleString()} x {nights} nights</Text>
                        <Text className="text-slate-600">Rs. {basePrice.toLocaleString()}</Text>
                    </View>

                    <View className="flex-row justify-between mb-3">
                        <Text className="text-slate-600 underline">GearUp service fee</Text>
                        <Text className="text-slate-600">Rs. {serviceFee.toLocaleString()}</Text>
                    </View>

                    <View className="flex-row justify-between mb-3">
                        <Text className="text-slate-600">Taxes</Text>
                        <Text className="text-slate-600">Rs. {taxes.toLocaleString()}</Text>
                    </View>

                    <View className="flex-row justify-between mt-2 pt-4 border-t border-gray-100">
                        <Text className="text-lg font-bold text-slate-900">Total (LKR)</Text>
                        <Text className="text-lg font-bold text-slate-900">Rs. {totalPrice.toLocaleString()}</Text>
                    </View>
                </View>

                {/* --- 5. CANCELLATION POLICY --- */}
                <View className="mb-10">
                    <Text className="text-xl font-bold text-slate-900 mb-2 font-sans">Cancellation policy</Text>
                    <Text className="text-slate-600 leading-5">
                        Free cancellation before {startDate}. After that, the reservation is non-refundable.
                    </Text>
                </View>

                {/* Scroll Padding */}
                <View className="h-20" />
            </ScrollView>
            {/* --- FOOTER: Confirm Button --- */}
            <View className="p-5 border-t border-gray-100 bg-white shadow-lg">
                <TouchableOpacity
                    className={`w-full py-4 rounded-xl items-center active:scale-[0.98] transition-all flex-row justify-center ${!userAddress ? 'bg-slate-400' : 'bg-[#FF385C]'}`}
                    onPress={handlePress}
                    // disabled={!userAddress}
                >
                    <Text className="text-white font-bold text-lg font-sans">
                        {!userAddress ? 'Add Location to Continue' : (paymentMethod === 'card' ? `Pay Rs. ${totalPrice.toLocaleString()}` : 'Confirm Booking')}
                    </Text>
                </TouchableOpacity>
            </View>

            {/*  CUSTOM ALERT MODAL (Industry Standard Design) */}
            <Modal
                transparent={true}
                visible={isAlertVisible}
                animationType="fade"
                onRequestClose={() => setAlertVisible(false)}
            >
                {/* Background Overlay (Dimmed) */}
                <View className="flex-1 backgroundColor-black/50 justify-center items-center px-6 bg-black/60">

                    {/* Modal Content */}
                    <View className="bg-white w-full rounded-3xl p-6 items-center shadow-2xl">

                        {/* Icon Circle */}
                        <View className="w-16 h-16 bg-red-50 rounded-full items-center justify-center mb-4">
                            <Ionicons name="location" size={32} color="#EF4444" />
                        </View>

                        {/* Text Content */}
                        <Text className="text-xl font-bold text-slate-900 text-center mb-2">
                            Location Required
                        </Text>
                        <Text className="text-slate-500 text-center mb-6 leading-5">
                            We need your address to arrange the pickup/delivery. Please add a location to proceed.
                        </Text>

                        {/* Buttons */}
                        <View className="w-full gap-3">
                            {/* Primary Button (Add Location) */}
                            <TouchableOpacity
                                onPress={() => {
                                    setAlertVisible(false);
                                    setLocationModalVisible(true); // Open the Map
                                }}
                                className="bg-[#FF385C] w-full py-3.5 rounded-xl items-center"
                            >
                                <Text className="text-white font-bold text-base">Add Location</Text>
                            </TouchableOpacity>

                            {/* Secondary Button (Cancel) */}
                            <TouchableOpacity
                                onPress={() => setAlertVisible(false)}
                                className="bg-slate-100 w-full py-3.5 rounded-xl items-center"
                            >
                                <Text className="text-slate-700 font-bold text-base">Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <LocationPickerModal
                isVisible={isLocationModalVisible}
                onClose={() => setLocationModalVisible(false)}
                onConfirm={handleLocationSelect}
            />

        </SafeAreaView>
    )
}
export default Checkout
