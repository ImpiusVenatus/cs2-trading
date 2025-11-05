import type { NextRequest } from "next/server";

// Environment configuration
export const env = {
    // Supabase Configuration
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || "",

    // App Configuration
    API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
    APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || "CS2Trade BD",
    APP_DESCRIPTION: process.env.NEXT_PUBLIC_APP_DESCRIPTION || "Counter-Strike 2 trading platform for Bangladesh",
    
    // Site URL - Used for OAuth redirects
    SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "",

    // Development
    NODE_ENV: process.env.NODE_ENV || "development",
    IS_DEVELOPMENT: process.env.NODE_ENV === "development",
    IS_PRODUCTION: process.env.NODE_ENV === "production",
} as const;

/**
 * Get the base URL for the application
 * Uses NEXT_PUBLIC_SITE_URL if set, otherwise uses request origin or window.location
 */
export function getBaseUrl(request?: Request | NextRequest): string {
    // Priority 1: Use environment variable if set (for production)
    if (env.SITE_URL) {
        return env.SITE_URL;
    }
    
    // Priority 2: Server-side: use request origin
    if (request) {
        try {
            const url = new URL(request.url);
            return url.origin;
        } catch {
            // Fallback
        }
    }
    
    // Priority 3: Client-side: use window.location
    if (typeof window !== "undefined") {
        return window.location.origin;
    }
    
    // Fallback for server-side when no request is available
    return "http://localhost:3000";
}

// Validate required Supabase environment variables
if (typeof window !== "undefined" && !env.SUPABASE_URL) {
    console.warn("⚠️ NEXT_PUBLIC_SUPABASE_URL is not set");
}

if (typeof window !== "undefined" && !env.SUPABASE_ANON_KEY) {
    console.warn("⚠️ NEXT_PUBLIC_SUPABASE_ANON_KEY is not set");
}


