import React from 'react';
import { View, Text, Image, TouchableOpacity, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const StoreLocationCard = () => {

    const handleGetDirections = () => {
        const lat = 6.8851; 
        const lng = 79.8654;
        const label = "GearUp Colombo Store";
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${lat},${lng}`;
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });
        if (url) Linking.openURL(url);
    };

    return (
        <View className="mb-6">
            <Text className="text-xl font-black text-white mb-4">Pickup Location</Text>
            
            <TouchableOpacity 
                onPress={handleGetDirections}
                activeOpacity={0.9}
                className="rounded-2xl overflow-hidden bg-[#1A1A1A] border border-white/5 relative"
            >
                {/* Map Image */}
                <Image 
                    source={{ uri: "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600&auto=format&fit=crop" }} 
                    className="w-full h-40 opacity-70"
                    resizeMode="cover"
                />

                {/* Overlay Info */}
                <View className="absolute bottom-0 left-0 right-0 p-4 bg-black/90 flex-row items-center gap-4">
                    <View className="w-12 h-12 bg-[#B4F05F] rounded-full items-center justify-center">
                        <Ionicons name="storefront" size={22} color="black" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-white font-bold text-base">GearUp Main Store</Text>
                        <Text className="text-[#999999] text-xs font-medium mt-0.5">No. 24, Havelock Road, Colombo 05</Text>
                        <View className="flex-row items-center gap-2 mt-1.5">
                            <View className="bg-[#B4F05F] px-1.5 py-0.5 rounded">
                                <Text className="text-black text-[10px] font-black uppercase">Open</Text>
                            </View>
                            <Text className="text-[#999999] text-[10px] font-bold">9:00 AM - 8:00 PM</Text>
                        </View>
                    </View>
                    
                    {/* Direction Icon */}
                    <View className="w-10 h-10 bg-[#1A1A1A] rounded-full items-center justify-center border border-white/20">
                        <Ionicons name="navigate" size={20} color="#B4F05F" />
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default StoreLocationCard;