"use client";

import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "./types";

export function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const supabase = createClient();

        const getUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        };

        getUser();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    return { user, loading };
}

export function useProfile() {
    const { user, loading: userLoading } = useUser();
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["profile", user?.id],
        enabled: !!user && !userLoading,
        queryFn: async () => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("user_id", user!.id)
                .single();
            if (error) {
                // eslint-disable-next-line no-console
                console.error("Error fetching profile:", error);
                return null;
            }
            return data as Profile;
        },
        staleTime: 10 * 60 * 1000, // 10 minutes
        gcTime: 30 * 60 * 1000, // 30 minutes in cache
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const setProfile = (next: Profile | null) => {
        queryClient.setQueryData(["profile", user?.id], next);
    };

    return { profile: query.data ?? null, loading: userLoading || query.isLoading, refetch: query.refetch, setProfile };
}

