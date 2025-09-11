import {View, Text, ScrollView, TouchableOpacity, Alert} from 'react-native'
import React, {useState} from 'react'
import {useGlobalContext} from "@/lib/global-provider";
import {Redirect, router} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import CustomInput from "@/components/CustomInput";
import {loginWithEmail} from "@/lib/supabase";

const SignUp = () => {
    const {refetch, loading, isLoggedIn } = useGlobalContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Return user to home screen if they are already logged in
    // This prevents the user from seeing the sign-in screen again
    if(!loading && isLoggedIn) return <Redirect href={"/"} />;

    async function handleLoginWithEmail() {
        if (!email || !password) {
            return Alert.alert("Error", "Please fill in all fields");
        }

        const result = await loginWithEmail(email, password);

        if (result) {
            refetch();
        } else {
            Alert.alert("Error", "Failed to Login");
        }
    }

    return (
        <SafeAreaView className={"bg-white h-full"}>
            <ScrollView contentContainerClassName={"h-full px-5"}>
                <View className={"flex flex-col items-center"}>
                    <Text className={"text-3xl font-rubik-extrabold"}>Sign Up</Text>
                </View>
                <View className={"mt-7"}>
                    <Text className="text-black-300 text-xl font-rubik-bold">
                        Email
                    </Text>
                    <CustomInput placeholder={"Enter Email..."} value={email} onChangeText={(text) => setEmail(text)} />
                </View>
                <View className={"mt-7"}>
                    <Text className="text-black-300 text-xl font-rubik-bold">
                        Password
                    </Text>
                    <CustomInput placeholder={"Enter Password..."} value={password} onChangeText={(text) => setPassword(text)} />
                </View>
                <View className={"mt-7"}>
                    <TouchableOpacity className={"py-3 bg-primary-300 rounded-full items-center"} onPress={handleLoginWithEmail}>
                        <Text className={"text-lg font-rubik-bold text-white"}>Login</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
export default SignUp
