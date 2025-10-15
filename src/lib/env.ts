// Environment configuration
export const env = {
    // App Configuration
    API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
    APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || "CS2 Trading",
    APP_DESCRIPTION: process.env.NEXT_PUBLIC_APP_DESCRIPTION || "Counter-Strike 2 trading platform",

    // Development
    NODE_ENV: process.env.NODE_ENV || "development",
    IS_DEVELOPMENT: process.env.NODE_ENV === "development",
    IS_PRODUCTION: process.env.NODE_ENV === "production",
} as const;

