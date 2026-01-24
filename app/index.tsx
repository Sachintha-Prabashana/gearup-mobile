import { Text, View } from "react-native"

import {Redirect} from "expo-router";

export default function Index() {
    // const { user, loading } = useAuth()
    return <Redirect href={"/login"} />

}
