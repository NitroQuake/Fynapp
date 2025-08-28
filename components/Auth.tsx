import {
    GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import {login} from "@/lib/supabase";

interface Props {
    onPress?: () => void;
}

export default function({onPress}: Props) {
    return (
        <GoogleSigninButton
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={onPress}
        />
    )
}