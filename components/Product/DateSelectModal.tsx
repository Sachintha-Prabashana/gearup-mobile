import React, { useMemo, useState } from 'react';
import {View, Text, Modal, TouchableOpacity, StyleSheet, ViewStyle} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
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

    const LIME_COLOR = '#B4F05F';
    const DARK_CHARCOAL = '#1A1A1A';

    const markedDates = useMemo(() => {
        let marks: any = {};
        if (!startDate) return marks;

        // Selection Start
        marks[startDate] = {
            startingDay: true,
            endingDay: !endDate,
            color: LIME_COLOR,
            textColor: 'black', // Black text on Lime background for high contrast
        }

        if (startDate && endDate) {
            let start = new Date(startDate);
            let end = new Date(endDate);
            let current = new Date(start);
            current.setDate(current.getDate() + 1);

            while (current < end) {
                const dateString = current.toISOString().split('T')[0];
                marks[dateString] = {
                    color: '#B4F05F40', // Semi-transparent lime for days in between
                    textColor: 'white',
                    selected: true
                };
                current.setDate(current.getDate() + 1);
            }

            // Selection End
            marks[endDate] = {
                endingDay: true,
                color: LIME_COLOR,
                textColor: 'black'
            };
        }
        return marks;
    }, [startDate, endDate]);

    const onDayPress = (day: DateData) => {
        const date = day.dateString;
        if(!startDate || (startDate && endDate)) {
            setStartDate(date);
            setEndDate(null);
        } else if (startDate && !endDate) {
            if (date < startDate) {
                setStartDate(date);
            } else {
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
                text1: 'Select Dates',
                text2: 'Please pick both start and end dates.',
                position: 'bottom',
            });
        }
    }

    return (
        <Modal visible={isVisible} animationType="slide" transparent={true}>
            <View style={styles.overlay}>
                <View style={{ backgroundColor: '#000000' }} className="rounded-t-[40px] h-[80%] p-6 border-t border-white/10">

                    {/* Header */}
                    <View className="flex-row justify-between items-center mb-8">
                        <View>
                            <Text className="text-2xl font-black text-white tracking-tight">Pick Dates</Text>
                            <Text className="text-[#666666] text-xs font-bold uppercase tracking-widest mt-1">Select your rental period</Text>
                        </View>
                        <TouchableOpacity
                            onPress={onClose}
                            style={{ backgroundColor: DARK_CHARCOAL }}
                            className="w-10 h-10 rounded-full items-center justify-center border border-white/5"
                        >
                            <Ionicons name="close" size={20} color="white" />
                        </TouchableOpacity>
                    </View>

                    {/* Calendar Component with Dark Theme */}
                    <Calendar
                        onDayPress={onDayPress}
                        markedDates={markedDates}
                        markingType={'period'}
                        enableSwipeMonths={true}
                        theme={{
                            calendarBackground: '#000000',
                            textSectionTitleColor: '#666666',
                            dayTextColor: '#FFFFFF',
                            todayTextColor: LIME_COLOR,
                            selectedDayBackgroundColor: LIME_COLOR,
                            selectedDayTextColor: 'black',
                            monthTextColor: '#FFFFFF',
                            indicatorColor: LIME_COLOR,
                            arrowColor: LIME_COLOR,
                            textDisabledColor: '#333333',
                            // Font Styling
                            textDayFontWeight: '600',
                            textMonthFontWeight: '900',
                            textDayHeaderFontWeight: '700',
                        }}
                    />

                    {/* Save Button */}
                    <View className="mt-auto pt-6 border-t border-white/5">
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={{
                                backgroundColor: startDate && endDate ? LIME_COLOR : '#262626',
                                shadowColor: startDate && endDate ? LIME_COLOR : 'transparent',
                                shadowOpacity: 0.3,
                                shadowRadius: 15,
                                elevation: 8
                            }}
                            className="py-5 rounded-2xl items-center"
                            disabled={!startDate || !endDate}
                            onPress={handleConfirm}
                        >
                            <Text style={{ color: startDate && endDate ? 'black' : '#666666' }} className="font-black text-base uppercase tracking-widest">
                                {startDate && endDate ? `Confirm Period` : "Pick Range"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

// Define the interface for your styles
interface Styles {
    overlay: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'flex-end', // Fixed 'end' -> 'flex-end'
    }
});

export default DateSelectModal;