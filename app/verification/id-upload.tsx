import {View, Text, Alert, Image, TouchableOpacity, ScrollView} from 'react-native'
import React, { useState } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import { useLoader } from "@/hooks/useLoader";
import {SafeAreaView} from "react-native-safe-area-context";
import {Ionicons} from "@expo/vector-icons";
import ImagePickerModal from "@/components/ImagePickerModal";
import Toast from "react-native-toast-message";

const IdUpload = () => {
    const router = useRouter()
    const params = useLocalSearchParams();
    const { showLoader, hideLoader } = useLoader();

    const [frontImage, setFrontImage] = useState<string | null>(null);
    const [backImage, setBackImage] = useState<string | null>(null);

    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedSide, setSelectedSide] = useState<'front' | 'back' | null>(null);

    const handleUploadRequest = (side: 'front' | 'back') => {
        setSelectedSide(side);
        setModalVisible(true);
    }

    const handleCameraPress = () => {
        if (selectedSide) {
            openCamera(selectedSide);
        }
        setModalVisible(false);
    };

    const handleGalleryPress = () => {
        if (selectedSide) {
            openImageLibrary(selectedSide);
        }
        setModalVisible(false);
    };

    const openCamera = async(side: 'front' | 'back') => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (permissionResult.granted === false) {
            Toast.show({
                type: 'error', 
                text1: 'Permission Denied',
                text2: 'Camera access is required to take photos 📸',
                position: 'bottom',
                visibilityTime: 4000,
            });
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8

        })

        handleImageResult(result, side);
    }

    const openImageLibrary = async(side: 'front' | 'back') => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8
        })

        handleImageResult(result, side);
    }

    const handleImageResult = (result: ImagePicker.ImagePickerResult, side: 'front' | 'back') => {
        if (!result.canceled) {
            showLoader();

            setTimeout(() => {
                if (side === 'front') {
                    setFrontImage(result.assets[0].uri);
                } else {
                    setBackImage(result.assets[0].uri);
                }
                hideLoader()
            }, 1000);

        }


    }

    const handleSubmit = () => {
        if (!frontImage || !backImage) {
            Alert.alert("Incomplete", "Please upload both front and back sides of your ID.");
            return;
        }

        showLoader();

        setTimeout(() => {
            hideLoader();
            router.replace({
                pathname: "/checkout",
                params: params
            });
        }, 1500);
    };


    return (
        <SafeAreaView className={"flex-1 gb-white"}>
            <View className={"px-5 py-4 border-b border-gray-100 flex-row items-center"}>
                <TouchableOpacity onPress={() => router.back()} className={"p-2 -ml-2"}>
                    <Ionicons name="close" size={24} color="black" />

                </TouchableOpacity>
                <Text className="text-lg font-bold ml-2 font-sans">Verify Identity</Text>

            </View>

            <ScrollView className={"flex-1 px-5 pt-6"}>
                <Text className={"text-2xl font-bold text-slate-900 mb-2 font-sans"}></Text>
                <Text className="text-slate-500 mb-8 font-sans">
                    To ensure the safety of our gear, we need to verify your government-issued ID (NIC/Driving License).
                </Text>

                {/* --- FRONT SIDE --- */}
                <Text className="font-bold text-slate-900 mb-3">Front Side</Text>
                <TouchableOpacity
                    onPress={() => handleUploadRequest('front')}
                    className="w-full h-48 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl items-center justify-center mb-6 overflow-hidden relative"
                >
                    {frontImage ? (
                        <>
                            <Image source={{ uri: frontImage }} className="w-full h-full" resizeMode="cover" />
                            <View className="absolute bottom-0 w-full bg-black/50 py-1 items-center">
                                <Text className="text-white text-xs font-bold">Tap to change</Text>
                            </View>
                        </>
                    ) : (
                        <View className="items-center">
                            <Ionicons name="camera-outline" size={32} color="#94A3B8" />
                            <Text className="text-slate-400 mt-2 font-bold">Tap to scan front</Text>
                        </View>
                    )}
                </TouchableOpacity>

                {/* --- BACK SIDE --- */}
                <Text className="font-bold text-slate-900 mb-3">Back Side</Text>
                <TouchableOpacity
                    onPress={() => handleUploadRequest('back')}
                    className="w-full h-48 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl items-center justify-center mb-8 overflow-hidden relative"
                >
                    {backImage ? (
                        <>
                            <Image source={{ uri: backImage }} className="w-full h-full" resizeMode="cover" />
                            <View className="absolute bottom-0 w-full bg-black/50 py-1 items-center">
                                <Text className="text-white text-xs font-bold">Tap to change</Text>
                            </View>
                        </>
                    ) : (
                        <View className="items-center">
                            <Ionicons name="camera-outline" size={32} color="#94A3B8" />
                            <Text className="text-slate-400 mt-2 font-bold">Tap to scan back</Text>
                        </View>
                    )}
                </TouchableOpacity>

            </ScrollView>

            {/* Footer */}
            <View className="p-5 border-t border-gray-100 bg-white">
                <TouchableOpacity
                    onPress={handleSubmit}
                    className={`w-full py-4 rounded-xl items-center flex-row justify-center gap-2 ${frontImage && backImage ? 'bg-slate-900' : 'bg-gray-300'}`}
                    disabled={!frontImage || !backImage}
                >
                    <Text className="text-white font-bold text-lg">Submit & Continue</Text>
                </TouchableOpacity>
            </View>

            <ImagePickerModal
                isVisible={isModalVisible}
                onClose={() => setModalVisible(false)}
                onCameraPress={handleCameraPress}
                onGalleryPress={handleGalleryPress}
            />
        </SafeAreaView>
    )
}
export default IdUpload
