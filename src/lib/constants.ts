// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// App Configuration
export const APP_NAME = "CS2 Trading";
export const APP_DESCRIPTION = "Counter-Strike 2 trading platform";

// Theme Configuration
export const THEME_STORAGE_KEY = "cs2-trading-theme";

// Animation Durations
export const ANIMATION_DURATION = {
    FAST: 0.2,
    NORMAL: 0.4,
    SLOW: 0.6,
} as const;

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    "2XL": 1536,
} as const;
