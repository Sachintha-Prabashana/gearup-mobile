import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
            <View style={styles.overlay} className="flex-1 justify-center items-center px-8">

                {/* Modal Container */}
                <View
                    style={{ backgroundColor: '#1A1A1A', borderColor: '#2A2A2A' }}
                    className="w-full rounded-[32px] p-8 items-center border shadow-2xl"
                >

                    {/* Warning Icon Circle */}
                    <View style={{ backgroundColor: '#EF444415' }} className="w-20 h-20 rounded-full items-center justify-center mb-6">
                        <Ionicons name="log-out-outline" size={36} color="#EF4444" />
                    </View>

                    {/* Text Content */}
                    <Text className="text-2xl font-black text-white mb-3 text-center tracking-tight">
                        Sign Out
                    </Text>
                    <Text className="text-[#999999] text-center font-bold mb-10 leading-6">
                        Are you sure you want to log out? You'll need to sign back in to manage your gear.
                    </Text>

                    {/* Action Buttons */}
                    <View className="flex-row gap-4 w-full">

                        {/* Cancel Button */}
                        <TouchableOpacity
                            onPress={onClose}
                            style={{ backgroundColor: '#262626', height: 60 }} // Fixed height for consistency
                            className="flex-1 rounded-2xl items-center justify-center"
                            activeOpacity={0.8}
                        >
                            <Text className="text-[#999999] font-black uppercase tracking-widest text-[11px]">Cancel</Text>
                        </TouchableOpacity>

                        {/* Confirm Button */}
                        <TouchableOpacity
                            onPress={onConfirm}
                            style={{
                                backgroundColor: '#B4F05F',
                                height: 60, // Fixed height for consistency
                                shadowColor: '#B4F05F',
                                shadowOffset: { width: 0, height: 8 },
                                shadowOpacity: 0.3,
                                shadowRadius: 12,
                                elevation: 8
                            }}
                            className="flex-1 rounded-2xl items-center justify-center"
                            activeOpacity={0.9}
                        >
                            <Text className="text-black font-black uppercase tracking-widest text-[11px]">Logout</Text>
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

export default LogoutModal;