import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

export async function PATCH(request: Request) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Check if user is banned or account is closed
    const { data: profile } = await supabase
        .from("profiles")
        .select("is_banned, account_closed, email")
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

    // Remove email from updates - it's read-only and comes from auth
    const { email, ...updates } = body;

    const { data, error } = await supabase
        .from("profiles")
        .update({
            ...updates,
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

