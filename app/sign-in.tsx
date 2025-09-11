import {View, Text, ScrollView, Image, TouchableOpacity, Alert} from 'react-native'
import React from 'react'
import {SafeAreaView} from "react-native-safe-area-context";

import images from "@/constants/images";
import icons from "@/constants/icons";
import {loginWithGoogle} from "@/lib/supabase"
import {useGlobalContext} from "@/lib/global-provider";
import {Redirect, router} from "expo-router";
import Auth from "@/components/Auth";

const SignIn = () => {
    const {refetch, loading, isLoggedIn } = useGlobalContext();

    // Return user to home screen if they are already logged in
    // This prevents the user from seeing the sign-in screen again
    if(!loading && isLoggedIn) return <Redirect href={"/"} />;

    const handleGoogleLogin = async () => {
        const result = await loginWithGoogle();

        if (result) {
            // Navigate to the home screen or perform any other action after successful login
            refetch();
        } else {
            // Handle login failure
            Alert.alert("Error", "Failed to Login");
        }
    };

    const handleSignUpPress = () => router.push("/sign-up");
    const handleLoginPress = () => router.push("/login");

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

                    <View className={"flex flex-row items-center gap-4 mt-5"}>
                        <TouchableOpacity className={"flex-1 py-3 bg-primary-300 rounded-full items-center"} onPress={handleLoginPress}>
                            <Text className={"text-lg font-rubik-bold text-white"}>Login</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className={"flex-1 py-3 bg-primary-300 rounded-full items-center"} onPress={handleSignUpPress}>
                            <Text className={"text-lg font-rubik-bold text-white"}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>

                    <View className={"flex flex-row items-center justify-center mt-5"}>
                        <View className={"flex-1 h-px bg-primary-300"}></View>
                        <Text className={"font-rubik-medium text-base text-primary-300 mx-4"}>Or</Text>
                        <View className={"flex-1 h-px bg-primary-300"}></View>
                    </View>

                    <View className={"flex flex-col items-center justify-center mt-5"}>
                        <Auth onPress={handleGoogleLogin} />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
export default SignIn
