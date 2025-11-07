import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";

/**
 * GET /api/chat/profile?userId={userId}
 * Get a user's profile for chat display
 * Uses service role to bypass RLS for chat purposes
 */
export async function GET(request: Request) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json(
                { error: "userId is required" },
                { status: 400 }
            );
        }

        // Use service role client to bypass RLS for chat profile lookups
        const serviceClient = createServiceClient(
            env.SUPABASE_URL,
            env.SUPABASE_SERVICE_ROLE_KEY
        );

        const { data: profile, error } = await serviceClient
            .from("profiles")
            .select("id, user_id, full_name, email")
            .eq("user_id", userId)
            .maybeSingle();

        if (error) {
            console.error("Error fetching profile:", error);
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        if (!profile) {
            return NextResponse.json(
                { error: "Profile not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ profile });
    } catch (error) {
        console.error("Error in GET /api/chat/profile:", error);
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch profile",
            },
            { status: 500 }
        );
    }
}

