import {View, Text, ScrollView, Image, TouchableOpacity, ImageSourcePropType, Alert} from 'react-native'
import React from 'react'
import {SafeAreaView} from "react-native-safe-area-context";

import icons from "@/constants/icons";
import {useGlobalContext} from "@/lib/global-provider";
import {router} from "expo-router";

const handleEditProfilePress = () => router.push("/profile settings/profile-settings");
const handleEditListingsPress = () => router.push("/listings/listings");

const Profile = () => {
    const { user } = useGlobalContext();

    return (
        <SafeAreaView className={"h-full bg-white"}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName={"pb-32 px-7"}>
                <View className={"flex flex-row items-center justify-between mt-5"}>
                    <Text className={"text-xl font-rubik-bold"}>
                        Profile
                    </Text>
                    <Image source={icons.bell} className={"size-5"}/>
                </View>

                <View className={"flex flex-row justify-center"}>
                    <View className={"flex flex-col items-center relative mt-5"}>
                        <Image source={{uri: user?.avatar}} className={"size-44 relative rounded-full"}/>
                        <Text className={"text-2xl font-rubik-bold mt-2"}>{user?.user_metadata.name}</Text>
                    </View>
                </View>

                <View className={"flex flex-row mt-5"}>
                    <View className={"flex-1 items-center border-r border-primary-200"}>
                        <Text className={"text-2xl font-rubik-bold"}>
                            562
                        </Text>
                        <Text className={"text-xl font-rubik-light text-black-100"}>
                            Listings
                        </Text>
                    </View>
                    <View className={"flex-1 items-center border-l border-r border-primary-200"}>
                        <Text className={"text-2xl font-rubik-bold"}>
                            432
                        </Text>
                        <Text className={"text-xl font-rubik-light text-black-100"}>
                            Followers
                        </Text>
                    </View>
                    <View className={"flex-1 items-center border-l border-primary-200"}>
                        <Text className={"text-2xl font-rubik-bold"}>
                            123
                        </Text>
                        <Text className={"text-xl font-rubik-light text-black-100"}>
                            Likes
                        </Text>
                    </View>
                </View>

                <View className={"flex flex-row gap-3 mt-5"}>
                    <TouchableOpacity className={"flex-1 items-center rounded-md border-2"} onPress={handleEditListingsPress}>
                        <Text className={"text-xl font-rubik-bold"}>
                            Edit Listings
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity className={"flex-1 items-center rounded-md border-2"} onPress={handleEditProfilePress}>
                        <Text className={"text-xl font-rubik-bold"}>
                            Edit Profile
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
export default Profile
