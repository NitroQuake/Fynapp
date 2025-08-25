import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from '@react-native-google-signin/google-signin';
import {supabase} from "@/lib/supabase";

export default function() {
    GoogleSignin.configure({
        webClientId: "884581020517-ga0cacujudfbjtumavfgsj833ikhv773.apps.googleusercontent.com", // client ID of type WEB for your server. Required to get the `idToken` on the user object, and for offline access.
        scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
    });

    return (
        <GoogleSigninButton
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={async () => {
                try {
                    await GoogleSignin.hasPlayServices();
                    const response = await GoogleSignin.signIn();
                    const { idToken } = await GoogleSignin.getTokens();
                    if (idToken) {
                        const {data, error} = await supabase.auth.signInWithIdToken({
                            provider: 'google',
                            token: idToken,
                        });
                        console.log(error, data);
                    } else {
                        throw new Error("No idToken present");
                    }
                } catch (error: any) {
                    console.log(error);
                    if (error.code === statusCodes.SIGN_IN_CANCELLED) {

                    } else if (error.code === statusCodes.IN_PROGRESS) {

                    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {

                    } else {

                    }
                }
            }}
        />
    )
}