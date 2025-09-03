import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { addToLiked, removeFromLiked, getLikedIDs} from "@/lib/supabase";
import {useGlobalContext} from "@/lib/global-provider";

interface LikedPropertiesContextType {
    liked: string[];
    addLiked: (id: string) => Promise<void>;
    removeLiked: (id: string) => Promise<void>;
    setLiked: (ids: string[]) => void;
}

const LikedPropertiesContext = createContext<LikedPropertiesContextType | undefined>(undefined);

export const LikedPropertiesProvider = ({ children }: { children: ReactNode }) => {
    const [liked, setLiked] = useState<string[]>([]);

    const { user } = useGlobalContext();

    useEffect(() => {
        if (!user?.id) return;
        (async () => {
            const ids = await getLikedIDs({ userId: user.id });
            setLiked(ids);
        })();
    }, [user?.id]);

    const addLiked = async (id: string) => {
        if (!liked.includes(id)) {
            setLiked(prev => [...prev, id]);
            await addToLiked(id, user?.id!);
        }
    };

    const removeLiked = async (id: string) => {
        setLiked(prev => prev.filter(x => x !== id));
        await removeFromLiked(id, user?.id!);
    };

    return (
        <LikedPropertiesContext.Provider value={{ liked, addLiked, removeLiked, setLiked }}>
            {children}
        </LikedPropertiesContext.Provider>
    );
};

export const useLikedProperties = (): LikedPropertiesContextType => {
    const context = useContext(LikedPropertiesContext);

    if (!context) throw new Error("useLikedProperties must be used within a LikedPropertiesProvider");

    return context;
};