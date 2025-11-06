import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const subcategoryId = searchParams.get("subcategory_id");

        if (!subcategoryId) {
            return NextResponse.json(
                { error: "subcategory_id is required" },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        const { data, error } = await supabase
            .from("listing_weapon_types")
            .select("*")
            .eq("subcategory_id", subcategoryId)
            .eq("is_active", true)
            .order("display_order", { ascending: true });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ weaponTypes: data || [] });
    } catch (error) {
        console.error("Error fetching weapon types:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}


