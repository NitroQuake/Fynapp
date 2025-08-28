import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'
import AsyncStorage from "@react-native-async-storage/async-storage";
import {GoogleSignin, statusCodes} from "@react-native-google-signin/google-signin";

export const supabase = createClient("http://127.0.0.1:54321", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0", {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});

export async function login() {
    GoogleSignin.configure({
        webClientId: "884581020517-ga0cacujudfbjtumavfgsj833ikhv773.apps.googleusercontent.com", // client ID of type WEB for your server. Required to get the `idToken` on the user object, and for offline access.
        scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
    });
    try {
        await GoogleSignin.hasPlayServices();
        const response = await GoogleSignin.signIn();
        const { idToken } = await GoogleSignin.getTokens();
        if (idToken) {
            const {data, error} = await supabase.auth.signInWithIdToken({
                provider: 'google',
                token: idToken,
            });

            if (error) {
                throw error;
            }

            return true;
        } else {
            throw new Error("No idToken present");
            return false;
        }
    } catch (error: any) {
        console.log(error);

        if (error.code === statusCodes.SIGN_IN_CANCELLED) {

        } else if (error.code === statusCodes.IN_PROGRESS) {

        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {

        } else {

        }
    }
}

export async function logout() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) {
            throw error;
        }
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function getCurrentUser() {
    try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
            throw error;
        }

        if (data.user?.id) {
            return {
                ...data.user,
                avatar: "https://ui-avatars.com/api/?name=" + data.user.user_metadata.full_name
            };
        }

        return null;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function getLatestProperties() {
    try {
        const { data, error } = await supabase.from('properties').select("*").order('created_at', { ascending: false }).limit(5);

        if (error) {
            throw error;
        }

        return data;

    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getProperties({filter, query, limit }: {
    filter: string;
    query: string;
    limit?: number;
}) {
    try {
        // Start building the query
        let result = supabase.from('properties').select("*");

        let filterConditions: string[] = [];

        // Add filter conditions
        if (filter && filter !== "All") {
            filterConditions.push(`category.eq.${filter}`);
        }
        if (query) {
            filterConditions.push(`name.ilike.${query}`);
        }

        // Apply .or() only if there are conditions
        if (filterConditions.length > 0) {
            result = result.or(filterConditions.join(','));
        }

        // If a limit is provided, add it to the query
        if(limit) {
            result = result.limit(limit);
        }

        const { data, error } = await result.order("created_at", { ascending: true });

        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
}

// write function to get property by id
export async function getPropertyById({ id }: { id: string }) {
    try {
        let {data, error} = await supabase
            .from('properties')
            .select(`
                *,
                agent:agents(*)
            `)
            .eq('id', id)
            .single();

        if (error) throw error;

        data["galleries"] = await getGalleriesByIds(data.gallery_ids);
        data["reviews"] = await getReviewsByIds(data.review_ids);

        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getGalleriesByIds(ids: string[]) {
    try {
        const {data, error} = await supabase
            .from('galleries')
            .select("*")
            .in("id", ids)


        if (error) throw error;

        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getReviewsByIds(ids: string[]) {
    try {
        const {data, error} = await supabase
            .from('reviews')
            .select("*")
            .in("id", ids)


        if (error) throw error;

        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}
