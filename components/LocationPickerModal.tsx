import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, Modal, TextInput, FlatList, TouchableOpacity,
    ActivityIndicator, Dimensions, Keyboard, Alert
} from 'react-native';
import MapView, { Region } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.005; // Zoom Level
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

    // Map States
    const mapRef = useRef<MapView>(null);
    const [selectedLocation, setSelectedLocation] = useState<any>(null);
    const [region, setRegion] = useState<Region | undefined>(undefined);
    const [gpsLoading, setGpsLoading] = useState(false);

    // --- 1. SEARCH LOGIC (OpenStreetMap - Free) ---
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
                { headers: { 'User-Agent': 'GearUpApp/1.0' } }
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
        setLoading(true);
        try {
            // Permission Request
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Permission to access location was denied');
                setGpsLoading(false);
                return;
            }

            // Get Coordinates
            let location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;

            // Reverse Geocoding (OSM)
            // We use the reverse API endpoint to get address details from lat/lon
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
                { headers: { 'User-Agent': 'GearUpApp/1.0' } }
            );
            const data = await response.json();

            // Use the handleSelectResult logic to process this data
            // We construct an object similar to the search result format
            handleSelectResult({
                lat: latitude,
                lon: longitude,
                display_name: data.display_name,
                address: data.address
            });

        } catch (error) {
            Alert.alert("Error", "Could not fetch current location. Please check your GPS settings.");
            console.error(error);
        } finally {
            setGpsLoading(false);
        }
    }

    // --- 2. LIST ITEM SELECT ---
    const handleSelectResult = (item: any) => {
        Keyboard.dismiss();
        const lat = parseFloat(item.lat);
        const lng = parseFloat(item.lon);

        const city = item.address?.city || item.address?.town || item.address?.village || item.address?.suburb || "Unknown City";

        const locationData = {
            address: item.display_name, // Full Address
            city: city,                 // Short Name (e.g., Malabe)
            lat: lat,
            lng: lng
        };

        setSelectedLocation(locationData);

        setRegion({
            latitude: lat,
            longitude: lng,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        });

        setStep('map');
    };

    // --- 3. CONFIRMATION ---
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
            <View className="flex-1 bg-white">

                {/* --- HEADER --- */}
                <View className="flex-row justify-between items-center px-5 pt-6 pb-4 bg-white z-10 border-b border-gray-100">
                    <Text className="text-xl font-bold text-slate-900">
                        {step === 'search' ? 'Find Location' : 'Confirm Pin'}
                    </Text>
                    <TouchableOpacity onPress={() => { onClose(); resetState(); }} className="bg-gray-100 p-2 rounded-full">
                        <Ionicons name="close" size={24} color="black" />
                    </TouchableOpacity>
                </View>

                {/* ================= STEP 1: SEARCH VIEW ================= */}
                {step === 'search' && (
                    <View className="flex-1 px-5 pt-4">
                        {/* Search Input */}
                        <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-4 h-12 mb-4">
                            <Ionicons name="search" size={20} color="#64748B" />
                            <TextInput
                                className="flex-1 ml-3 text-slate-900 text-base"
                                placeholder="Search city (e.g. Nugegoda)"
                                value={query}
                                onChangeText={setQuery}
                                autoFocus={true}
                                placeholderTextColor="#94A3B8"
                            />
                            {loading && <ActivityIndicator size="small" color="#0F172A" />}
                        </View>

                        {/* --- NEW: USE CURRENT LOCATION BUTTON --- */}
                        <TouchableOpacity
                            onPress={getCurrentLocation}
                            disabled={gpsLoading}
                            className="flex-row items-center py-3 mb-2 active:opacity-60"
                        >
                            <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center mr-3">
                                {gpsLoading ? (
                                    <ActivityIndicator size="small" color="#3B82F6" />
                                ) : (
                                    <Ionicons name="navigate" size={20} color="#3B82F6" />
                                )}
                            </View>
                            <View>
                                <Text className="text-slate-900 font-bold text-sm">Use my current location</Text>
                                <Text className="text-slate-400 text-xs">Using GPS</Text>
                            </View>
                        </TouchableOpacity>

                        {/* Divider */}
                        <View className="h-[1px] bg-slate-100 mb-2" />

                        {/* Results List */}
                        <FlatList
                            data={results}
                            keyExtractor={(item) => item.place_id.toString()}
                            keyboardShouldPersistTaps="handled"
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => handleSelectResult(item)}
                                    className="flex-row items-center py-4 border-b border-slate-50 active:bg-slate-50"
                                >
                                    <View className="bg-slate-100 p-2.5 rounded-full mr-3">
                                        <Ionicons name="location" size={20} color="#475569" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="font-bold text-slate-800 text-sm">
                                            {item.name || item.display_name.split(',')[0]}
                                        </Text>
                                        <Text className="text-slate-500 text-xs mt-0.5" numberOfLines={2}>
                                            {item.display_name}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={() => (
                                !loading && query.length > 2 ? (
                                    <Text className="text-center text-slate-400 mt-10">No results found</Text>
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
                        />

                        {/* CENTER PIN (Static Overlay) */}
                        <View className="absolute top-1/2 left-1/2 -mt-9 -ml-5 pointer-events-none items-center justify-center">
                            <Ionicons name="location" size={40} color="#EF4444" />
                            {/* Pin Shadow */}
                            <View className="w-3 h-3 bg-black/20 rounded-full mt-[-5px]" />
                        </View>

                        {/* Back Button */}
                        <TouchableOpacity
                            onPress={() => setStep('search')}
                            className="absolute top-4 left-4 bg-white p-3 rounded-full shadow-md z-10"
                        >
                            <Ionicons name="arrow-back" size={24} color="black" />
                        </TouchableOpacity>

                        {/* Footer Card */}
                        <View className="absolute bottom-0 w-full bg-white p-6 rounded-t-3xl shadow-2xl">
                            <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                Selected Location
                            </Text>
                            <Text className="text-slate-900 font-bold text-lg leading-tight mb-6" numberOfLines={2}>
                                {selectedLocation?.address}
                            </Text>

                            <TouchableOpacity
                                onPress={handleConfirm}
                                className="bg-slate-900 py-4 rounded-xl items-center shadow-md active:scale-95 transition-all"
                            >
                                <Text className="text-white font-bold text-lg">Confirm Location</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

            </View>
        </Modal>
    );
}