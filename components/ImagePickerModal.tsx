import React from 'react';
import {
    View,
    Text,
    Modal,
    Pressable,
    TouchableOpacity,
    StyleSheet,
    ViewStyle
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";

interface ImagePickerModalProps {
    isVisible: boolean;
    onClose: () => void;
    onCameraPress: () => void;
    onGalleryPress: () => void;
}

interface Styles {
    overlay: ViewStyle;
}

const ImagePickerModal = ({ isVisible, onClose, onCameraPress, onGalleryPress }: ImagePickerModalProps) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            {/* Using Pressable for the backdrop to close on outside tap */}
            <Pressable style={styles.overlay} onPress={onClose}>

                {/* Modal Container: Stopping propagation to prevent clicks inside from closing the modal */}
                <Pressable
                    style={{ backgroundColor: '#000000', borderColor: '#1A1A1A' }}
                    className="absolute bottom-0 w-full rounded-t-[40px] p-8 pb-12 border-t shadow-2xl"
                    onPress={(e) => e.stopPropagation()}
                >
                    {/* Handle Bar (Modern Design Element) */}
                    <View className="w-full items-center mb-6">
                        <View className="w-12 h-1.5 bg-[#333333] rounded-full" />
                    </View>

                    <Text className="text-2xl font-black text-white mb-8 text-center tracking-tight">
                        Upload Photo
                    </Text>

                    <View className="flex-row justify-around">
                        {/* Camera Button */}
                        <TouchableOpacity
                            onPress={() => { onCameraPress(); onClose(); }}
                            activeOpacity={0.8}
                            className="items-center gap-3"
                        >
                            <View
                                style={{ backgroundColor: '#1A1A1A', borderColor: '#2A2A2A' }}
                                className="w-20 h-20 rounded-[24px] items-center justify-center border shadow-lg"
                            >
                                <Ionicons name="camera" size={32} color="#B4F05F" />
                            </View>
                            <Text className="font-black text-[#999999] uppercase text-[10px] tracking-[2px]">
                                Camera
                            </Text>
                        </TouchableOpacity>

                        {/* Gallery Button */}
                        <TouchableOpacity
                            onPress={() => { onGalleryPress(); onClose(); }}
                            activeOpacity={0.8}
                            className="items-center gap-3"
                        >
                            <View
                                style={{ backgroundColor: '#1A1A1A', borderColor: '#2A2A2A' }}
                                className="w-20 h-20 rounded-[24px] items-center justify-center border shadow-lg"
                            >
                                <Ionicons name="images" size={32} color="#B4F05F" />
                            </View>
                            <Text className="font-black text-[#999999] uppercase text-[10px] tracking-[2px]">
                                Gallery
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Cancel Button */}
                    <TouchableOpacity
                        onPress={onClose}
                        style={{ backgroundColor: '#1A1A1A' }}
                        className="mt-10 py-5 rounded-2xl items-center border border-white/5"
                    >
                        <Text className="font-black text-white uppercase tracking-widest text-xs">
                            Cancel
                        </Text>
                    </TouchableOpacity>

                </Pressable>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create<Styles>({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'flex-end', // Corrected from 'end'
    }
});

export default ImagePickerModal;