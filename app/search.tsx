import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Keyboard, Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Components & Services
import GearCard from '@/components/GearCard';
import { searchGearItems } from '@/service/gearService';
import { toggleFavorite, getUserFavoriteIds } from "@/service/favoriteService";
import { useAuth } from "@/hooks/useAuth";
import SearchItemCard from '@/components/SearchItemCard';

const { width } = Dimensions.get('window');

const Search = () => {

    const router = useRouter();
    const { user } = useAuth();

    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
    const [hasSearched, setHasSearched] = useState(false);

    // 1. Load Favorites
    useEffect(() => {
        if (user) {
            getUserFavoriteIds().then(
                ids => setFavoriteIds(new Set(ids))
            );
        }
    }, [user]);

    // 2. Debounced Search Logic
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.trim().length > 0) {
                setLoading(true);
                setHasSearched(true);
                const data = await searchGearItems(query);
                setResults(data);
                setLoading(false);
            } else {
                setResults([]);
                setHasSearched(false);
            }

        }, 500); // Debounce for 500ms
        return () => clearTimeout(delayDebounceFn);

    }, [query]);

    // Handle Favorite
    const handleToggleFavorite = async (item: any) => {
        if (!user) return;
        const newFavorites = new Set(favoriteIds);
        newFavorites.has(item.id) ? newFavorites.delete(item.id) : newFavorites.add(item.id);
        setFavoriteIds(newFavorites);
        await toggleFavorite(item);
    }


    return (
        <SafeAreaView className="flex-1 bg-black" edges={['top']}>

            {/* --- HEADER --- */}
            <View className="flex-row items-center px-4 pt-2 pb-4 gap-3 border-b border-[#333333]">
                {/* Back Button */}
                <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center rounded-full bg-[#1A1A1A]">
                    <Ionicons name="arrow-back" size={20} color="white" />
                </TouchableOpacity>

                {/* Search Input Field */}
                <View className="flex-1 flex-row items-center bg-[#1A1A1A] rounded-2xl px-4 h-12 border border-[#333333]">
                    <Ionicons name="search" size={20} color="#666666" />
                    <TextInput
                        className="flex-1 ml-3 text-white font-semibold text-[15px]"
                        placeholder="Search for gear..."
                        placeholderTextColor="#666666"
                        value={query}
                        onChangeText={setQuery}
                        autoFocus={true}
                        returnKeyType="search"
                        selectionColor="#B4F05F"
                    />
                    {query.length > 0 && (
                        <TouchableOpacity onPress={() => setQuery('')}>
                            <Ionicons name="close-circle" size={18} color="#666666" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* --- BODY CONTENT --- */}
            <View className="flex-1 px-4">

                {/* 1. Loading State */}
                {loading ? (
                    <View className="mt-20 items-center">
                        <ActivityIndicator size="large" color="#B4F05F" />
                        <Text className="text-[#666666] mt-4 font-bold text-xs uppercase tracking-widest">Searching...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={results}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingTop: 20, paddingBottom: 50 }}

                        // 2. No Results State
                        ListEmptyComponent={() => (
                            <View className="items-center justify-center mt-20 opacity-60">
                                {hasSearched ? (
                                    <>
                                        <View className="w-20 h-20 bg-[#1A1A1A] rounded-full items-center justify-center mb-4">
                                            <Ionicons name="search-outline" size={32} color="#666666" />
                                        </View>
                                        <Text className="text-white font-bold text-lg">No matches found</Text>
                                        <Text className="text-[#666666] text-center mt-2 px-10">
                                            {`We couldn't find anything for "${query}". Try a different keyword.`}
                                        </Text>
                                    </>
                                ) : (
                                    <>
                                        {/* Initial State: Popular Tags */}
                                        <View className="items-start w-full px-2">
                                            <Text className="text-[#666666] font-bold uppercase text-xs tracking-widest mb-4">Popular Searches</Text>
                                            <View className="flex-row flex-wrap gap-2">
                                                {["Canon R5", "Sony Alpha", "Drone", "GoPro", "Lens"].map((tag, index) => (
                                                    <TouchableOpacity
                                                        key={index}
                                                        onPress={() => setQuery(tag)}
                                                        className="bg-[#1A1A1A] px-4 py-2 rounded-full border border-[#333333]"
                                                    >
                                                        <Text className="text-white font-bold text-xs">{tag}</Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        </View>
                                    </>
                                )}
                            </View>
                        )}

                        renderItem={({ item }) => (
                            <SearchItemCard item={item} />
                        )}
                    />
                )}
            </View>
        </SafeAreaView>
    )
}
export default Search
