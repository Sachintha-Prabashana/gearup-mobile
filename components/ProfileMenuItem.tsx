import {View, Text, TouchableOpacity} from 'react-native'
import React from 'react'
import {Ionicons} from "@expo/vector-icons";

interface ProfileMenuItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress: () => void;
    color?: string; // Optional (Default is slate-900)
    showBadge?: boolean; // Optional (Notification Badge)
    badgeText?: string;
    isDestructive?: boolean;

}

const ProfileMenuItem = ({
                             icon,
                             label,
                             onPress,
                             color = "#0F172A",
                             showBadge = false,
                             badgeText = "New",
                             isDestructive = false
                         }: ProfileMenuItemProps) => {

    const iconColor = isDestructive ? "#EF4444" : color;
    const textColor = isDestructive ? "text-red-500" : "text-slate-800";
    const bgClass = isDestructive ? "bg-red-50" : "bg-gray-50";


    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className="flex-row items-center justify-between py-4 border-b border-gray-50"

        >
            {/* Left Side: Icon & Label */}
            <View className="flex-row items-center gap-4">
                <View className={`w-10 h-10 rounded-full items-center justify-center ${bgClass}`}>
                    <Ionicons name={icon} size={20} color={iconColor} />
                </View>
                <Text className={`text-base font-semibold font-sans ${textColor}`}>
                    {label}
                </Text>
            </View>

            {/* Right Side: Badge & Chevron */}
            <View className="flex-row items-center gap-2">
                {showBadge && (
                    <View className="bg-red-500 px-2 py-0.5 rounded-full">
                        <Text className="text-[10px] font-bold text-white">{badgeText}</Text>
                    </View>
                )}

                <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
            </View>

        </TouchableOpacity>
    )
}
export default ProfileMenuItem
