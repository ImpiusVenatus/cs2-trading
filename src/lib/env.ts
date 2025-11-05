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

    // Development
    NODE_ENV: process.env.NODE_ENV || "development",
    IS_DEVELOPMENT: process.env.NODE_ENV === "development",
    IS_PRODUCTION: process.env.NODE_ENV === "production",
} as const;

// Validate required Supabase environment variables
if (typeof window !== "undefined" && !env.SUPABASE_URL) {
    console.warn("⚠️ NEXT_PUBLIC_SUPABASE_URL is not set");
}

if (typeof window !== "undefined" && !env.SUPABASE_ANON_KEY) {
    console.warn("⚠️ NEXT_PUBLIC_SUPABASE_ANON_KEY is not set");
}


