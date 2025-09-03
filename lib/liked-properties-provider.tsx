import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import {addToLiked, removeFromLiked, getLikedIDs, getLikedProperties, getPropertyById} from "@/lib/supabase";
import {useGlobalContext} from "@/lib/global-provider";
import {useSupabase} from "@/lib/useSupabase";

interface LikedPropertiesContextType {
    liked: string[];
    likedProperties: [];
    addLiked: (id: string) => Promise<void>;
    removeLiked: (id: string) => Promise<void>;
    setLiked: (ids: string[]) => void;
}

const LikedPropertiesContext = createContext<LikedPropertiesContextType | undefined>(undefined);

export const LikedPropertiesProvider = ({ children }: { children: ReactNode }) => {
    const [liked, setLiked] = useState<string[]>([]);
    const [likedProperties, setLikedProperties] = useState([]);

    const { user } = useGlobalContext();

    useEffect(() => {
        if (!user?.id) return;
        (async () => {
            const ids = await getLikedIDs({ userId: user.id });
            setLiked(ids);
            const properties = await getLikedProperties({ userId: user.id });
            setLikedProperties(properties);
        })();
    }, [user?.id]);

    const addLiked = async (id: string) => {
        if (!liked.includes(id)) {
            setLiked(prev => [...prev, id]);
            await addToLiked(id, user?.id!);
            const property = await getPropertyById({ id: id });
            setLikedProperties(prev => [...prev, property]);
        }
    };

    const removeLiked = async (id: string) => {
        setLiked(prev => prev.filter(x => x !== id));
        await removeFromLiked(id, user?.id!);
        setLikedProperties(prev => prev.filter(x => x.id !== id));
    };

    return (
        <LikedPropertiesContext.Provider value={{ liked, likedProperties, addLiked, removeLiked, setLiked }}>
            {children}
        </LikedPropertiesContext.Provider>
    );
};

export const useLikedProperties = (): LikedPropertiesContextType => {
    const context = useContext(LikedPropertiesContext);

    if (!context) throw new Error("useLikedProperties must be used within a LikedPropertiesProvider");

    return context;
};