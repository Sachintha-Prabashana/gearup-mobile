import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LogoutModalProps {
    isVisible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;          // sign out or remove item
    message: string;        //  "Are you sure..."
    confirmText?: string;   // Button name = (default: "Confirm")
    icon?: keyof typeof Ionicons.glyphMap; // Icon name from Ionicons
    isDanger?: boolean;     // need to show danger style (red) or not
}

const ConfirmationModal = ({
                               isVisible,
                               onClose,
                               onConfirm,
                               title,
                               message,
                               confirmText = "Confirm",
                               icon = "alert-circle-outline",
                               isDanger = false
}: LogoutModalProps) => {

    const primaryColor = isDanger ? '#EF4444' : '#B4F05F';
    const primaryTextColor = isDanger ? '#FFFFFF' : '#000000';
    const iconBgColor = isDanger ? '#EF444415' : '#B4F05F15';

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            {/* Background Overlay */}
            <View style={styles.overlay} className="flex-1 justify-center items-center px-8">

                {/* Modal Container */}
                <View
                    style={{ backgroundColor: '#1A1A1A', borderColor: '#2A2A2A' }}
                    className="w-full rounded-[32px] p-8 items-center border shadow-2xl"
                >

                    {/* Dynamic Icon */}
                    <View style={{ backgroundColor: iconBgColor }} className="w-20 h-20 rounded-full items-center justify-center mb-6">
                        <Ionicons name={icon} size={36} color={primaryColor} />
                    </View>

                    {/* Dynamic Text */}
                    <Text className="text-2xl font-black text-white mb-3 text-center tracking-tight">
                        {title}
                    </Text>
                    <Text className="text-[#999999] text-center font-bold mb-10 leading-6">
                        {message}
                    </Text>

                    {/* Buttons */}
                    <View className="flex-row gap-4 w-full">
                        <TouchableOpacity
                            onPress={onClose}
                            style={{ backgroundColor: '#262626', height: 60 }}
                            className="flex-1 rounded-2xl items-center justify-center"
                            activeOpacity={0.8}
                        >
                            <Text className="text-[#999999] font-black uppercase tracking-widest text-[11px]">Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={onConfirm}
                            style={{
                                backgroundColor: primaryColor,
                                height: 60,
                                shadowColor: primaryColor,
                                shadowOffset: { width: 0, height: 8 },
                                shadowOpacity: 0.3,
                                shadowRadius: 12,
                                elevation: 8
                            }}
                            className="flex-1 rounded-2xl items-center justify-center"
                            activeOpacity={0.9}
                        >
                            <Text style={{ color: primaryTextColor }} className="font-black uppercase tracking-widest text-[11px]">
                                {confirmText}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
    }
});

export default ConfirmationModal;