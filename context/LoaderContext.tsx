import React, { createContext, ReactNode, useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from "react-native";

interface LoaderContextProps {
    showLoader: () => void;
    hideLoader: () => void;
    isLoading: boolean;
}

export const LoaderContext = createContext<LoaderContextProps>({
    showLoader: () => {},
    hideLoader: () => {},
    isLoading: false,
});

export const LoaderProvider = ({ children }: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState(false);

    const showLoader = () => setIsLoading(true);
    const hideLoader = () => setIsLoading(false);

    return (
        <LoaderContext.Provider value={{ showLoader, hideLoader, isLoading }}>
            {children}

            {isLoading && (
                <View
                    style={styles.overlay}
                    className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center"
                >
                    {/* Glassmorphism style container */}
                    <View
                        style={{ backgroundColor: '#1A1A1A', borderColor: '#333333' }}
                        className="p-8 rounded-[32px] border shadow-2xl items-center justify-center"
                    >
                        <ActivityIndicator size="large" color="#B4F05F" />
                    </View>
                </View>
            )}
        </LoaderContext.Provider>
    );
};

const styles = StyleSheet.create({
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Deep dimmed background
        zIndex: 9999, // Ensure it sits on top of everything
    }
});