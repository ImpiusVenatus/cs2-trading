export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    user_id: string;
                    full_name: string | null;
                    email: string | null;
                    phone: string | null;
                    address: string | null;
                    division: string | null;
                    district: string | null;
                    postal_code: string | null;
                    bio: string | null;
                    account_type: "buyer" | "seller" | "both" | null;
                    current_mode: "selling" | "buying" | null; // For sellers to toggle between modes
                    profile_picture_url: string | null;
                    nid_document_url: string | null;
                    verification_status: "pending" | "verified" | "rejected" | null;
                    is_banned: boolean;
                    ban_reason: string | null;
                    banned_at: string | null;
                    account_closed: boolean;
                    account_closed_at: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    full_name?: string | null;
                    email?: string | null;
                    phone?: string | null;
                    address?: string | null;
                    division?: string | null;
                    district?: string | null;
                    postal_code?: string | null;
                    bio?: string | null;
                    account_type?: "buyer" | "seller" | "both" | null;
                    current_mode?: "selling" | "buying" | null;
                    profile_picture_url?: string | null;
                    nid_document_url?: string | null;
                    verification_status?: "pending" | "verified" | "rejected" | null;
                    is_banned?: boolean;
                    ban_reason?: string | null;
                    banned_at?: string | null;
                    account_closed?: boolean;
                    account_closed_at?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    full_name?: string | null;
                    email?: string | null;
                    phone?: string | null;
                    address?: string | null;
                    division?: string | null;
                    district?: string | null;
                    postal_code?: string | null;
                    bio?: string | null;
                    account_type?: "buyer" | "seller" | "both" | null;
                    current_mode?: "selling" | "buying" | null;
                    profile_picture_url?: string | null;
                    nid_document_url?: string | null;
                    verification_status?: "pending" | "verified" | "rejected" | null;
                    is_banned?: boolean;
                    ban_reason?: string | null;
                    banned_at?: string | null;
                    account_closed?: boolean;
                    account_closed_at?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            files: {
                Row: {
                    id: string;
                    user_id: string;
                    file_type: "profile_picture" | "nid_document";
                    file_name: string;
                    file_size: number;
                    mime_type: string;
                    storage_path: string;
                    storage_bucket: string;
                    public_url: string | null;
                    signed_url: string | null;
                    signed_url_expires_at: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    file_type: "profile_picture" | "nid_document";
                    file_name: string;
                    file_size: number;
                    mime_type: string;
                    storage_path: string;
                    storage_bucket?: string;
                    public_url?: string | null;
                    signed_url?: string | null;
                    signed_url_expires_at?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    file_type?: "profile_picture" | "nid_document";
                    file_name?: string;
                    file_size?: number;
                    mime_type?: string;
                    storage_path?: string;
                    storage_bucket?: string;
                    public_url?: string | null;
                    signed_url?: string | null;
                    signed_url_expires_at?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            listing_categories: {
                Row: {
                    id: string;
                    name: string;
                    slug: string;
                    description: string | null;
                    icon: string | null;
                    display_order: number;
                    is_active: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    slug: string;
                    description?: string | null;
                    icon?: string | null;
                    display_order?: number;
                    is_active?: boolean;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    slug?: string;
                    description?: string | null;
                    icon?: string | null;
                    display_order?: number;
                    is_active?: boolean;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            listing_subcategories: {
                Row: {
                    id: string;
                    category_id: string;
                    name: string;
                    slug: string;
                    display_order: number;
                    is_active: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    category_id: string;
                    name: string;
                    slug: string;
                    display_order?: number;
                    is_active?: boolean;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    category_id?: string;
                    name?: string;
                    slug?: string;
                    display_order?: number;
                    is_active?: boolean;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            listing_weapon_types: {
                Row: {
                    id: string;
                    subcategory_id: string;
                    name: string;
                    slug: string;
                    display_order: number;
                    is_active: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    subcategory_id: string;
                    name: string;
                    slug: string;
                    display_order?: number;
                    is_active?: boolean;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    subcategory_id?: string;
                    name?: string;
                    slug?: string;
                    display_order?: number;
                    is_active?: boolean;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            listings: {
                Row: {
                    id: string;
                    seller_id: string;
                    category_id: string;
                    subcategory_id: string | null;
                    weapon_type_id: string | null;
                    title: string;
                    description: string | null;
                    price: number;
                    currency: "BDT" | "USD" | "EUR";
                    condition: "Factory New" | "Minimal Wear" | "Field-Tested" | "Well-Worn" | "Battle-Scarred" | null;
                    float_value: string | null;
                    pattern_index: string | null;
                    is_stattrak: boolean;
                    is_souvenir: boolean;
                    steam_trade_link: string | null;
                    trade_link: string | null;
                    image_urls: string[] | null;
                    status: "active" | "sold" | "inactive" | "pending";
                    created_at: string;
                    updated_at: string;
                    sold_at: string | null;
                };
                Insert: {
                    id?: string;
                    seller_id: string;
                    category_id: string;
                    subcategory_id?: string | null;
                    weapon_type_id?: string | null;
                    title: string;
                    description?: string | null;
                    price: number;
                    currency?: "BDT" | "USD" | "EUR";
                    condition?: "Factory New" | "Minimal Wear" | "Field-Tested" | "Well-Worn" | "Battle-Scarred" | null;
                    float_value?: string | null;
                    pattern_index?: string | null;
                    is_stattrak?: boolean;
                    is_souvenir?: boolean;
                    steam_trade_link?: string | null;
                    trade_link?: string | null;
                    image_urls?: string[] | null;
                    status?: "active" | "sold" | "inactive" | "pending";
                    created_at?: string;
                    updated_at?: string;
                    sold_at?: string | null;
                };
                Update: {
                    id?: string;
                    seller_id?: string;
                    category_id?: string;
                    subcategory_id?: string | null;
                    weapon_type_id?: string | null;
                    title?: string;
                    description?: string | null;
                    price?: number;
                    currency?: "BDT" | "USD" | "EUR";
                    condition?: "Factory New" | "Minimal Wear" | "Field-Tested" | "Well-Worn" | "Battle-Scarred" | null;
                    float_value?: string | null;
                    pattern_index?: string | null;
                    is_stattrak?: boolean;
                    is_souvenir?: boolean;
                    steam_trade_link?: string | null;
                    trade_link?: string | null;
                    image_urls?: string[] | null;
                    status?: "active" | "sold" | "inactive" | "pending";
                    created_at?: string;
                    updated_at?: string;
                    sold_at?: string | null;
                };
            };
            chat_rooms: {
                Row: {
                    id: string;
                    participant1_id: string;
                    participant2_id: string;
                    last_message_at: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    participant1_id: string;
                    participant2_id: string;
                    last_message_at?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    participant1_id?: string;
                    participant2_id?: string;
                    last_message_at?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            messages: {
                Row: {
                    id: string;
                    chat_room_id: string;
                    sender_id: string;
                    content: string;
                    read_at: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    chat_room_id: string;
                    sender_id: string;
                    content: string;
                    read_at?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    chat_room_id?: string;
                    sender_id?: string;
                    content?: string;
                    read_at?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
            };
        };
    };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export type File = Database["public"]["Tables"]["files"]["Row"];
export type FileInsert = Database["public"]["Tables"]["files"]["Insert"];
export type FileUpdate = Database["public"]["Tables"]["files"]["Update"];

export type ListingCategory = Database["public"]["Tables"]["listing_categories"]["Row"];
export type ListingSubcategory = Database["public"]["Tables"]["listing_subcategories"]["Row"];
export type ListingWeaponType = Database["public"]["Tables"]["listing_weapon_types"]["Row"];
export type Listing = Database["public"]["Tables"]["listings"]["Row"];
export type ListingInsert = Database["public"]["Tables"]["listings"]["Insert"];
export type ListingUpdate = Database["public"]["Tables"]["listings"]["Update"];

export type ChatRoom = Database["public"]["Tables"]["chat_rooms"]["Row"];
export type ChatRoomInsert = Database["public"]["Tables"]["chat_rooms"]["Insert"];
export type ChatRoomUpdate = Database["public"]["Tables"]["chat_rooms"]["Update"];

export type Message = Database["public"]["Tables"]["messages"]["Row"];
export type MessageInsert = Database["public"]["Tables"]["messages"]["Insert"];
export type MessageUpdate = Database["public"]["Tables"]["messages"]["Update"];

