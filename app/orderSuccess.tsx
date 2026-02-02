// app/order-success.tsx
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import StoreLocationCard from "@/components/StoreLocationCard"; 

export default function OrderSuccess() {
    const router = useRouter();

    return (
        <View className="flex-1 bg-black px-6 pt-20">
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Success Icon */}
                <View className="items-center mb-8">
                    <View className="w-24 h-24 bg-[#B4F05F] rounded-full items-center justify-center mb-6">
                        <Ionicons name="checkmark" size={48} color="black" />
                    </View>
                    <Text className="text-3xl font-black text-white text-center mb-2">Booking Confirmed!</Text>
                    <Text className="text-[#999999] text-center">Your gear is ready.</Text>
                </View>

                {/* Map Section (Reusable) */}
                <StoreLocationCard />

                <View className="bg-[#1A1A1A] p-6 rounded-2xl border border-white/5 mb-8">
                    <Text className="text-white font-bold mb-2">Next Steps:</Text>
                    <Text className="text-[#999999] text-sm leading-5">
                        Please visit our store with your ID card to pick up your gear.
                        Show your "My Rentals" QR code at the counter.
                    </Text>
                </View>
            </ScrollView>

            <View className="pb-10">
                <TouchableOpacity 
                    onPress={() => router.replace("/(dashboard)/rentals")}
                    className="bg-[#B4F05F] w-full py-5 rounded-[24px] items-center"
                >
                    <Text className="font-black text-lg uppercase">Go to My Rentals</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}