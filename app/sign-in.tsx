import {View, Text, ScrollView, Image, TouchableOpacity, Alert} from 'react-native'
import React from 'react'
import {SafeAreaView} from "react-native-safe-area-context";

import images from "@/constants/images";
import icons from "@/constants/icons";
import {login} from "@/lib/supabase"
import {useGlobalContext} from "@/lib/global-provider";
import {Redirect} from "expo-router";
import Auth from "@/components/Auth";

const SignIn = () => {
    const {refetch, loading, isLoggedIn } = useGlobalContext();

    // Return user to home screen if they are already logged in
    // This prevents the user from seeing the sign-in screen again
    if(!loading && isLoggedIn) return <Redirect href={"/"} />;

    const handleLogin = async () => {
        const result = await login();

        if (result) {
            // Navigate to the home screen or perform any other action after successful login
            refetch();
        } else {
            // Handle login failure
            Alert.alert("Error", "Failed to Login");
        }
    };

    return (
        <SafeAreaView className={"bg-white h-full"}>
            <ScrollView contentContainerClassName={"h-full"}>
                <Image source={images.onboarding} className={"w-full h-4/6"} resizeMode={"contain"} />

                <View className={"px-10"}>
                    <Text className={"text-base text-center uppercase font-rubik text-black-200"}>Welcome to Fynapp</Text>

                    <Text className={"text-3xl font-rubik-bold text-black-300 text-center mt-2"}>
                        Let's Get You Closer to {"\n"}
                        <Text className={"text-primary-300"}>Your Ideal Item</Text>
                    </Text>

                    <Text className={"text-lg font-rubik text-black-200 text-center mt-12"}>
                        Login to Fynapp with Google
                    </Text>

                    <View className={"flex flex-row items-center justify-center py-4 mt-5"}>
                        <Auth onPress={handleLogin} />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
export default SignIn
