import {Text, View, Image, TouchableOpacity, FlatList, ActivityIndicator} from "react-native";
import {router, useLocalSearchParams} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";

import icons from "@/constants/icons";
import Search from "@/components/Search";
import {Card} from "@/components/Cards";
import Filters from "@/components/Filters";
import {getProperties} from "@/lib/supabase";
import {useSupabase} from "@/lib/useSupabase";
import {useEffect} from "react";
import NoResults from "@/components/NoResults";

export default function Explore() {
    const params = useLocalSearchParams<{query?: string; filter?: string;}>();

    // Fetch properties based on the filter and query parameters
    const {data: properties, loading, refetch} = useSupabase({
        fn: getProperties,
        params: {
            filter: params.filter!,
            query: params.query!,
            limit: 20,
        },
        skip: true,
    });

    const handleCardPress = (id: string) => router.push(`/properties/${id}`);

    // Refetch properties when the component mounts or when the filter/query parameters change
    useEffect(() => {
        refetch({
            filter: params.filter!,
            query: params.query!,
            limit: 20,
        });
    }, [params.filter, params.query]);

    return (
        <SafeAreaView className={"bg-white h-full"}>
            <FlatList
                data={properties}
                renderItem={({item}) => <Card item={item} onPress={() => handleCardPress(item.id)}/>}
                keyExtractor={(item) => item.id}
                numColumns={2} contentContainerClassName={"pb-32"}
                columnWrapperClassName={"flex gap-5 px-5"}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    loading ? (
                        <ActivityIndicator size="large" className={"text-primary-300 mt-5"}/>
                    ) : <NoResults />
                }
                ListHeaderComponent={
                    <View className={"px-5"}>
                        <View className={"flex flex-row items-center justify-between mt-5"}>
                            <TouchableOpacity onPress={() => router.back()} className={"flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center"}>
                                <Image source={icons.backArrow} className={"size-5"} />
                            </TouchableOpacity>
                            <Text className={"text-base mr-2 text-center dont-rubik-medium text-black-300"}>Search for Your Ideal Item</Text>
                            <Image source={icons.bell} className={"w-6 h-6"} />
                        </View>

                        <Search />

                        <View className={"mt-5"}>
                            <Filters />
                            <Text className={"text-xl font-rubik-bold text-black-300 mt-5"}>
                                Found {properties ?.length} Properties
                            </Text>
                        </View>
                    </View>
                }
            />
        </SafeAreaView>
    );
}
