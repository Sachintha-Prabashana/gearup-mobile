import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RatingModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSubmit: (rating: number, comment: string) => void;
    itemName: string;
    isSubmitting: boolean;
}

const RatingModal = ({ isVisible, onClose, onSubmit, itemName, isSubmitting }: RatingModalProps) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = () => {
        if (rating > 0) {
            onSubmit(rating, comment);
            // After submission, reset local state
            setTimeout(() => {
                setRating(0);
                setComment('');
            }, 500);
        }
    };

    return (
        <Modal
            animationType={"fade"}
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}

        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.overlay}
                className="flex-1 justify-center items-center px-6"
            >
                <View
                    style={{ backgroundColor: '#1A1A1A', borderColor: '#2A2A2A' }}
                    className="w-full p-6 rounded-[32px] border shadow-2xl"
                >
                    {/* Header */}
                    <View className="items-center mb-6">
                        <Text className="text-[#B4F05F] font-black uppercase tracking-widest text-[10px] mb-2">
                            Rate Your Experience
                        </Text>
                        <Text className="text-white text-xl font-bold text-center leading-6">
                            How was the <Text className="text-[#B4F05F]">{itemName}</Text>?
                        </Text>
                    </View>

                    {/* Stars Selection (1 to 5) */}
                    <View className="flex-row justify-center gap-3 mb-6">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <TouchableOpacity
                                key={star}
                                onPress={() => setRating(star)}
                                activeOpacity={0.7}
                            >
                                <Ionicons
                                    name={star <= rating ? "star" : "star-outline"}
                                    size={32}
                                    color={star <= rating ? "#B4F05F" : "#404040"}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Comment Box */}
                    <View className="bg-[#262626] rounded-2xl p-4 mb-6 border border-[#333333]">
                        <TextInput
                            placeholder="Write a review about the gear..."
                            placeholderTextColor="#666666"
                            multiline
                            numberOfLines={3}
                            style={{ color: 'white', textAlignVertical: 'top', height: 80 }}
                            value={comment}
                            onChangeText={setComment}
                        />
                    </View>

                    {/* Buttons */}
                    <View className="flex-row gap-3">
                        {/* Cancel Button */}
                        <TouchableOpacity
                            onPress={onClose}
                            className="flex-1 bg-[#262626] py-4 rounded-xl items-center"
                        >
                            <Text className="text-[#999999] font-bold uppercase text-xs">Cancel</Text>
                        </TouchableOpacity>

                        {/* Submit Button */}
                        <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={rating === 0 || isSubmitting}
                            style={{
                                backgroundColor: rating === 0 ? '#333333' : '#B4F05F',
                                opacity: rating === 0 ? 0.5 : 1
                            }}
                            className="flex-1 py-4 rounded-xl items-center flex-row justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <ActivityIndicator size="small" color="black" />
                            ) : (
                                <>
                                    <Text
                                        style={{ color: rating === 0 ? '#999999' : 'black' }}
                                        className="font-black uppercase text-xs"
                                    >
                                        Submit
                                    </Text>
                                    <Ionicons name="arrow-forward" size={14} color={rating === 0 ? '#999999' : 'black'} />
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

            </KeyboardAvoidingView>


        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
    }
});

export default RatingModal;