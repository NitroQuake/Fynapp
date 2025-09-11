import {View, Text, ScrollView, TouchableOpacity, Image, FlatList, ActivityIndicator} from 'react-native'
import React, {useEffect} from 'react'
import {SafeAreaView} from "react-native-safe-area-context";
import {router, useLocalSearchParams} from "expo-router";
import icons from "@/constants/icons";
import Search from "@/components/Search";
import {ChatCard} from "@/components/Cards";
import NoResults from "@/components/NoResults";
import {useGlobalContext} from "@/lib/global-provider";
import {getChatItems} from "@/lib/supabase";
import {useSupabase} from "@/lib/useSupabase";

const Chats = () => {
    const { user } = useGlobalContext();
    const params = useLocalSearchParams<{query?: string;}>();

    const {data: users, loading, refetch} = useSupabase({
        fn: getChatItems,
        params: {
            userId: user?.id!,
            query: params.query!
        }
    });

    useEffect(() => {
        refetch({
            userId: user?.id!,
            query: params.query!
        })
    }, [params.query]);

    const handleCardPress = (id: string) => router.push(`/chats/chat?id=${id}`);

    return (
        <SafeAreaView className={"h-full bg-white"}>
            <FlatList
                data={users}
                renderItem={({item}) => <ChatCard
                    name={item.name} avatar={item.avatar} onPress={() => handleCardPress(item.id)}
                />}
                keyExtractor={(item) => item.id}
                numColumns={1}
                contentContainerClassName={"pb-32"}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    loading ? (
                        <ActivityIndicator size="large" className={"text-primary-300 mt-5"}/>
                    ) : <NoResults />
                }
                ListHeaderComponent={
                    <View className={"px-5 pb-5"}>
                        <View className={"flex flex-row items-center justify-between mt-5"}>
                            <TouchableOpacity onPress={() => router.back()} className={"flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center"}>
                                <Image source={icons.backArrow} className={"size-5"} />
                            </TouchableOpacity>
                            <Text className={"text-base mr-2 text-center dont-rubik-medium text-black-300"}>Search Your Conversations</Text>
                            <Image source={icons.bell} className={"w-6 h-6"} />
                        </View>

                        <Search />
                    </View>
                }
            />
        </SafeAreaView>
    )
}
export default Chats
