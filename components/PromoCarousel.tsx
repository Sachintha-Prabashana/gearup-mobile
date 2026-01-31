import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, FlatList, Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

const PROMO_ITEMS = [
    {
        id: 1,
        title: "Rent the new\nSony A7S III today",
        price: "From Rs. 15,000/day",
        tag: "New Arrival",
        accent: "#B4F05F", // Brand Lime
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 2,
        title: "Capture the sky\nDJI Mavic 3 Cine",
        price: "From Rs. 22,000/day",
        tag: "Trending",
        accent: "#3B82F6", // Professional Blue
        image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 3,
        title: "Pro Lighting Kit\nAputure 600d Pro",
        price: "From Rs. 8,500/day",
        tag: "Best Value",
        accent: "#A855F7", // Creative Purple
        image: "https://images.unsplash.com/photo-1563363072-5d9c2409559c?auto=format&fit=crop&w=500&q=80"
    }
];

const PromoCarousel = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            let nextIndex = activeIndex + 1;
            if (nextIndex >= PROMO_ITEMS.length) nextIndex = 0;

            flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
            setActiveIndex(nextIndex);
        }, 5000); // Slower interval for better readability

        return () => clearInterval(interval);
    }, [activeIndex]);

    const handleScroll = (event: any) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollPosition / width);
        setActiveIndex(index);
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={{ width: width }} className="px-5">
            <View
                style={{ backgroundColor: '#1A1A1A', borderColor: '#333333' }}
                className="rounded-[32px] p-6 flex-row items-center justify-between overflow-hidden relative h-[170px] border shadow-2xl"
            >
                {/* Abstract Background Shapes */}
                <View style={{ backgroundColor: item.accent }} className="absolute -right-16 -top-16 w-48 h-48 rounded-full opacity-10" />
                <View className="absolute right-10 bottom-0 w-24 h-24 bg-white/5 rounded-full" />

                <View className="z-10 w-2/3">
                    <View
                        style={{ backgroundColor: `${item.accent}20`, borderColor: `${item.accent}40` }}
                        className="self-start px-3 py-1 rounded-full mb-3 border"
                    >
                        <Text style={{ color: item.accent }} className="text-[10px] font-black uppercase tracking-[2px]">
                            {item.tag}
                        </Text>
                    </View>

                    <Text className="text-white text-xl font-black leading-7 mb-2">
                        {item.title}
                    </Text>

                    <Text className="text-[#999999] text-xs font-bold uppercase tracking-widest">
                        {item.price}
                    </Text>
                </View>

                <Image
                    source={{ uri: item.image }}
                    className="absolute -right-6 bottom-[-10] w-40 h-40 rotate-[-12deg]"
                    resizeMode="contain"
                />
            </View>
        </View>
    );

    return (
        <View className="mb-8 mt-2">
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
                snapToAlignment="center"
                decelerationRate="fast"
            />

            {/* Pagination Dots */}
            <View className="flex-row justify-center mt-5 gap-2.5">
                {PROMO_ITEMS.map((_, index) => (
                    <View
                        key={index}
                        style={{
                            backgroundColor: index === activeIndex ? '#B4F05F' : '#333333',
                            width: index === activeIndex ? 24 : 8
                        }}
                        className="h-2 rounded-full transition-all duration-300"
                    />
                ))}
            </View>
        </View>
    );
};

export default PromoCarousel;