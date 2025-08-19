import {useGlobalContext} from "@/lib/global-provider";
import {SafeAreaView} from "react-native-safe-area-context";
import {ActivityIndicator} from "react-native";
import {Redirect, Slot} from "expo-router";

export default function AppLayout() {
    const {loading, isLoggedIn} = useGlobalContext();

    // If the app is still loading user data, show a loading indicator
    if(loading) {
        return (
            <SafeAreaView className={"bg-white h-full flex justify-center items-center"}>
                <ActivityIndicator className={"text-primary-300"} size={"large"} />
            </SafeAreaView>
        )
    }

    // If the user is not logged in, redirect to the sign-in page
    if(!isLoggedIn) return <Redirect href="/sign-in" />;

    // If the user is logged in, render the main app content
    return <Slot />;
}