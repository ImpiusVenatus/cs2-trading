import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const supabase = await createClient();

        // Use listing_categories as listing types
        // Filter to only the main types: CS2 Skins, Subscriptions, Referral Codes
        // Handle both old "skins" and new "cs2-skins" slugs
        const { data, error } = await supabase
            .from("listing_categories")
            .select("*")
            .eq("is_active", true)
            .in("slug", ["cs2-skins", "skins", "subscriptions", "referral-codes"])
            .order("display_order", { ascending: true });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ types: data || [] });
    } catch (error) {
        console.error("Error fetching listing types:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

