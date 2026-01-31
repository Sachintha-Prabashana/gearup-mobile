import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, Modal, TextInput, FlatList, TouchableOpacity,
    ActivityIndicator, Dimensions, Keyboard, Alert, StyleSheet
} from 'react-native';
import MapView, { Region, UrlTile } from 'react-native-maps'; // Added UrlTile for dark maps
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.005;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

interface LocationPickerProps {
    isVisible: boolean;
    onClose: () => void;
    onConfirm: (location: { address: string; city: string; lat: number; lng: number }) => void;
}

export default function LocationPickerModal({ isVisible, onClose, onConfirm }: LocationPickerProps) {
    const [step, setStep] = useState<'search' | 'map'>('search');
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const mapRef = useRef<MapView>(null);
    const [selectedLocation, setSelectedLocation] = useState<any>(null);
    const [region, setRegion] = useState<Region | undefined>(undefined);
    const [gpsLoading, setGpsLoading] = useState(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query.length > 2) searchPlaces();
        }, 800);
        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const searchPlaces = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5&countrycodes=lk`,
                { headers: { 'User-Agent': 'GearUp/1.0' } }
            );
            const data = await response.json();
            setResults(data);
        } catch (error) {
            console.error("Search Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const getCurrentLocation = async () => {
        setGpsLoading(true);
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'GearUp needs location access to find gear near you.');
                setGpsLoading(false);
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;

            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
                { headers: { 'User-Agent': 'GearUp/1.0' } }
            );
            const data = await response.json();

            handleSelectResult({
                lat: latitude,
                lon: longitude,
                display_name: data.display_name,
                address: data.address
            });

        } catch (error) {
            Alert.alert("GPS Error", "Could not fetch current location.");
        } finally {
            setGpsLoading(false);
        }
    }

    const handleSelectResult = (item: any) => {
        Keyboard.dismiss();
        const lat = parseFloat(item.lat);
        const lng = parseFloat(item.lon);
        const city = item.address?.city || item.address?.town || item.address?.village || item.address?.suburb || "Colombo";

        setSelectedLocation({
            address: item.display_name,
            city: city,
            lat: lat,
            lng: lng
        });

        setRegion({
            latitude: lat,
            longitude: lng,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        });

        setStep('map');
    };

    const handleConfirm = () => {
        if (selectedLocation && region) {
            onConfirm({
                ...selectedLocation,
                lat: region.latitude,
                lng: region.longitude
            });
            onClose();
            resetState();
        }
    };

    const resetState = () => {
        setStep('search');
        setQuery('');
        setResults([]);
    };

    return (
        <Modal visible={isVisible} animationType="slide" presentationStyle="pageSheet">
            <View style={{ flex: 1, backgroundColor: '#000000' }}>
                <StatusBar style="light" />

                {/* --- HEADER --- */}
                <View style={{ borderBottomWidth: 1, borderBottomColor: '#1A1A1A' }} className="flex-row justify-between items-center px-6 pt-8 pb-4 bg-black">
                    <Text className="text-2xl font-black text-white tracking-tighter">
                        {step === 'search' ? 'Location' : 'Confirm'}
                    </Text>
                    <TouchableOpacity onPress={() => { onClose(); resetState(); }} className="bg-[#1A1A1A] p-2 rounded-full border border-white/5">
                        <Ionicons name="close" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                {/* ================= STEP 1: SEARCH VIEW ================= */}
                {step === 'search' && (
                    <View className="flex-1 px-6 pt-6">
                        {/* Search Input */}
                        <View style={{ backgroundColor: '#1A1A1A', borderColor: '#2A2A2A' }} className="flex-row items-center border rounded-2xl px-4 h-14 mb-6">
                            <Ionicons name="search" size={20} color="#666666" />
                            <TextInput
                                className="flex-1 ml-3 text-white text-base font-bold"
                                placeholder="Search city or street..."
                                value={query}
                                onChangeText={setQuery}
                                autoFocus={true}
                                placeholderTextColor="#444444"
                            />
                            {loading && <ActivityIndicator size="small" color="#B4F05F" />}
                        </View>

                        {/* USE CURRENT LOCATION BUTTON */}
                        <TouchableOpacity
                            onPress={getCurrentLocation}
                            disabled={gpsLoading}
                            className="flex-row items-center py-4 px-2 mb-4 bg-[#B4F05F10] rounded-2xl border border-[#B4F05F20]"
                        >
                            <View className="w-10 h-10 bg-[#B4F05F] rounded-full items-center justify-center mr-4">
                                {gpsLoading ? (
                                    <ActivityIndicator size="small" color="black" />
                                ) : (
                                    <Ionicons name="navigate" size={20} color="black" />
                                )}
                            </View>
                            <View>
                                <Text className="text-[#B4F05F] font-black uppercase text-xs tracking-widest">Current Location</Text>
                                <Text className="text-[#666666] text-xs font-bold">Use GPS to find gear nearby</Text>
                            </View>
                        </TouchableOpacity>

                        {/* Results List */}
                        <FlatList
                            data={results}
                            keyExtractor={(item) => item.place_id.toString()}
                            keyboardShouldPersistTaps="handled"
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => handleSelectResult(item)}
                                    className="flex-row items-center py-5 border-b border-white/5 active:bg-[#1A1A1A] rounded-xl px-2"
                                >
                                    <View className="bg-[#1A1A1A] p-3 rounded-full mr-4 border border-white/5">
                                        <Ionicons name="location-outline" size={20} color="#B4F05F" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="font-bold text-white text-base">
                                            {item.name || item.display_name.split(',')[0]}
                                        </Text>
                                        <Text className="text-[#666666] text-xs font-bold mt-1" numberOfLines={1}>
                                            {item.display_name}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={() => (
                                !loading && query.length > 2 ? (
                                    <Text className="text-center text-[#666666] mt-10 font-bold">
                                        {`No results for "${query}"`}
                                    </Text>
                                ) : null
                            )}
                        />
                    </View>
                )}

                {/* ================= STEP 2: MAP CONFIRMATION ================= */}
                {step === 'map' && region && (
                    <View className="flex-1 relative">
                        <MapView
                            ref={mapRef}
                            style={{ flex: 1 }}
                            initialRegion={region}
                            onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
                        >
                            {/* Dark Map Tiles Overlay */}
                            <UrlTile
                                urlTemplate="https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png"
                                maximumZ={19}
                                flipY={false}
                            />
                        </MapView>

                        {/* CENTER PIN (CamMart Neon Pin) */}
                        <View className="absolute top-1/2 left-1/2 -mt-10 -ml-5 pointer-events-none items-center justify-center">
                            <View className="bg-[#B4F05F]/20 p-2 rounded-full border border-[#B4F05F]/30">
                                <Ionicons name="location" size={40} color="#B4F05F" />
                            </View>
                            <View className="w-4 h-1.5 bg-black/40 rounded-full mt-[-2px]" />
                        </View>

                        {/* Back Button */}
                        <TouchableOpacity
                            onPress={() => setStep('search')}
                            className="absolute top-6 left-6 bg-[#1A1A1A] p-3 rounded-2xl border border-white/10 shadow-2xl"
                        >
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>

                        {/* Footer Card */}
                        <View style={{ backgroundColor: '#000000E0' }} className="absolute bottom-0 w-full p-8 rounded-t-[40px] border-t border-white/10 shadow-2xl backdrop-blur-xl">
                            <Text className="text-[10px] font-black text-[#B4F05F] uppercase tracking-[3px] mb-3">
                                Pin Location
                            </Text>
                            <Text className="text-white font-bold text-lg leading-tight mb-8" numberOfLines={2}>
                                {selectedLocation?.address}
                            </Text>

                            <TouchableOpacity
                                onPress={handleConfirm}
                                style={{ backgroundColor: '#B4F05F' }}
                                className="py-5 rounded-2xl items-center active:scale-95 shadow-lg shadow-[#B4F05F]/20"
                            >
                                <Text className="text-black font-black uppercase tracking-widest text-base">Confirm Location</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        </Modal>
    );
}