import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native'
import React, {useState} from 'react'

import { useLoader } from "@/hooks/useLoader";
import Toast from 'react-native-toast-message';
import {useLocalSearchParams, useRouter} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import {Ionicons} from "@expo/vector-icons";
import {createBooking} from "@/service/bookingService";

const Checkout = () => {
    const router = useRouter();
    const params = useLocalSearchParams();

    const { itemId, startDate, endDate, pricePerDay, image, name } = params;
    const { showLoader, hideLoader } = useLoader();
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);
    const nights = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    const price = Number(pricePerDay);
    const basePrice = price * nights;
    const serviceFee = basePrice * 0.10; // 10% Platform Fee
    const taxes = basePrice * 0.02; // 2% Tax
    const totalPrice = basePrice + serviceFee + taxes;

    const handleConfirmBooking = async () => {
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
                    className="bg-[#FF385C] w-full py-4 rounded-xl items-center active:scale-[0.98] transition-all flex-row justify-center"
                    onPress={handleConfirmBooking}
                >
                    <Text className="text-white font-bold text-lg font-sans">
                        {paymentMethod === 'card' ? `Pay Rs. ${totalPrice.toLocaleString()}` : 'Confirm Booking'}
                    </Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    )
}
export default Checkout
