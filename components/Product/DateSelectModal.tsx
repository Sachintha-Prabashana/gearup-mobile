import React, { useMemo, useState } from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import {Calendar, DateData} from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import Toast from "react-native-toast-message";

interface DateSelectModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSave: (start: string, end: string) => void;
}

const DateSelectModal = ({ isVisible, onClose, onSave }: DateSelectModalProps) => {
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);

    const markedDates = useMemo(() => {
        let marks: any = {};

        if (!startDate) return marks;

        // if only choosing start date
        marks[startDate] = {
            startingDay: true,
            endingDay: !endDate,
            color: '#FF385C',
            textColor: 'white'

        }

        if (startDate && endDate) {
            // mark all dates in between
            let start = new Date(startDate);
            let end = new Date(endDate);

            let current = new Date(start);
            current.setDate(current.getDate() + 1);

            while (current < end) {
                const dateString = current.toISOString().split('T')[0];
                marks[dateString] = { color: '#FF385C', textColor: 'white', selected: true }; // මැද දවස් (Lighter color ඕන නම් color එක වෙනස් කරන්න)
                current.setDate(current.getDate() + 1);
            }

            marks[endDate] = { endingDay: true, color: '#FF385C', textColor: 'white' };
        }
        return marks;
    }, [startDate, endDate]);

    const onDayPress = (day: DateData) => {
        const date = day.dateString;

        if(!startDate || (startDate && endDate)) {
            setStartDate(date);
            setEndDate(null);
        }

        else if (startDate && !endDate) {
            if (date < startDate) {
                setStartDate(date);
            }
            else {
                setEndDate(date);
            }
        }
    };

    const handleConfirm = () => {
        if (startDate && endDate) {
            onSave(startDate, endDate);
            onClose();
        } else {
            Toast.show({
                type: 'error',
                text1: 'Missing Dates',
                text2: 'Please select both START and END dates.',
                position: 'bottom',
                visibilityTime: 4000,
            });
        }
    }

    return (
        <Modal visible={isVisible} animationType="slide" transparent={true}>
            <View className="flex-1 bg-black/50 justify-end">
                <View className="bg-white rounded-t-3xl h-[75%] p-5">
                    {/* Header */}
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-xl font-bold font-sans text-slate-900">Select Dates</Text>
                        <TouchableOpacity onPress={onClose} className="bg-gray-100 p-2 rounded-full">
                            <Ionicons name="close" size={20} color="black" />
                        </TouchableOpacity>
                    </View>

                    {/* Calendar */}
                    <Calendar
                        onDayPress={onDayPress}
                        markedDates={markedDates}
                        markingType={'period'}
                        theme={{
                            todayTextColor: '#FF385C',
                            arrowColor: '#FF385C',
                            textDayFontFamily: 'Inter_500Medium',
                            textMonthFontFamily: 'Inter_700Bold',
                            textDayHeaderFontFamily: 'Inter_500Medium',
                        }}
                    />

                    {/* Save Button */}
                    <View className="mt-auto pt-4 border-t border-gray-100">
                        <TouchableOpacity
                            className={`py-4 rounded-xl items-center shadow-md ${startDate && endDate ? 'bg-[#FF385C]' : 'bg-gray-300'}`}
                            disabled={!startDate || !endDate}
                            onPress={handleConfirm}
                        >
                            <Text className="text-white font-bold text-lg font-sans">
                                {startDate && endDate ? `Confirm (${startDate} - ${endDate})` : "Select Dates"}

                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default DateSelectModal;