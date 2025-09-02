import {View, Text, ScrollView, FlatList, ActivityIndicator, TouchableOpacity, Image} from 'react-native'
import React from 'react'
import {SafeAreaView} from "react-native-safe-area-context";
import CustomInput from "@/components/CustomInput";
import {CartCard} from "@/components/Cards";
import NoResults from "@/components/NoResults";
import {router} from "expo-router";
import icons from "@/constants/icons";
import {useGlobalContext} from "@/lib/global-provider";
import {useSupabase} from "@/lib/useSupabase";
import {getCartItems, removeFromCart} from "@/lib/supabase";

const Cart = () => {
    const { user } = useGlobalContext();

    const {data: properties, loading, refetch} = useSupabase({
        fn: getCartItems,
        params: {
            userId: user?.id!,
        }
    });

    const handleCardPress = (id: string) => router.push(`/properties/${id}`);

    const removeFromCartPress = async (propertyId: string, userId: string) => {
        await removeFromCart(propertyId, userId);
        refetch({
            userId: user?.id!
        });
    }

    return (
        <SafeAreaView className={"bg-white h-full"}>
            <FlatList
                data={properties}
                renderItem={({item}) => <CartCard item={item} onPress={() => handleCardPress(item.id)} onDeletePress={() => removeFromCartPress(item.id, user?.id!)}/>}
                keyExtractor={(item) => item.id}
                numColumns={1}
                contentContainerClassName={"pb-40"}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    loading ? (
                        <ActivityIndicator size="large" className={"text-primary-300 mt-5"}/>
                    ) : <NoResults />
                }
                ListHeaderComponent={
                    <View className={"flex items-center py-5"}>
                        <Text className={"font-rubik-extrabold text-5xl"}>Cart</Text>
                    </View>
                }
            />

            <View className="absolute mb-[70px] bg-white bottom-0 w-full rounded-t-2xl border-t border-r border-l border-primary-200 p-7">
                <View className="flex flex-row items-center justify-between gap-10">
                    <View className="flex flex-col items-start">
                        <Text className="text-black-200 text-xs font-rubik-medium">
                            Price
                        </Text>
                        <Text
                            numberOfLines={1}
                            className="text-primary-300 text-start text-2xl font-rubik-bold"
                        >
                            $1200
                        </Text>
                    </View>

                    <TouchableOpacity className="flex-1 flex flex-row items-center justify-center bg-primary-300 py-3 rounded-full shadow-md shadow-zinc-400">
                        <Text className="text-white text-lg text-center font-rubik-bold">
                            Purchase All
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}
export default Cart
