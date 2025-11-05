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
        };
    };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export type File = Database["public"]["Tables"]["files"]["Row"];
export type FileInsert = Database["public"]["Tables"]["files"]["Insert"];
export type FileUpdate = Database["public"]["Tables"]["files"]["Update"];

