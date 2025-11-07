import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * PATCH /api/listings/[id]/close
 * Mark a listing as sold/closed
 */
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

        const { id: listingId } = await params;

        // Verify the listing exists and belongs to the user
        const { data: listing, error: fetchError } = await supabase
            .from("listings")
            .select("id, seller_id, status")
            .eq("id", listingId)
            .single();

        if (fetchError) {
            return NextResponse.json(
                { error: "Listing not found" },
                { status: 404 }
            );
        }

        if (listing.seller_id !== user.id) {
            return NextResponse.json(
                { error: "You can only close your own listings" },
                { status: 403 }
            );
        }

        if (listing.status === "sold") {
            return NextResponse.json(
                { error: "Listing is already marked as sold" },
                { status: 400 }
            );
        }

        // Update listing status to "sold" and set sold_at timestamp
        const { data: updatedListing, error: updateError } = await supabase
            .from("listings")
            .update({
                status: "sold",
                sold_at: new Date().toISOString(),
            })
            .eq("id", listingId)
            .select()
            .single();

        if (updateError) {
            console.error("Error updating listing:", updateError);
            return NextResponse.json(
                { error: updateError.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ listing: updatedListing });
    } catch (error) {
        console.error("Error in PATCH /api/listings/[id]/close:", error);
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to close listing",
            },
            { status: 500 }
        );
    }
}

