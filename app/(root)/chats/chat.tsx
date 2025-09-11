import {View, Image, Text, ScrollView, TouchableOpacity} from 'react-native'
import React, {useEffect, useState, useRef} from 'react'
import {SafeAreaView} from "react-native-safe-area-context";
import CustomInput from "@/components/CustomInput";
import {useGlobalContext} from "@/lib/global-provider";
import {supabase} from "@/lib/supabase";
import { useLocalSearchParams } from "expo-router";
import {getUserById} from "@/lib/supabase";
import {useSupabase} from "@/lib/useSupabase";

const Chat = () => {
    const { id: otherUserID } = useLocalSearchParams<{ id: string }>();
    const {user, isLoggedIn } = useGlobalContext();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [channel, setChannel] = useState<ReturnType<typeof supabase.channel> | null>(null)
    const scrollViewRef = useRef<ScrollView>(null);

    const {data: otherUser} = useSupabase({
        fn: getUserById,
        params: {
            id: otherUserID!,
        },
    });

    useEffect(() => {
        if (!isLoggedIn) {
            return;
        }

        const roomOne = supabase.channel("room_one", {
            config: {
                broadcast: { self: true },
                presence: {
                    key: user?.id,
                },
            },
        });

        roomOne.on("broadcast", { event: "message" }, (payload) => {
            setMessages((prevMessages) => [...prevMessages, payload.payload]);
        });

        // track user presence subscribe!
        roomOne.subscribe(async (status) => {
            if (status === "SUBSCRIBED") {
                setChannel(roomOne);
                await roomOne.track({
                    id: user?.id,
                });
            }
        });

        return () => {
            roomOne.unsubscribe();
        };
    }, [isLoggedIn, user]);

    const sendMessage = async () => {
        await channel.send({
            type: "broadcast",
            event: "message",
            payload: {
                message: newMessage,
                user_name: user?.user_metadata.name,
                avatar: user?.avatar,
                timestamp: new Date().toISOString(),
            }
        });

        setNewMessage("");

        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    }

    useEffect(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    const formatTime = (isoString: string) => {
        return new Date(isoString).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    }

    return (
        <SafeAreaView className={"h-full bg-white"}>
            <View className={"flex flex-1"}>
                <View className={"flex flex-row p-2 gap-2 items-center border-b-2 border-primary-300"}>
                    <Image source={{uri: otherUser?.avatar}} className={"size-12 rounded-full"} />
                    <Text className={"text-xl font-rubik-bold"}>{otherUser?.name}</Text>
                </View>

                <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false} contentContainerClassName={"flex flex-col"}>
                    {messages.map((msg, index) => (
                        <View className={`my-2 flex flex-row w-full items-center ${msg?.user_name === user?.user_metadata?.name ? 'justify-end' : 'justify-start'}`} key={index}>
                            {msg?.user_name !== user?.user_metadata?.name && (
                                <Image source={{uri: msg?.avatar}} className={"size-12 rounded-full mr-2"} />
                            )}

                            <View className={"flex flex-col flex-1"}>
                                <View className={`p-1 max-w-[70%] rounded-xl ${msg?.user_name === user?.user_metadata?.name ? "bg-primary-300 ml-auto" : "bg-primary-100 mr-auto"}`}>
                                    <Text className={"font-rubik-medium text-white"}>
                                        {msg.message}
                                    </Text>
                                </View>
                                <View>
                                    <Text className={`font-rubik-medium text-xs opacity-75 pt-1 ${msg?.user_name === user?.user_metadata?.name ? "text-right mr-2" : "text-left ml-2"}`}>
                                        {formatTime(msg?.timestamp)}
                                    </Text>
                                </View>
                            </View>

                            {msg?.user_name === user?.user_metadata?.name && (
                                <Image source={{uri: msg?.avatar}} className={"size-12 rounded-full ml-2"} />
                            )}
                        </View>
                    ))}
                </ScrollView>

                <View className={"flex flex-row gap-2 p-2 border-t-2 border-primary-300"}>
                    <View className={"flex flex-1"}>
                        <CustomInput value={newMessage} onChangeText={(text) => setNewMessage(text)} placeholder={"Type a message..."} />
                    </View>
                    <TouchableOpacity className="flex flex-row items-center justify-center bg-primary-300 p-3 rounded-full shadow-md shadow-zinc-400" onPress={sendMessage}>
                        <Text className="text-white text-lg text-center font-rubik-bold">
                            Send
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}
export default Chat
