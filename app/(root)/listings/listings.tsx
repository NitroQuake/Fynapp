import {View, Text, TouchableOpacity, Image, ActivityIndicator, FlatList} from 'react-native'
import React from 'react'
import {SafeAreaView} from "react-native-safe-area-context";
import {router} from "expo-router";
import icons from "@/constants/icons";
import {Card} from "@/components/Cards";
import NoResults from "@/components/NoResults";

const Listings = () => {
    const handleAddListingPress = () => router.push("/listings/edit-listing");

    return (
        <FlatList
            // data={properties}
            // renderItem={({item}) => <Card item={item} onPress={() => handleCardPress(item.id)}/>}
            // keyExtractor={(item) => item.id}
            // numColumns={2} contentContainerClassName={"pb-32"}
            // columnWrapperClassName={"flex gap-5 px-5"}
            // showsVerticalScrollIndicator={false}
            // ListEmptyComponent={
            //     loading ? (
            //         <ActivityIndicator size="large" className={"text-primary-300 mt-5"}/>
            //     ) : <NoResults />
            // }
            ListHeaderComponent={
                <SafeAreaView className={"bg-white h-full"}>
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
