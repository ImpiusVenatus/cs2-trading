import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { ListingInsert } from "@/lib/supabase/types";

// GET - Fetch listings (with optional filters)
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const sellerId = searchParams.get("seller_id");
        const categoryId = searchParams.get("category_id");
        const subcategoryId = searchParams.get("subcategory_id");
        const weaponTypeId = searchParams.get("weapon_type_id");
        const status = searchParams.get("status") || "active";
        const limit = parseInt(searchParams.get("limit") || "20");
        const offset = parseInt(searchParams.get("offset") || "0");

        const supabase = await createClient();

        let query = supabase
            .from("listings")
            .select(`
                *,
                category:listing_categories(*),
                subcategory:listing_subcategories(*),
                weapon_type:listing_weapon_types(*)
            `)
            .eq("status", status)
            .order("created_at", { ascending: false })
            .range(offset, offset + limit - 1);

        if (sellerId) {
            query = query.eq("seller_id", sellerId);
        }
        if (categoryId) {
            query = query.eq("category_id", categoryId);
        }
        if (subcategoryId) {
            query = query.eq("subcategory_id", subcategoryId);
        }
        if (weaponTypeId) {
            query = query.eq("weapon_type_id", weaponTypeId);
        }

        const { data, error } = await query;

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Get total count for pagination
        let countQuery = supabase
            .from("listings")
            .select("*", { count: "exact", head: true })
            .eq("status", status);

        if (sellerId) {
            countQuery = countQuery.eq("seller_id", sellerId);
        }
        if (categoryId) {
            countQuery = countQuery.eq("category_id", categoryId);
        }
        if (subcategoryId) {
            countQuery = countQuery.eq("subcategory_id", subcategoryId);
        }
        if (weaponTypeId) {
            countQuery = countQuery.eq("weapon_type_id", weaponTypeId);
        }

        const { count } = await countQuery;

        return NextResponse.json({
            listings: data || [],
            total: count || 0,
            limit,
            offset,
        });
    } catch (error) {
        console.error("Error fetching listings:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// POST - Create a new listing
export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check if user is a seller
        const { data: profile } = await supabase
            .from("profiles")
            .select("account_type, verification_status, is_banned, account_closed")
            .eq("user_id", user.id)
            .single();

        if (!profile) {
            return NextResponse.json(
                { error: "Profile not found" },
                { status: 404 }
            );
        }

        const isSeller =
            profile.account_type === "seller" || profile.account_type === "both";
        if (!isSeller) {
            return NextResponse.json(
                { error: "Only sellers can create listings" },
                { status: 403 }
            );
        }

        if (profile.is_banned || profile.account_closed) {
            return NextResponse.json(
                { error: "Your account is banned or closed" },
                { status: 403 }
            );
        }

        if (profile.verification_status !== "verified") {
            return NextResponse.json(
                { error: "Your account must be verified to create listings" },
                { status: 403 }
            );
        }

        const body = await request.json();
        const listingData: ListingInsert = {
            seller_id: user.id,
            category_id: body.category_id,
            subcategory_id: body.subcategory_id || null,
            weapon_type_id: body.weapon_type_id || null,
            title: body.title,
            description: body.description || null,
            price: parseFloat(body.price),
            currency: body.currency || "BDT",
            condition: body.condition || null,
            float_value: body.float_value || null,
            pattern_index: body.pattern_index || null,
            is_stattrak: body.is_stattrak || false,
            is_souvenir: body.is_souvenir || false,
            steam_trade_link: body.steam_trade_link || null,
            trade_link: body.trade_link || null,
            image_urls: body.image_urls || null,
            status: "active",
        };

        const { data, error } = await supabase
            .from("listings")
            .insert(listingData)
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

        return NextResponse.json({ listing: data }, { status: 201 });
    } catch (error) {
        console.error("Error creating listing:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}


