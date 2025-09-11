import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'
import AsyncStorage from "@react-native-async-storage/async-storage";
import {GoogleSignin, statusCodes} from "@react-native-google-signin/google-signin";
import {Alert} from "react-native";

export const supabase = createClient("http://127.0.0.1:54321", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0", {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});

export async function signUpWithEmail(email: string, user_name: string, password: string) {
    try {
        const { data, error} = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    display_name: user_name, // Include the display name here
                },
            },
        })

        if (error) {
            throw error;
        }

        if (!data) {
            Alert.alert('Please check your inbox for email verification!')
            return false;
        }

        await addProfile();

        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function loginWithEmail(email: string, password: string) {
    try {
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })

        if (error) {
            throw error;
        } else {
            await addProfile()
        }

        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function loginWithGoogle() {
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
            } else {
                await addProfile()
            }

            return true;
        } else {
            throw new Error("No idToken present");
            return false;
        }
    } catch (error: any) {
        console.error(error);

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

async function addProfile() {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
        throw error;
    }

    if (user) {
        // Check if profile exists
        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

        if (!profile) {
            if (user.app_metadata.provider === "google") {
                // Insert new profile with Google user info
                await supabase.from("profiles").insert({
                    id: user.id,
                    name: user.user_metadata.full_name,
                    email: user.email,
                    avatar: "https://ui-avatars.com/api/?name=" + user.user_metadata.full_name
                });
            } else if (user.app_metadata.provider === "email"){
                await supabase.from("profiles").insert({
                    id: user.id,
                    name: user.user_metadata.display_name,
                    email: user.email,
                    avatar: "https://ui-avatars.com/api/?name=" + user.user_metadata.display_name
                });
            }
        }
    }
}

