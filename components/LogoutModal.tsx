import React from 'react';
import { View, Text, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// import { BlurView } from 'expo-blur';

interface LogoutModalProps {
    isVisible: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const LogoutModal = ({ isVisible, onClose, onConfirm }: LogoutModalProps) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            {/* Background Overlay */}
            <View className="flex-1 bg-black/60 justify-center items-center px-6">

                {/* Modal Container */}
                <View className="bg-white w-full rounded-3xl p-6 items-center shadow-xl">

                    {/* Warning Icon */}
                    <View className="w-16 h-16 bg-red-50 rounded-full items-center justify-center mb-4">
                        <Ionicons name="log-out" size={32} color="#EF4444" style={{ marginLeft: 4 }} />
                    </View>

                    {/* Text Content */}
                    <Text className="text-xl font-bold text-slate-900 font-sans mb-2">
                        Log Out
                    </Text>
                    <Text className="text-slate-500 text-center font-sans mb-8 leading-5">
                        Are you sure you want to log out? {"\n"}
                        You will need to sign in again to access your rentals.
                    </Text>

                    {/* Buttons Row */}
                    <View className="flex-row gap-3 w-full">

                        {/* Cancel Button */}
                        <TouchableOpacity
                            onPress={onClose}
                            className="flex-1 py-3.5 bg-gray-100 rounded-xl items-center"
                            activeOpacity={0.8}
                        >
                            <Text className="text-slate-700 font-bold font-sans">Cancel</Text>
                        </TouchableOpacity>

                        {/* Confirm Button */}
                        <TouchableOpacity
                            onPress={onConfirm}
                            className="flex-1 py-3.5 bg-[#FF385C] rounded-xl items-center shadow-sm"
                            activeOpacity={0.8}
                        >
                            <Text className="text-white font-bold font-sans">Yes, Log Out</Text>
                        </TouchableOpacity>

                    </View>

                </View>
            </View>
        </Modal>
    );
};

export default LogoutModal;