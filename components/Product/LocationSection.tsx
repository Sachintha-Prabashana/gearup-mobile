import React from 'react';
import { View, Text, Platform, TouchableOpacity, Linking, Dimensions } from 'react-native';
import MapView, { Marker, UrlTile } from "react-native-maps";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const ModernDarkLocationView = () => {
    // Shop Configuration
    const shopConfig = {
        name: "GearUp HQ",
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
        <View className="mb-8 px-5">
            {/* Header Section */}
            <View className="mb-4">
                <Text className="text-[18px] font-bold text-slate-900 tracking-tight">
                    Pick-up Location
                </Text>
                <View className="flex-row items-center mt-1">
                    <Ionicons name="location-outline" size={14} color="#64748B" />
                    <Text className="text-slate-500 text-[13px] font-medium ml-1">
                        Colombo 07 • Open 9AM - 6PM
                    </Text>
                </View>
            </View>

            {/* Modern Map Card - Dark Theme */}
            <View
                className="w-full h-[250px] bg-slate-900 rounded-[24px] overflow-hidden relative shadow-2xl shadow-slate-300 border border-slate-200"
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
                    // Android වලදී Google logo එක අයින් කරන්න 'none' දානවා
                    mapType={Platform.OS === 'android' ? 'none' : 'standard'}
                >
                    {/* 👇 වෙනස්කම මෙන්න: Premium Dark Mode Tiles 👇 */}
                    <UrlTile
                        urlTemplate="https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png"
                        maximumZ={19}
                        flipY={false}
                    />

                    {/* Premium Custom Marker (High Contrast) */}
                    <Marker
                        coordinate={{ latitude: shopConfig.latitude, longitude: shopConfig.longitude }}
                    >
                        <View className="items-center justify-center">
                            {/* Outer Glow Effect */}
                            <View className="bg-white/20 p-2 rounded-full">
                                {/* Thick White Border for Contrast */}
                                <View className="bg-white p-1 rounded-full shadow-lg">
                                    {/* Main Icon Circle (Slate 900 to match dark theme) */}
                                    <View className="bg-slate-900 w-11 h-11 rounded-full items-center justify-center border border-slate-800">
                                        <MaterialCommunityIcons name="storefront" size={22} color="white" />
                                    </View>
                                </View>
                            </View>
                            {/* Tail */}
                            <View className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-white -mt-0.5 shadow-sm" />
                        </View>
                    </Marker>
                </MapView>

                {/* Floating Glass Card - Bottom */}
                <View className="absolute bottom-4 left-4 right-4">
                    <TouchableOpacity
                        onPress={openMaps}
                        activeOpacity={0.9}
                        // මෙතනත් පොඩි වෙනසක් කළා Dark theme එකට ගැලපෙන්න
                        className="flex-row items-center justify-between bg-slate-900/90 px-4 py-3.5 rounded-2xl shadow-lg border border-slate-800/50 backdrop-blur-md"
                    >
                        <View className="flex-row items-center gap-3">
                            <View className="w-10 h-10 bg-slate-800 rounded-full items-center justify-center border border-slate-700">
                                <Ionicons name="navigate" size={18} color="white" />
                            </View>
                            <View>
                                <Text className="text-white font-bold text-[14px]">Get Directions</Text>
                                <Text className="text-slate-400 text-[11px] font-medium">Tap to open Maps</Text>
                            </View>
                        </View>

                        <View className="bg-white px-3 py-1.5 rounded-lg">
                            <Ionicons name="arrow-forward" size={16} color="#0F172A" />
                        </View>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    )
}

export default ModernDarkLocationView;