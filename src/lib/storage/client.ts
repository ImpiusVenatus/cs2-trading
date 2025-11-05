import { createClient } from "@/lib/supabase/server";
import { createClient as createBrowserClient } from "@/lib/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * File types supported by the storage system
 */
export type FileType = "profile_picture" | "nid_document";

/**
 * Upload file to Supabase Storage
 * @param supabase - Supabase client instance (must have authenticated user session)
 * @param file - File to upload
 * @param fileType - Type of file (profile_picture or nid_document)
 * @param userId - User ID who owns the file
 * @returns Object with storage path and public URL
 */
export async function uploadFile(
    supabase: SupabaseClient,
    file: File,
    fileType: FileType,
    userId: string
): Promise<{ path: string; url: string }> {
    
    // Get file extension
    const fileExt = file.name.split(".").pop();
    const timestamp = Date.now();
    const fileName = `${fileType}-${timestamp}.${fileExt}`;
    
    // Determine bucket and folder based on file type
    const bucket = "user-files";
    const folder = fileType === "profile_picture" ? "profile-pictures" : "nid-documents";
    const filePath = `${folder}/${userId}/${fileName}`;
    
    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false, // Don't overwrite existing files
        });
    
    if (error) {
        throw new Error(`Failed to upload file: ${error.message}`);
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);
    
    return {
        path: filePath,
        url: urlData.publicUrl,
    };
}

/**
 * Generate a signed URL for private file access
 * @param supabase - Supabase client instance (must have authenticated user session)
 * @param filePath - Storage path of the file
 * @param expiresIn - Expiration time in seconds (default: 3600 = 1 hour)
 * @returns Signed URL and expiration timestamp
 */
export async function getSignedUrl(
    supabase: SupabaseClient,
    filePath: string,
    expiresIn: number = 3600
): Promise<{ url: string; expiresAt: string }> {
    
    const bucket = "user-files";
    
    const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(filePath, expiresIn);
    
    if (error) {
        throw new Error(`Failed to generate signed URL: ${error.message}`);
    }
    
    const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();
    
    return {
        url: data.signedUrl,
        expiresAt,
    };
}

/**
 * Delete file from Supabase Storage
 * @param supabase - Supabase client instance (must have authenticated user session)
 * @param filePath - Storage path of the file to delete
 */
export async function deleteFile(supabase: SupabaseClient, filePath: string): Promise<void> {
    
    const bucket = "user-files";
    
    const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);
    
    if (error) {
        throw new Error(`Failed to delete file: ${error.message}`);
    }
}

/**
 * Get public URL for a file (if bucket is public)
 * @param filePath - Storage path of the file
 * @returns Public URL
 */
export function getPublicUrl(filePath: string): string {
    const supabase = createBrowserClient();
    const bucket = "user-files";
    
    const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);
    
    return data.publicUrl;
}

