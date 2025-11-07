import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get("category_id");

        if (!categoryId) {
            return NextResponse.json(
                { error: "category_id is required" },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        const { data, error } = await supabase
            .from("listing_subcategories")
            .select("*")
            .eq("category_id", categoryId)
            .eq("is_active", true)
            .order("display_order", { ascending: true });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ subcategories: data || [] });
    } catch (error) {
        console.error("Error fetching subcategories:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}





