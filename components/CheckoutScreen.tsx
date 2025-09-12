import {View, Text, Alert, TouchableOpacity} from 'react-native'
import React, {ReactNode, useEffect, useState} from 'react'
import {useStripe} from "@stripe/stripe-react-native";
import {supabase} from "@/lib/supabase";

interface CheckoutScreenProps {
    children: ReactNode;
    className?: string;
    price: number;
}

const CheckoutScreen = ({ children, className, price }: CheckoutScreenProps) => {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);
    const amount = price * 100; // Convert to cents

    async function createPaymentIntent() {
        const {data, error} = await supabase.functions.invoke("stripe", {
            body: {amount},
        });

        if (error) throw error;
        return {
            clientSecret: data.clientSecret,
            ephemeralKey: data.ephemeralKey,
            customer: data.customer,
        };
    }

    async function initializePaymentSheet() {
        const {clientSecret, ephemeralKey, customer} = await createPaymentIntent();

        const {error} = await initPaymentSheet({
            customerId: customer,
            customerEphemeralKeySecret: ephemeralKey,
            paymentIntentClientSecret: clientSecret,
            merchantDisplayName: "Fynapp",
            allowsDelayedPaymentMethods: true,
        });
        if (!error) {
            setLoading(true);
        }
    }

    const openPaymentSheet = async () => {
        const { error } = await presentPaymentSheet();

        if (error) {
            Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
            Alert.alert('Success', 'Your order is confirmed!');
        }
    };

    useEffect(() => {
        initializePaymentSheet();
    }, []);

    return (
        <TouchableOpacity disabled={!loading} className={className} onPress={openPaymentSheet}>
            {children}
        </TouchableOpacity>
    )
}
export default CheckoutScreen
