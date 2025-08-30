import {View, Text, TextInput} from 'react-native'
import React, {useState} from 'react'
import cn from "clsx";

const CustomInput = ({
    placeholder = "Enter text",
    value,
    onChangeText,
    secureTextEntry = false,
    keyboardType = "default",
    className,
    multiline = false
}: CustomInputProps) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View className={"w-full"}>
            <TextInput
                autoCapitalize={"none"}
                autoCorrect={false}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={placeholder}
                placeholderTextColor={"#888888"}
                multiline={multiline}
                textAlignVertical={"top"}
                className={cn(`input border-2 rounded-md text-black-200 text-base font-rubik ${className}`, isFocused ? "border-primary-300" : "border-primary-black")}
            />
        </View>
    )
}
export default CustomInput
