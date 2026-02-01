import React from 'react';
import { View, Text, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur'; // Optional: if installed, else use View with opacity

interface AdminModalProps {
    isVisible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName: string;
    loading: boolean;
}

const AdminActionModal = ({ isVisible, onClose, onConfirm, itemName, loading }: AdminModalProps) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/80 justify-center items-center px-6">
                <View className="bg-[#1A1A1A] w-full p-6 rounded-[30px] border border-[#333333]">

                    {/* Header Icon */}
                    <View className="items-center mb-4">
                        <View className="w-16 h-16 bg-[#B4F05F]/10 rounded-full items-center justify-center mb-3">
                            <Ionicons name="shield-checkmark" size={32} color="#B4F05F" />
                        </View>
                        <Text className="text-white text-lg font-black uppercase tracking-wider">
                            Admin Action
                        </Text>
                        <Text className="text-[#666666] text-xs font-bold uppercase mt-1">
                            Developer Mode
                        </Text>
                    </View>

                    {/* Content */}
                    <Text className="text-[#999999] text-center mb-8 font-medium leading-5">
                        Are you sure you want to mark <Text className="text-white font-bold">{"\""}{itemName}{"\""}</Text> as returned?
                        {'\n'}This will update the stock count immediately.
                    </Text>

                    {/* Buttons */}
                    <View className="gap-3">
                        <TouchableOpacity
                            onPress={onConfirm}
                            disabled={loading}
                            className="bg-[#B4F05F] py-4 rounded-xl items-center flex-row justify-center gap-2"
                        >
                            {loading ? (
                                <ActivityIndicator color="black" />
                            ) : (
                                <>
                                    <Ionicons name="checkmark-circle" size={20} color="black" />
                                    <Text className="text-black font-black uppercase text-sm">Confirm Return</Text>
                                </>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={onClose}
                            disabled={loading}
                            className="bg-[#333333] py-4 rounded-xl items-center"
                        >
                            <Text className="text-white font-bold uppercase text-sm">Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default AdminActionModal;