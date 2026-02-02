import React from 'react';
import { View, Text, Modal, TouchableOpacity, Dimensions } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';

interface BookingQRModalProps {
    visible: boolean;
    onClose: () => void;
    bookingId: string;
    itemName: string;   
}

const BookingQRModal = ({ visible, onClose, bookingId, itemName }: BookingQRModalProps) => {
    return (
        <Modal transparent visible={visible} animationType="fade">
            <View className="flex-1 justify-center items-center bg-black/80 px-6">
                
                {/* Ticket Container */}
                <View className="bg-white w-full rounded-3xl overflow-hidden items-center">
                    
                    {/* Header (Neon Green) */}
                    <View className="bg-[#B4F05F] w-full py-4 items-center">
                        <Text className="text-black font-black text-lg uppercase tracking-widest">
                            Pickup Ticket
                        </Text>
                    </View>

                    {/* Content */}
                    <View className="p-8 items-center w-full">
                        <Text className="text-[#666666] font-bold text-center mb-1">Show this at counter</Text>
                        <Text className="text-black font-black text-xl text-center mb-6">{itemName}</Text>

                        {/*  THE QR CODE GENERATOR */}
                        <View className="p-4 bg-white border-2 border-dashed border-gray-300 rounded-xl mb-4">
                            <QRCode 
                                value={bookingId}
                                size={200}
                                color="black"
                                backgroundColor="white"
                            />
                        </View>

                        <Text className="text-[#999999] text-xs font-bold font-mono uppercase tracking-widest">
                            ID: {bookingId}
                        </Text>
                    </View>

                    {/* Footer / Close */}
                    <TouchableOpacity 
                        onPress={onClose}
                        className="w-full py-5 border-t border-gray-100 items-center active:bg-gray-50"
                    >
                        <Text className="text-black font-bold uppercase">Close</Text>
                    </TouchableOpacity>
                </View>

                {/* Close Button Circle (Optional) */}
                <TouchableOpacity 
                    onPress={onClose}
                    className="mt-6 w-12 h-12 bg-[#1A1A1A] rounded-full items-center justify-center border border-white/20"
                >
                    <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>

            </View>
        </Modal>
    );
};

export default BookingQRModal;