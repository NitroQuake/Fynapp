import {Account, Avatars, Client, OAuthProvider} from "react-native-appwrite";
import * as Linking from "expo-linking";
import {openAuthSessionAsync} from "expo-web-browser";

export const config = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    platform: "com.lt.appy",
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
}

export const client = new Client();

client
    .setEndpoint(config.endpoint!)
    .setProject(config.projectId!)
    .setPlatform(config.platform!)

export const avatar = new Avatars(client);
export const account = new Account(client);

// Initialize the Appwrite SDK
export async function login() {
    try {
        const redirectUri = Linking.createURL("/")

        const response = await account.createOAuth2Token(OAuthProvider.Google, redirectUri);

        if (!response) throw new Error("Failed to Login");

        const browserResult = await openAuthSessionAsync(
            response.toString(),
            redirectUri,
        )

        if (browserResult.type != "success") throw new Error("Failed to Login");

        const url = new URL(browserResult.url);

        const secret = url.searchParams.get("secret")?.toString();
        const userId = url.searchParams.get("userId")?.toString();

        if(!secret || !userId) throw new Error("Failed to Login");

        const session = await account.createSession(userId, secret);

        if(!session) throw new Error("Failed to Create a Session");

        return true;
    } catch(error) {
        console.error(error);
        return false;
    }
}

// This function is used to log out the user from the Appwrite account
export async function logout() {
    try {
        await account.deleteSession("current");
        return true;
    } catch(error) {
        console.error(error);
        return false;
    }
}

// This function retrieves the current user from the Appwrite account
export async function getCurrentUser() {
    try {
        const result = await account.get();
        if (result.$id) {
            return {
                ...result,
                avatar: "https://nyc.cloud.appwrite.io/v1/avatars/initials?name=" + result.name
            };
        }

        return null;
    } catch (error) {
        console.log(error);
        return null;
    }
}