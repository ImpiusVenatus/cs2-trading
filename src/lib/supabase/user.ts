import { createClient } from "@/lib/supabase/server";
import { Profile, ProfileUpdate } from "./types";

/**
 * Get the current user's profile
 */
export async function getCurrentUserProfile(): Promise<Profile | null> {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

    if (error || !data) {
        return null;
    }

    return data;
}

/**
 * Update user profile
 */
export async function updateUserProfile(
    updates: ProfileUpdate
): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Not authenticated" };
    }

    const { error } = await supabase
        .from("profiles")
        .update({
            ...updates,
            updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}

/**
 * Check if user is banned
 */
export async function isUserBanned(): Promise<boolean> {
    const profile = await getCurrentUserProfile();
    return profile?.is_banned ?? false;
}

/**
 * Check if user account is closed
 */
export async function isAccountClosed(): Promise<boolean> {
    const profile = await getCurrentUserProfile();
    return profile?.account_closed ?? false;
}

/**
 * Sign out user
 */
export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
}

