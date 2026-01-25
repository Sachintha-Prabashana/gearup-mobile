import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, FlatList, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const PROMO_ITEMS = [
    {
        id: 1,
        title: "Rent the new\nSony A7S III today",
        price: "From Rs. 15,000/day",
        tag: "New Arrival",
        color: "bg-orange-500",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 2,
        title: "Capture the sky\nDJI Mavic 3 Cine",
        price: "From Rs. 22,000/day",
        tag: "Trending",
        color: "bg-blue-500",
        image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 3,
        title: "Pro Lighting Kit\nAputure 600d Pro",
        price: "From Rs. 8,500/day",
        tag: "Best Value",
        color: "bg-green-500",
        image: "https://images.unsplash.com/photo-1563363072-5d9c2409559c?auto=format&fit=crop&w=500&q=80"
    }
];

const PromoCarousel = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    // Auto Slide Logic (4 Seconds)
    useEffect(() => {
        const interval = setInterval(() => {
            let nextIndex = activeIndex + 1;
            if (nextIndex >= PROMO_ITEMS.length) nextIndex = 0;

            flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
            setActiveIndex(nextIndex);
        }, 4000);

        return () => clearInterval(interval);
    }, [activeIndex]);

    const handleScroll = (event: any) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollPosition / width);
        setActiveIndex(index);
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={{ width: width }} className="px-5">
            <View className="bg-slate-900 rounded-3xl p-5 flex-row items-center justify-between overflow-hidden relative h-[150px] shadow-lg shadow-slate-400/50">
                <View className="absolute -right-10 -top-10 w-40 h-40 bg-slate-800 rounded-full opacity-50" />
                <View className="absolute right-10 bottom-0 w-20 h-20 bg-slate-700 rounded-full opacity-30" />

                <View className="z-10 w-2/3">
                    <View className={`${item.color} self-start px-2.5 py-1 rounded-md mb-2 shadow-sm`}>

                        <Text className="text-[10px] font-bold text-white uppercase tracking-wider">{item.tag}</Text>
                    </View>

                    <Text className="text-white text-xl font-bold leading-6 shadow-sm">{item.title}</Text>

                    <Text className="text-slate-300 text-xs mt-2 font-medium">{item.price}</Text>
                </View>

                <Image
                    source={{ uri: item.image }}
                    className="absolute -right-4 bottom-0 w-36 h-36 rounded-xl rotate-[-6deg]"
                    resizeMode="cover"
                />
            </View>
        </View>
    );

    return (
        <View className="mb-6">
            <FlatList
                ref={flatListRef}
                data={PROMO_ITEMS}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            />
            {/* Pagination Dots */}
            <View className="flex-row justify-center mt-3 gap-2">
                {PROMO_ITEMS.map((_, index) => (
                    <View
                        key={index}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                            index === activeIndex ? "w-6 bg-slate-900" : "w-1.5 bg-slate-300"
                        }`}
                    />
                ))}
            </View>
        </View>
    );
};

export default PromoCarousel;