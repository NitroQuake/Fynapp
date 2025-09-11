import {View, Text, Image, TouchableOpacity} from 'react-native'
import React, {useState} from 'react'

import images from "@/constants/images";
import icons from "@/constants/icons";
import {Models} from "react-native-appwrite";
import { useLikedProperties } from "@/lib/liked-properties-provider";

interface Props {
    item: Models.Document;
    onPress?: () => void;
}

interface CartProps {
    item: Models.Document;
    onPress?: () => void;
    onDeletePress?: () => void;
    onPurchasePress?: () => void;
}

interface ChatCardProps {
    name: string;
    avatar: string;
    onPress?: () => void;
}

export const FeaturedCard = ({ item: {id, image, rating, name, address, price}, onPress}: Props) => {
    const { liked, addLiked, removeLiked } = useLikedProperties();
    const isLiked = liked.includes(id);

    const handleLikePress = () => {
        if (isLiked) {
            removeLiked(id);
        } else {
            addLiked(id)
        }
    }

    return (
        <TouchableOpacity onPress={onPress} className={"flex flex-col items-start w-60 h-80 relative"}>
            <Image source={{uri: image}} className={"size-full rounded-2xl"} />
            <Image source={images.cardGradient} className={"size-full rounded-2xl absolute bottom-0"} />

            <View className={"flex flex-row items-center bg-white/90 px-3 py-1.5 rounded-full absolute top-5 right-5"}>
                <Image source={icons.star} className={"size-3.5"} />
                <Text className={"text-xs font-rubik-bold text-primary-300 ml-1"}>{rating}</Text>
            </View>

            <View className={"flex flex-col items0start absolute bottom-5 inset-x-5"}>
                <Text className={"text-xl font-rubik-extrabold text-white"} numberOfLines={1}>{name}</Text>
                <Text className={"text-base font-rubik text-white"}>
                    {address}
                </Text>

                <View className={"flex flex-row items-center justify-between w-full"}>
                    <Text className={"text-xl font-rubik-extrabold text-white"}>
                        ${price}
                    </Text>
                    <TouchableOpacity onPress={handleLikePress}>
                        <Image source={isLiked ? icons.heartFilled : icons.heart} className={"size-5"}/>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export const Card = ({ item: {id, image, rating, name, address, price}, onPress}: Props) => {
    const { liked, addLiked, removeLiked } = useLikedProperties();
    const isLiked = liked.includes(id);

    const handleLikePress = () => {
        if (isLiked) {
            removeLiked(id);
        } else {
            addLiked(id);
        }
    }

    return (
        <TouchableOpacity onPress={onPress} className={"flex-1 w-full mt-4 px-3 py-4 rounded-lg bg-white shadow-lg shadow-black-100/70 relative"}>
            <View className={"flex flex-row items-center absolute px-2 top-5 right-5 bg-white/90 p-1 rounded-full z-50"}>
                <Image source={icons.star} className={"size-2.5"} />
                <Text className={"text-xs font-rubik-bold text-primary-300 ml-0.5"}>{rating}</Text>
            </View>

            <Image source={{uri: image}} className={"w-full h-40 rounded-lg"} />

            <View className={"flex flex-col mt-2"}>
                <Text className={"text-base font-rubik-bold text-black-300"}>{name}</Text>
                <Text className={"text-xs font-rubik text-black-200"}>
                    {address}
                </Text>

                <View className={"flex flex-row items-center justify-between mt-2"}>
                    <Text className={"text-xl font-rubik-bold text-primary-300"}>
                        ${price}
                    </Text>
                    <TouchableOpacity onPress={handleLikePress}>
                        <Image source={isLiked ? icons.heartFilledTinted : icons.heart} className={"w-5 h-5 mr-2"} tintColor={isLiked ? undefined : "#191d31"}/>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export const EditCard = ({ item: {image, rating, name, address, price}, onPress }: Props) => {
    return (
        <TouchableOpacity onPress={onPress} className={"flex-1 w-full mt-4 px-3 py-4 rounded-lg bg-white shadow-lg shadow-black-100/70 relative"}>
            <View className={"flex flex-row items-center absolute px-2 top-5 right-5 bg-white/90 p-1 rounded-full z-50"}>
                <Image source={icons.star} className={"size-2.5"} />
                <Text className={"text-xs font-rubik-bold text-primary-300 ml-0.5"}>{rating}</Text>
            </View>

            <Image source={{uri: image}} className={"w-full h-72 rounded-lg"} />

            <View className={"flex flex-col mt-2"}>
                <Text className={"text-base font-rubik-bold text-black-300"}>{name}</Text>
                <Text className={"text-xs font-rubik text-black-200"}>
                    {address}
                </Text>

                <View className={"flex flex-row items-center justify-between mt-2"}>
                    <Text className={"text-xl font-rubik-bold text-primary-300"}>
                        ${price}
                    </Text>
                    <Image source={icons.heart} className={"w-5 h-5 mr-2"} tintColor={"#191d31"}/>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export const CartCard = ({ item: {image, rating, name, address, price}, onPress, onDeletePress, onPurchasePress }: CartProps) => {
    return (
        <TouchableOpacity onPress={onPress} className={"flex-1 flex-row w-full gap-3 p-3 rounded-lg border-t-2 border-primary-300"}>
            <View className={"flex flex-row items-center absolute px-2 top-5 left-24 bg-white/90 p-1 rounded-full z-50"}>
                <Image source={icons.star} className={"size-2.5"} />
                <Text className={"text-xs font-rubik-bold text-primary-300 ml-0.5"}>{rating}</Text>
            </View>

            <Image source={{uri: image}} className={"w-32 h-32 rounded-lg"} />

            <View className={"flex flex-col py-1.5"}>
                <Text className={"text-2xl font-rubik-bold text-black-300"}>{name}</Text>
                <Text className={"text-m font-rubik text-black-200"}>
                    {address}
                </Text>
                <View className={"flex flex-1 justify-end"}>
                    <Text className={"text-xl font-rubik-bold text-primary-300"}>
                        ${price}
                    </Text>
                </View>
            </View>

            <View className={"flex flex-1 py-1.5"}>
                <TouchableOpacity className={"items-end"} onPress={onDeletePress}>
                    <Image source={icons.exit} className={"size-4"} tintColor={"#4B2E83"}/>
                </TouchableOpacity>
            </View>

            <TouchableOpacity className={"absolute right-3 bottom-3 justify-center bg-primary-300 p-2 rounded-full shadow-md"}>
                <Text className="text-white text-lg text-center font-rubik-bold">
                    Purchase
                </Text>
            </TouchableOpacity>
        </TouchableOpacity>
    )
}

export const ChatCard = ({ name, avatar, onPress }: ChatCardProps) => {
    return (
        <TouchableOpacity onPress={onPress} className={"flex-1 flex-row w-full gap-3 p-3 rounded-lg border-t-2 border-primary-300"}>
            <View className={"flex flex-row items-center absolute px-2 top-2 left-10 bg-primary-300 p-1 rounded-full z-50"}>
                <Text className={"text-xs font-rubik-bold text-white ml-0.5"}>5</Text>
            </View>

            <Image source={{uri: avatar}} className={"size-12 rounded-full"} />

            <View className={"flex flex-col py-0.5"}>
                <Text className={"text-2xl font-rubik-bold text-black-300"}>{name}</Text>
            </View>
        </TouchableOpacity>
    )
}