export async function getCurrentUser() {
    try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
            throw error;
        }

        if (data.user?.id) {
            if (data.user.app_metadata.provider === "google"){
                return {
                    ...data.user,
                    name: data.user.user_metadata.full_name,
                    avatar: "https://ui-avatars.com/api/?name=" + data.user.user_metadata.full_name
                };
            } else if (data.user.app_metadata.provider === "email") {
                return {
                    ...data.user,
                    name: data.user.user_metadata.display_name,
                    avatar: "https://ui-avatars.com/api/?name=" + data.user.user_metadata.display_name
                };
            }
        }

        return null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getUserById({ id }: { id: string }) {
    try {
        const {data, error} = await supabase.from("profiles").select("*").eq("id", id).single();

        if (error) {
            throw error;
        }

        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function isInCart({propertyId, userId}: {propertyId: string; userId: string}) {
    try {
        const {data, error} = await supabase.from("profiles").select("cart").eq("id", userId).single();

        if (error) {
            throw error;
        }

        return data.cart?.includes(propertyId);
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function addToCart(propertyId: string, userId: string) {
    try {
        const {data, error} = await supabase.from("profiles").select("cart").eq("id", userId).single();

        if (error) {
            throw error;
        }

        // Append the new UUID
        const updatedCartIds = [...(data.cart || []), propertyId];

        // Update the array in the database
        const { error: updateError } = await supabase
            .from("profiles")
            .update({ cart: updatedCartIds })
            .eq('id', userId);

        if (updateError) throw updateError;

    } catch(error) {
        console.error(error);
    }
}

export async function removeFromCart(propertyId: string, userId: string) {
    try {
        const {data, error} = await supabase.from("profiles").select("cart").eq("id", userId).single();

        if (error) {
            throw error;
        }

        // Remove the UUID
        const updatedCartIds = (data.cart || []).filter((id: string) => id !== propertyId);

        // Update the array in the database
        const { error: updateError } = await supabase
            .from("profiles")
            .update({ cart: updatedCartIds })
            .eq('id', userId);

        if (updateError) throw updateError;

    } catch(error) {
        console.error(error);
    }
}

export async function getCartItems({userId}: {userId: string}) {
    try {
        let result = []
        const {data, error} = await supabase.from("profiles").select("cart").eq("id", userId).single();

        if (error) {
            throw error;
        }

        for (let i = 0; i < data.cart.length; i++) {
            const property = await getPropertyById({id: data.cart[i]});
            result.push(property);
        }

        return result;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getChatItems({userId, query}: {userId: string, query?: string}) {
    try {
        let result = []
        const {data, error} = await supabase.from("profiles").select("chat").eq("id", userId).single();

        if (error) {
            throw error;
        }

        for (let i = 0; i < data.chat.length; i++) {
            const user = await supabase.from("profiles").select("*").eq("id", data.chat[i]).single();
            if (query) {
                if (user.data.name.toLowerCase().includes(query.toLowerCase())) {
                    result.push(user.data);
                }
            } else {
                result.push(user.data);
            }
        }

        return result;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function addToLiked(propertyId: string, userId: string) {
    try {
        const {data, error} = await supabase.from("profiles").select("liked").eq("id", userId).single();

        if (error) {
            throw error;
        }

        // Append the new UUID
        const updatedLikedIds = [...(data.liked || []), propertyId];

        // Update the array in the database
        const { error: updateError } = await supabase
            .from("profiles")
            .update({ liked: updatedLikedIds })
            .eq('id', userId);

        if (updateError) throw updateError;

    } catch(error) {
        console.error(error);
    }
}

export async function removeFromLiked(propertyId: string, userId: string) {
    try {
        const {data, error} = await supabase.from("profiles").select("liked").eq("id", userId).single();

        if (error) {
            throw error;
        }

        // Remove the UUID
        const updatedLikedIds = (data.liked || []).filter((id: string) => id !== propertyId);

        // Update the array in the database
        const {error: updateError} = await supabase
            .from("profiles")
            .update({liked: updatedLikedIds})
            .eq('id', userId);

        if (updateError) throw updateError;

    } catch (error) {
        console.error(error);
    }
}

export async function getLikedIDs({userId}: {userId: string}) {
    try {
        const {data, error} = await supabase.from("profiles").select("liked").eq("id", userId).single();

        if (error) {
            throw error;
        }

        return data.liked || [];
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function addProperty(property: PropertyForm, user: User) {
    try {
        let propertyData: PropertyRow = {
            profile_id: "",
            gallery_ids: [],
            review_ids: [],
            name: property.name,
            description: property.description,
            condition: property.condition,
            price: parseFloat(property.price),
            address: property.address,
            geolocation: property.geolocation,
            image: property.thumbnail_image,
        };

        await addImageToGallery(property.thumbnail_image);
        for (let i = 0; i < property.gallery.length; i++) {
            const uuidImage = await addImageToGallery(property.gallery[i]);
            propertyData.gallery_ids.push(uuidImage);
        }

        if (user) {
            propertyData.profile_id = user.id;
        } else {
            throw new Error("Failed to grab user");
        }

        const { error } = await supabase.from('properties').insert(propertyData);

        if (error) {
            throw error;
        }

    } catch (error) {
        console.error(error);
    }
}

export async function updateProperty(property: PropertyForm, propertyId: string) {
    try {
        let propertyData = {
            gallery_ids: [],
            name: property.name,
            description: property.description,
            condition: property.condition,
            price: parseFloat(property.price),
            address: property.address,
            geolocation: property.geolocation,
            image: property.thumbnail_image,
        };

        await addImageToGallery(property.thumbnail_image);
        for (let i = 0; i < property.gallery.length; i++) {
            const uuidImage = await addImageToGallery(property.gallery[i]);
            propertyData.gallery_ids.push(uuidImage);
        }

        const { error } = await supabase.from('properties').update(propertyData).eq('id', propertyId);

        if (error) {
            throw error;
        }

    } catch (error) {
        console.error(error);
    }
}

export async function addImageToGallery(imageUri: string) {
    try {
        const { data, error } = await supabase.from('galleries').insert({ image: imageUri }).select();

        if (error) {
            throw error;
        }

        return data[0].id;
    } catch (error) {
        console.error(error);
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

export async function getUserProperties( { userId }: { userId: string }) {
    try {
        const {data, error} = await supabase
            .from('properties')
            .select(`
                *,
                profile:profiles(*)
            `)
            .eq('profile_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getLikedProperties({ userId }: { userId: string }) {
    try {
        let result = []

        const {data, error} = await supabase.from("profiles").select("liked").eq("id", userId).single();

        if (error) {
            throw error;
        }

        for (let i = 0; i < data.liked.length; i++) {
            const property = await getPropertyById({id: data.liked[i]});
            result.push(property);
        }

        return result;
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
                profile:profiles(*)
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
