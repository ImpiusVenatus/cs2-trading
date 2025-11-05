import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const redirectTo = requestUrl.searchParams.get("redirect") || "/profile";

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            // Get the user after authentication
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (user) {
                // Check if profile exists, create if not
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("user_id", user.id)
                    .single();

                if (!profile) {
                    // Get account type from URL params (set during signup)
                    const accountTypeParam = requestUrl.searchParams.get("account_type") as "buyer" | "seller" | null;
                    const accountType = accountTypeParam || "buyer"; // Default to buyer if not specified

                    // Create profile for new user with account_type
                    const { error: insertError } = await supabase.from("profiles").insert({
                        user_id: user.id,
                        email: user.email,
                        account_type: accountType,
                        verification_status: null,
                        is_banned: false,
                        account_closed: false,
                    });

                    if (insertError) {
                        console.error("Error creating profile:", insertError);
                    }

                    // Redirect based on account type
                    const finalRedirect = accountType === "seller" ? "/profile" : "/market";
                    return NextResponse.redirect(new URL(finalRedirect, requestUrl.origin));
                } else {
                    // If profile exists but account_type is null, update it
                    if (!profile.account_type) {
                        const accountTypeParam = requestUrl.searchParams.get("account_type") as "buyer" | "seller" | null;
                        const accountType = accountTypeParam || "buyer";
                        
                        await supabase
                            .from("profiles")
                            .update({ account_type: accountType })
                            .eq("user_id", user.id);
                    }

                    // Redirect based on account type
                    const accountType = profile.account_type || requestUrl.searchParams.get("account_type") || "buyer";
                    if (accountType === "buyer" || accountType === "both") {
                        return NextResponse.redirect(new URL("/market", requestUrl.origin));
                    }
                    // Sellers go to profile
                    return NextResponse.redirect(new URL("/profile", requestUrl.origin));
                }
            }

            // Fallback redirect
            return NextResponse.redirect(new URL("/market", requestUrl.origin));
        }
    }

    // Return user to an error page with instructions
    return NextResponse.redirect(new URL("/auth/signin?error=Could not authenticate", requestUrl.origin));
}

