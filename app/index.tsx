import {ActivityIndicator, Text, View} from "react-native"

import {Redirect} from "expo-router";
import {useAuth} from "@/hooks/useAuth";

export default function Index() {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            // style danna
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size={"large"} color={"#0000ff"} />
            </View>
        )
    }

    if (user) {
        return <Redirect href={"/home"} />
    } else {
        return <Redirect href={"/login"} />
    }

}
