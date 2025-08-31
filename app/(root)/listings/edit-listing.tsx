import {View, Text, Image, TouchableOpacity, ScrollView, FlatList, Alert} from 'react-native'
import React, {useState} from 'react'
import {SafeAreaView} from "react-native-safe-area-context";
import CustomInput from "@/components/CustomInput";
import {Picker} from '@react-native-picker/picker';
import * as ImagePicker from "expo-image-picker";
import icons from "@/constants/icons";
import {addProperty, getPropertyById, updateProperty} from "@/lib/supabase";
import {isValidAddressWithOSM} from "@/lib/google";
import {useGlobalContext} from "@/lib/global-provider";
import {Redirect, useLocalSearchParams} from "expo-router";
import {useSupabase} from "@/lib/useSupabase";

const EditListing = () => {
    const { user } = useGlobalContext();
    const { property_id } = useLocalSearchParams<{ property_id?: string }>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isInitializedWithID, setIsInitializedWithID] = useState(false);
    const [form, setForm] = useState({name: "", description: "", condition: "New", address: "", geolocation: "", price: "", thumbnail_image: "", gallery: []});

    const { data: property} = property_id ?
        useSupabase({
        fn: getPropertyById,
        params: {
            id: property_id!
        },
    }) : {data: null};

    if (property && property.profile?.id !== user?.id) {
        return <Redirect href={`/properties/${property_id}`} />;
    }

    if (property && !isInitializedWithID) {
        setForm({
            name: property.name,
            description: property.description,
            condition: property.condition,
            address: property.address,
            geolocation: property.geolocation,
            price: property.price.toString(),
            thumbnail_image: property.image,
            gallery: property.galleries.map((img) => img.image),
        });
        setIsInitializedWithID(true);
    }

    const pickThumbnail = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Image,
            // allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setForm((prev) => ({...prev, thumbnail_image: result.assets[0].uri}));
        }
    };

    const pickImage = async (index?: number) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Image,
            // allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setForm((prev) => {
                let gallery = [...prev.gallery];
                if (typeof index === "number") {
                    gallery[index] = result.assets[0].uri;
                } else if (gallery.length < 3) {
                    gallery.push(result.assets[0].uri);
                }
                return { ...prev, gallery };
            })
        }
    };

    const save = async () => {
        const {name, description, condition, address, price, thumbnail_image, gallery} = form;

        if (!name || !description || !condition || !address || !price || !thumbnail_image) {
            return Alert.alert("Please fill in all required fields.");
        } else if (!/^\d+(\.\d{1,2})?$/.test(price)) { // Check if price is a valid number with up to 2 decimal places
            return Alert.alert("Please enter a valid price.");
        }

        const geolocation = await isValidAddressWithOSM(address);

        if (!geolocation) {
            return Alert.alert("Please enter a valid address in Washington.");
        }


        setForm((prev) => ({...prev, geolocation: geolocation}))

        setIsSubmitting(true);

        try {
            if (isInitializedWithID) {
                await updateProperty(form, property_id)
            } else {
                await addProperty(form, user)
            }
        } catch (error) {
            Alert.alert(error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <SafeAreaView className={"bg-white h-full"}>
            <ScrollView showsVerticalScrollIndicator={false} className={"px-5 flex gap-2"}>
                <View className={"flex items-center"}>
                    <Text className={"font-bold text-3xl mt-5"}>Edit Your Listing</Text>
                </View>
                
                <View className="mt-7 gap-2 rounded-lg shadow-lg shadow-black-100/70 bg-white p-2">
                    <Text className="text-black-300 text-xl font-rubik-bold">
                        Name
                    </Text>
                    <CustomInput className={"h-12"} value={form.name} onChangeText={(text) => setForm((prev) => ({...prev, name: text}))}></CustomInput>
                </View>

                <View className="mt-7 gap-2 rounded-lg shadow-lg shadow-black-100/70 bg-white p-2">
                    <Text className="text-black-300 text-xl font-rubik-bold">
                        Description
                    </Text>
                    <CustomInput className={"h-36"} value={form.description} onChangeText={(text) => setForm((prev) => ({...prev, description: text}))}></CustomInput>
                </View>

                <View className="mt-7 gap-2 rounded-lg shadow-lg shadow-black-100/70 bg-white p-2">
                    <Text className="text-black-300 text-xl font-rubik-bold">
                        Price ($)
                    </Text>
                    <CustomInput className={"h-12"} value={form.price} onChangeText={(text) => setForm((prev) => ({...prev, price: text}))}></CustomInput>
                </View>

                <View className="mt-7 gap-2 rounded-lg shadow-lg shadow-black-100/70 bg-white p-2">
                    <Text className="text-black-300 text-xl font-rubik-bold">
                        Condition
                    </Text>
                    <View className={"border-2 rounded-md"}>
                        <Picker selectedValue={form.condition} onValueChange={(itemValue) => setForm((prev) => ({...prev, condition: itemValue}))}>
                            <Picker.Item label="New" value="New" style={{ fontFamily: "Rubik-Regular", fontSize: 16, color: "#666876" }}/>
                            <Picker.Item label="Excellent" value="Excellent" style={{ fontFamily: "Rubik-Regular", fontSize: 16, color: "#666876" }}/>
                            <Picker.Item label="Good" value="Good" style={{ fontFamily: "Rubik-Regular", fontSize: 16, color: "#666876" }}/>
                            <Picker.Item label="Fair" value="Fair" style={{ fontFamily: "Rubik-Regular", fontSize: 16, color: "#666876" }}/>
                            <Picker.Item label="Poor" value="Poor" style={{ fontFamily: "Rubik-Regular", fontSize: 16, color: "#666876" }}/>
                        </Picker>
                    </View>
                </View>

                <View className="mt-7 gap-2 rounded-lg shadow-lg shadow-black-100/70 bg-white p-2">
                    <Text className="text-black-300 text-xl font-rubik-bold">
                        Address
                    </Text>
                    <CustomInput className={"h-12"} value={form.address} onChangeText={(text) => setForm((prev) => ({...prev, address: text}))}></CustomInput>
                </View>

                <View className={"flex-1 mt-7 gap-2 rounded-lg shadow-lg shadow-black-100/70 bg-white p-2"}>
                    <Text className="text-black-300 text-xl font-rubik-bold">
                        Thumbnail
                    </Text>
                    <TouchableOpacity className={""} onPress={pickThumbnail}>
                        {form.thumbnail_image ? (
                            <Image source={{ uri: form.thumbnail_image }} className={"size-32"} />
                        ) : (
                            <Image source={icons.chooseImage} className={"size-32"} />
                        )}
                    </TouchableOpacity>
                </View>

                <View className={"flex-1 mt-7 gap-2 rounded-lg shadow-lg shadow-black-100/70 bg-white p-2"}>
                    <Text className="text-black-300 text-xl font-rubik-bold">
                        Photo Gallery (up to 3 images)
                    </Text>
                    <View className={"flex flex-row"}>
                        <FlatList
                            contentContainerStyle={{ paddingRight: 20 }}
                            data={form.gallery}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity className={""} onPress={() => pickImage(index)}>
                                    <Image source={{ uri: item }} className="size-32"/>
                                </TouchableOpacity>
                            )}
                            contentContainerClassName="flex gap-4 mt-3"
                            ListFooterComponent = {
                                <TouchableOpacity className={""} onPress={() => pickImage()}>
                                    <Image source={icons.chooseImage} className={"size-32"} />
                                </TouchableOpacity>
                            }
                        />
                    </View>
                </View>

                <TouchableOpacity onPress={save}>
                    <Text>
                        Test Save
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    )
}
export default EditListing
