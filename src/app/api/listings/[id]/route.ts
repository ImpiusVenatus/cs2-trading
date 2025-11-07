import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { ListingUpdate } from "@/lib/supabase/types";

// GET - Get a single listing by ID
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient();
        const { id } = await params;

        const { data, error } = await supabase
            .from("listings")
            .select(`
                *,
                category:listing_categories(*),
                subcategory:listing_subcategories(*),
                weapon_type:listing_weapon_types(*)
            `)
            .eq("id", id)
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        if (!data) {
            return NextResponse.json(
                { error: "Listing not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ listing: data });
    } catch (error) {
        console.error("Error fetching listing:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// PATCH - Update a listing
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        // Check if listing exists and belongs to user
        const { data: listing, error: fetchError } = await supabase
            .from("listings")
            .select("seller_id")
            .eq("id", id)
            .single();

        if (fetchError || !listing) {
            return NextResponse.json(
                { error: "Listing not found" },
                { status: 404 }
            );
        }

        if (listing.seller_id !== user.id) {
            return NextResponse.json(
                { error: "You can only update your own listings" },
                { status: 403 }
            );
        }

        const body = await request.json();
        const updateData: ListingUpdate = {};

        if (body.title !== undefined) updateData.title = body.title;
        if (body.description !== undefined)
            updateData.description = body.description;
        if (body.price !== undefined) updateData.price = parseFloat(body.price);
        if (body.currency !== undefined) updateData.currency = body.currency;
        if (body.condition !== undefined) updateData.condition = body.condition;
        if (body.float_value !== undefined)
            updateData.float_value = body.float_value;
        if (body.pattern_index !== undefined)
            updateData.pattern_index = body.pattern_index;
        if (body.is_stattrak !== undefined)
            updateData.is_stattrak = body.is_stattrak;
        if (body.is_souvenir !== undefined)
            updateData.is_souvenir = body.is_souvenir;
        if (body.steam_trade_link !== undefined)
            updateData.steam_trade_link = body.steam_trade_link;
        if (body.trade_link !== undefined) updateData.trade_link = body.trade_link;
        if (body.image_urls !== undefined)
            updateData.image_urls = body.image_urls;
        if (body.status !== undefined) updateData.status = body.status;

        const { data, error } = await supabase
            .from("listings")
            .update(updateData)
            .eq("id", id)
            .select(`
                *,
                category:listing_categories(*),
                subcategory:listing_subcategories(*),
                weapon_type:listing_weapon_types(*)
            `)
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ listing: data });
    } catch (error) {
        console.error("Error updating listing:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// DELETE - Delete a listing
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        // Check if listing exists and belongs to user
        const { data: listing, error: fetchError } = await supabase
            .from("listings")
            .select("seller_id")
            .eq("id", id)
            .single();

        if (fetchError || !listing) {
            return NextResponse.json(
                { error: "Listing not found" },
                { status: 404 }
            );
        }

        if (listing.seller_id !== user.id) {
            return NextResponse.json(
                { error: "You can only delete your own listings" },
                { status: 403 }
            );
        }

        const { error } = await supabase
            .from("listings")
            .delete()
            .eq("id", id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting listing:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}




