import {View, Text} from 'react-native'
import React from 'react'

const SkeletonCard = () => {
    return (
        <View className="mr-4 w-[240px]">
            {/* Image Skeleton */}
            <View className="w-full h-[300px] rounded-2xl bg-gray-100 animate-pulse" />

            {/* Text details skeleton (Below the image, matching GearCard) */}
            <View className="mt-3 space-y-2 px-1">
                <View className="h-4 w-3/4 bg-gray-100 rounded animate-pulse"/>
                <View className="h-3 w-1/2 bg-gray-100 rounded animate-pulse"/>
            </View>
        </View>
    )
}
export default SkeletonCard;