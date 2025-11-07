import { createClient as createServiceClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { imageUrl } = body;

        if (!imageUrl) {
            return NextResponse.json(
                { error: "Image URL is required" },
                { status: 400 }
            );
        }

        // Extract file path from various URL formats
        let filePath: string | null = null;

        // Pattern 1: Public URL - /storage/v1/object/public/user-files/[path]
        const publicUrlPattern = /\/storage\/v1\/object\/public\/user-files\/(.+?)(?:\?|$)/;
        const publicMatch = imageUrl.match(publicUrlPattern);
        if (publicMatch) {
            filePath = publicMatch[1];
        }

        // Pattern 2: Signed URL - /storage/v1/object/sign/user-files/[path]?token=...
        if (!filePath) {
            const signedUrlPattern = /\/storage\/v1\/object\/sign\/user-files\/([^?]+)/;
            const signedMatch = imageUrl.match(signedUrlPattern);
            if (signedMatch) {
                filePath = signedMatch[1];
            }
        }

        // Pattern 3: Any other Supabase storage URL format
        if (!filePath) {
            const supabaseUrlPattern = /\/storage\/v1\/object\/[^\/]+\/user-files\/(.+?)(?:\?|$)/;
            const match = imageUrl.match(supabaseUrlPattern);
            if (match) {
                filePath = match[1];
            }
        }

        // If we found a file path, use service role to create a signed URL (works without user auth)
        if (filePath) {
            // Check if it's a listing image
            if (filePath.startsWith('listing-images/')) {
                const serviceClient = createServiceClient(
                    env.SUPABASE_URL,
                    env.SUPABASE_SERVICE_ROLE_KEY
                );

                const { data: signedUrlData, error: signedError } = await serviceClient.storage
                    .from("user-files")
                    .createSignedUrl(filePath, 3600 * 24); // 24 hour expiry

                if (!signedError && signedUrlData) {
                    return NextResponse.json({
                        url: signedUrlData.signedUrl,
                    });
                }
            }

            // Fallback: try public URL (might work if bucket is public)
            const publicUrl = `${env.SUPABASE_URL}/storage/v1/object/public/user-files/${filePath}`;
            return NextResponse.json({
                url: publicUrl,
            });
        }

        // Fallback: return the original URL
        return NextResponse.json({
            url: imageUrl,
        });
    } catch (error) {
        console.error("Error getting listing image URL:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

