import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";

/**
 * GET /api/chat/find-user?email=...
 * Find a user by email for starting a chat
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
        const email = searchParams.get("email");

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        // Try to use the database function first (if migration was run)
        let foundUser: { user_id: string; full_name: string | null; email: string } | null = null;
        
        try {
            const { data: userData, error: functionError } = await supabase
                .rpc("find_user_by_email", { search_email: email });

            if (!functionError && userData && userData.length > 0) {
                foundUser = userData[0];
            }
        } catch (error) {
            // Function doesn't exist yet, will use fallback
            console.log("Function not available, using fallback method");
        }

        // Fallback: Use service role to query auth.users directly
        if (!foundUser) {
            try {
                // Use service role client to access auth.users
                const adminClient = createAdminClient(
                    env.SUPABASE_URL,
                    env.SUPABASE_SERVICE_ROLE_KEY,
                    {
                        auth: {
                            autoRefreshToken: false,
                            persistSession: false,
                        },
                    }
                );

                // List all users and find by email (Supabase doesn't have direct email search in admin API)
                // So we'll query profiles with service role instead
                const { data: profiles, error: profileError } = await adminClient
                    .from("profiles")
                    .select("user_id, full_name, email")
                    .ilike("email", email)
                    .limit(1);

                if (profileError) {
                    console.error("Error finding user with service role:", profileError);
                }

                if (profiles && profiles.length > 0) {
                    foundUser = profiles[0];
                } else {
                    // Last resort: Get auth user by email using admin API
                    // Note: Supabase Admin API doesn't have direct email search, so we need to list and filter
                    // For now, let's just return a helpful error
                    return NextResponse.json(
                        { 
                            error: "User not found",
                            details: `No user found with email: ${email}. Make sure:
1. The user has signed up and completed the OAuth flow
2. A profile was created for the user
3. The email matches exactly (case-insensitive)

You may need to run migration 013_create_find_user_by_email_function.sql to enable better user lookup.`
                        },
                        { status: 404 }
                    );
                }
            } catch (adminError) {
                console.error("Error with admin client:", adminError);
                return NextResponse.json(
                    { 
                        error: "Failed to lookup user",
                        details: "Service role key might not be configured. Check your environment variables."
                    },
                    { status: 500 }
                );
            }
        }

        if (foundUser.user_id === user.id) {
            return NextResponse.json(
                { error: "Cannot chat with yourself" },
                { status: 400 }
            );
        }

        return NextResponse.json({
            userId: foundUser.user_id,
            fullName: foundUser.full_name,
            email: foundUser.email,
        });
    } catch (error) {
        console.error("Error in GET /api/chat/find-user:", error);
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to find user",
            },
            { status: 500 }
        );
    }
}

