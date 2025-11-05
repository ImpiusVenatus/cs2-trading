import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/lib/env";

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        env.SUPABASE_URL,
        env.SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // Refresh session if expired - required for Server Components
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Protect profile routes - require authentication
    if (request.nextUrl.pathname.startsWith("/profile") && !user) {
        const url = request.nextUrl.clone();
        url.pathname = "/auth/signin";
        url.searchParams.set("redirect", request.nextUrl.pathname);
        return NextResponse.redirect(url);
    }

    // Redirect authenticated users away from auth pages
    if (
        (request.nextUrl.pathname.startsWith("/auth/signin") ||
            request.nextUrl.pathname.startsWith("/auth/signup")) &&
        user
    ) {
        // Get user profile to determine redirect
        const { data: profile } = await supabase
            .from("profiles")
            .select("account_type")
            .eq("user_id", user.id)
            .single();

        const url = request.nextUrl.clone();
        // Sellers go to profile, buyers go to marketplace
        const isSeller = profile?.account_type === "seller" || profile?.account_type === "both";
        url.pathname = isSeller ? "/profile" : "/market";
        return NextResponse.redirect(url);
    }

    // Allow buyers to access profile page (they need it to upgrade to seller and complete profile)
    // But redirect them to market after login (handled in callback route)

    return supabaseResponse;
}

