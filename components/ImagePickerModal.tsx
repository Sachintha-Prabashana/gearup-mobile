import {View, Text, Modal, Pressable, TouchableOpacity} from 'react-native'
import React from 'react'
import {Ionicons} from "@expo/vector-icons";

interface ImagePickerModalProps {
    isVisible: boolean
    onClose: () => void
    onCameraPress: () => void
    onGalleryPress: () => void
}

const ImagePickerModal = ({ isVisible, onClose, onCameraPress, onGalleryPress }:ImagePickerModalProps ) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <Pressable className={"flex-1 bg-black/50"} onPress={onClose}>
                <Pressable className={"bg-white absolute bottom-0 w-full rounded-t-3xl p-6 pb-10 shadow-xl"} onPress={(e) => e.stopPropagation()}>
                    {/* Handle Bar (Design Element) */}
                    <View className="w-full items-center mb-4">
                        <View className="w-12 h-1.5 bg-gray-300 rounded-full" />
                    </View>

                    <Text className="text-xl font-bold text-slate-900 mb-6 text-center font-sans">
                        Upload Photo
                    </Text>

                    <View className={"flex-row justify-around"}>
                        {/* Camera Button */}
                        <TouchableOpacity
                            onPress={() => { onCameraPress(); onClose(); }}
                            className="items-center gap-2"
                        >
                            <View className="w-16 h-16 bg-gray-100 rounded-2xl items-center justify-center border border-gray-200">
                                <Ionicons name="camera" size={30} color="#FF385C" />
                            </View>
                            <Text className="font-medium text-slate-700 font-sans">Camera</Text>
                        </TouchableOpacity>

                        {/* Gallery Button */}
                        <TouchableOpacity
                            onPress={() => { onGalleryPress(); onClose(); }}
                            className="items-center gap-2"
                        >
                            <View className="w-16 h-16 bg-gray-100 rounded-2xl items-center justify-center border border-gray-200">
                                <Ionicons name="images" size={30} color="#FF385C" />
                            </View>
                            <Text className="font-medium text-slate-700 font-sans">Gallery</Text>
                        </TouchableOpacity>

                    </View>
                    {/* Cancel Button */}
                    <TouchableOpacity
                        onPress={onClose}
                        className="mt-8 bg-gray-100 py-4 rounded-xl items-center"
                    >
                        <Text className="font-bold text-slate-900 font-sans">Cancel</Text>
                    </TouchableOpacity>

                </Pressable>

            </Pressable>
        </Modal>
    )
}
export default ImagePickerModal
