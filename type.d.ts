interface CustomInputProps {
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    className?: string;
    multiline?: boolean;
}

interface PropertyForm {
    name: string;
    description: string;
    price: string;
    condition: "New" | "Excellent" | "Good" | "Fair" | "Poor";
    address: string;
    geolocation: string;
    thumbnail_image: string;
    gallery: string[];
}

interface PropertyRow {
    profile_id: string;
    gallery_ids: string[];
    review_ids: string[];
    name: string;
    description: string;
    condition: "New" | "Excellent" | "Good" | "Fair" | "Poor";
    price: number;
    address: string;
    geolocation: string;
    image: string;
}