import React from 'react';
import { View, Text, Platform, TouchableOpacity, Linking } from 'react-native';
import MapView, { Marker, UrlTile} from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";

const LocationSection = () => {
    const shopLocation = {
        latitude: 6.9128,
        longitude: 79.8654,
        latitudeDelta: 0.005, // Zoom level
        longitudeDelta: 0.005,
    }

    const openGoogleMaps = () => {
        const label = 'GearUp Store';
        const lat = shopLocation.latitude;
        const lng = shopLocation.longitude;

        const url = Platform.select({
            ios: `maps:0,0?q=${label}@${lat},${lng}`, // Apple Maps
            android: `geo:0,0?q=${lat},${lng}(${label})` // Google Maps App
        });

        if (url) {
            Linking.openURL(url);
        }

    }

    return (
        <View className={"mb-8"}>
            <Text className={"text-lg font-bold text-slate-900 mb-1"}>
                Pick-up Location
            </Text>
            <Text className={"text-slate-500 font-sans mb-4"}>
                GearUp Store, Colombo 07
            </Text>

            <View className={"w-full h-52 bg-gray-100 rounded-2xl overflow-hidden relative border border-slate-200"}>
                <MapView
                    style={{ width: '100%', height: '100%' }}
                    initialRegion={shopLocation}
                    mapType={Platform.OS === 'android' ? 'none' : 'standard'}
                    rotateEnabled={false}
                    zoomEnabled={true}
                    scrollEnabled={true}
                >
                    <UrlTile
                        urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        maximumZ={19}
                        flipY={false}
                    />

                    <Marker
                        coordinate={shopLocation}
                        title="GearUp Store"

                    >
                        {/* Custom Marker Icon */}
                        <View className="bg-[#FF385C] p-2 rounded-full border-2 border-white shadow-sm">
                            <Ionicons name="storefront" size={16} color="white" />
                        </View>

                    </Marker>

                </MapView>
                <TouchableOpacity
                    className={"absolute bottom-3 right-3 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200 flex-row items-center gap-1"}
                    activeOpacity={0.8}
                    onPress={openGoogleMaps}

                >
                    <Text className="text-xs font-bold text-slate-900 font-sans">Open Maps</Text>
                    <Ionicons name="arrow-redo-outline" size={14} color="black" />

                </TouchableOpacity>

            </View>
        </View>
    )
}

export default LocationSection;