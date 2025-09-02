import {View, Text, Image} from 'react-native'
import React from 'react'
import {Tabs} from 'expo-router';

import icons from "@/constants/icons";

// This is the icon component for the tabs
// It takes in a focused prop to determine if the tab is active or not
const TabIcon = ({focused, icon, title}: {focused: boolean; icon: any; title: string}) => (
    <View className={"flex-1 mt-3 flex flex-col items-center"}>
        <Image source={icon} tintColor={focused ? "#4B2E83" : "#666876"} resizeMode={"contain"} className={"size-6"}/>
        <Text className={`${focused ? "text-primary-300 front-rubik-medium" : "text-black-200 front-rubik"} text-xs w-full text-center mt-1`}>
            {title}
        </Text>
    </View>
)

const TabsLayout = () => {
    return (
        // This is the layout for the tabs in the app
        // the Tabs component from expo-router automatically creates tabs based on the files in the same directory as your _layout.tsx file.
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarStyle: {
                    position: "absolute",
                    backgroundColor: "white",
                    borderTopColor: "0061FF1A",
                    borderTopWidth: 1,
                    minHeight: 70,
                }
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                title: "Home",
                headerShown: false,
                tabBarIcon: ({ focused}) => (
                    <TabIcon icon={icons.home} focused={focused} title={"Home"} />
                )
            }}
            />

            <Tabs.Screen
                name="explore"
                options={{
                    title: "Explore",
                    headerShown: false,
                    tabBarIcon: ({ focused}) => (
                        <TabIcon icon={icons.search} focused={focused} title={"Explore"} />
                    )
                }}
            />

            <Tabs.Screen
                name="cart"
                options={{
                    title: "Cart",
                    headerShown: false,
                    tabBarIcon: ({ focused}) => (
                        <TabIcon icon={icons.cart} focused={focused} title={"Cart"} />
                    )
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    headerShown: false,
                    tabBarIcon: ({ focused}) => (
                        <TabIcon icon={icons.person} focused={focused} title={"Profile"} />
                    )
                }}
            />
        </Tabs>
    )
}
export default TabsLayout
