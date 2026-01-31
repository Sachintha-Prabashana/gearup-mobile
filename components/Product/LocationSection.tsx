import React from 'react';
import { View, Text, Platform, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import MapView, { Marker, UrlTile } from "react-native-maps";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const LocationSection = () => {
    // Shop Configuration (Matching your Colombo context)
    const shopConfig = {
        name: "CamMart HQ",
        address: "No 123, Reid Avenue, Colombo 07",
        latitude: 6.9128,
        longitude: 79.8654,
    };

    const openMaps = () => {
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${shopConfig.latitude},${shopConfig.longitude}`;
        const label = shopConfig.name;
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });
        if (url) Linking.openURL(url);
    };

    return (
        <View className="mb-10">
            {/* Header Section */}
            <View className="mb-5">
                <Text className="text-[20px] font-black text-white tracking-tight">
                    Pick-up Location
                </Text>
                <View className="flex-row items-center mt-1.5">
                    <Ionicons name="time-outline" size={14} color="#B4F05F" />
                    <Text className="text-[#666666] text-[13px] font-bold ml-1.5 uppercase tracking-widest">
                        Colombo 07 • 09:00 AM - 06:00 PM
                    </Text>
                </View>
            </View>

            {/* Modern Map Card - CamMart Dark Theme */}
            <View
                style={{ borderColor: '#2A2A2A' }}
                className="w-full h-[280px] bg-[#1A1A1A] rounded-[32px] overflow-hidden relative border shadow-2xl"
            >
                <MapView
                    style={{ width: '100%', height: '100%' }}
                    initialRegion={{
                        latitude: shopConfig.latitude,
                        longitude: shopConfig.longitude,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005,
                    }}
                    scrollEnabled={false}
                    zoomEnabled={false}
                    rotateEnabled={false}
                    pitchEnabled={false}
                    mapType={Platform.OS === 'android' ? 'none' : 'standard'}
                >
                    {/* 👇 Dark Mode Tile Overlay 👇 */}
                    <UrlTile
                        urlTemplate="https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png"
                        maximumZ={19}
                        flipY={false}
                    />

                    {/* Premium Neon Lime Marker */}
                    <Marker
                        coordinate={{ latitude: shopConfig.latitude, longitude: shopConfig.longitude }}
                    >
                        <View className="items-center justify-center">
                            {/* Outer Glow */}
                            <View className="bg-[#B4F05F]/20 p-2 rounded-full">
                                {/* Border Ring */}
                                <View className="bg-white p-0.5 rounded-full shadow-lg">
                                    {/* Main Icon Circle */}
                                    <View className="bg-black w-12 h-12 rounded-full items-center justify-center border-2 border-[#B4F05F]">
                                        <MaterialCommunityIcons name="camera-iris" size={24} color="#B4F05F" />
                                    </View>
                                </View>
                            </View>
                            {/* Marker Pointer */}
                            <View className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-white -mt-1" />
                        </View>
                    </Marker>
                </MapView>

                {/* Floating Navigation Card */}
                <View className="absolute bottom-5 left-5 right-5">
                    <TouchableOpacity
                        onPress={openMaps}
                        activeOpacity={0.9}
                        style={{ backgroundColor: '#000000D0', borderColor: '#B4F05F40' }}
                        className="flex-row items-center justify-between px-5 py-4 rounded-[24px] border backdrop-blur-xl"
                    >
                        <View className="flex-row items-center gap-4">
                            <View className="w-11 h-11 bg-[#B4F05F] rounded-full items-center justify-center shadow-lg shadow-[#B4F05F]/40">
                                <Ionicons name="navigate" size={20} color="black" />
                            </View>
                            <View>
                                <Text className="text-white font-black text-[15px] uppercase tracking-wider">Get Directions</Text>
                                <Text className="text-[#666666] text-[11px] font-bold">{shopConfig.address}</Text>
                            </View>
                        </View>

                        <View className="bg-white/10 w-8 h-8 rounded-full items-center justify-center">
                            <Ionicons name="chevron-forward" size={18} color="#B4F05F" />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default LocationSection;