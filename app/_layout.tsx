import {Slot, Stack} from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View } from "react-native";

export default function RootLayout() {
    const insets = useSafeAreaInsets()
    console.log(insets)
    return (
        <View className={"flex-1"} style={{ marginTop: insets.top }}>
            <Slot />

        </View>

    )
}
