import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is banned or account is closed
    const { data: profile } = await supabase
        .from("profiles")
        .select("is_banned, account_closed, account_type")
        .eq("user_id", user.id)
        .single();

    if (profile?.is_banned) {
        return NextResponse.json(
            { error: "Your account has been banned" },
            { status: 403 }
        );
    }

    if (profile?.account_closed) {
        return NextResponse.json(
            { error: "Your account has been closed" },
            { status: 403 }
        );
    }

    if (profile?.account_type === "seller" || profile?.account_type === "both") {
        return NextResponse.json(
            { error: "You are already a seller" },
            { status: 400 }
        );
    }

    // Upgrade buyer to seller (set to "both" so they can be both buyer and seller)
    const { data, error } = await supabase
        .from("profiles")
        .update({
            account_type: "both",
            updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

