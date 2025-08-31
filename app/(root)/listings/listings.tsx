import {View, Text, TouchableOpacity, Image, ActivityIndicator, FlatList} from 'react-native'
import React from 'react'
import {SafeAreaView} from "react-native-safe-area-context";
import {router} from "expo-router";
import icons from "@/constants/icons";
import {EditCard} from "@/components/Cards";
import {useSupabase} from "@/lib/useSupabase";
import {getUserProperties} from "@/lib/supabase";
import {useGlobalContext} from "@/lib/global-provider";
import NoResults from "@/components/NoResults";

const Listings = () => {
    const handleAddListingPress = () => router.push("/listings/edit-listing");
    const { user } = useGlobalContext();

    // Fetch properties based on the filter and query parameters
    const {data: properties, loading, refetch} = useSupabase({
        fn: getUserProperties,
        params: {
            userId: user?.id!,
        }
    });

    const handleCardPress = (id: string) => router.push({ pathname: "/listings/edit-listing", params: { property_id: id } });

    return (
        <FlatList
            data={properties}
            renderItem={({item}) => <EditCard item={item} onPress={() => handleCardPress(item.id)}/>}
            keyExtractor={(item) => item.id}
            numColumns={1}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
                loading ? (
                    <ActivityIndicator size="large" className={"text-primary-300 mt-5"}/>
                ) : <NoResults />
            }
            ListHeaderComponent={
                <SafeAreaView className={"bg-white"}>
                    <View className={"px-5"}>
                        <View className={"flex flex-row items-center justify-between mt-5"}>
                            <TouchableOpacity onPress={() => router.back()} className={"flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center"}>
                                <Image source={icons.backArrow} className={"size-5"} />
                            </TouchableOpacity>
                            <Text className={"text-base mr-2 text-center dont-rubik-medium text-black-300"}>Your Listings</Text>
                            <Image source={icons.bell} className={"w-6 h-6"} />
                        </View>
                        <TouchableOpacity className={"flex-1 items-center rounded-md border-2 mt-5 py-3"} onPress={handleAddListingPress}>
                            <Text className={"text-xl font-rubik-bold"}>
                                Add Listing
                            </Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            }
        />
    )
}
export default Listings
