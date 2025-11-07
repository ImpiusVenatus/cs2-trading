import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { imageUrl } = body;

        if (!imageUrl) {
            return NextResponse.json(
                { error: "Image URL is required" },
                { status: 400 }
            );
        }

        // If it's already a public URL from Supabase Storage, try to extract the path
        // Supabase public URLs format: https://[project].supabase.co/storage/v1/object/public/[bucket]/[path]
        const supabaseUrlPattern = /\/storage\/v1\/object\/public\/user-files\/(.+)/;
        const match = imageUrl.match(supabaseUrlPattern);
        
        if (match) {
            const filePath = match[1];
            
            // Try to get signed URL (works even if bucket is private)
            const { data: signedUrlData, error: signedError } = await supabase.storage
                .from("user-files")
                .createSignedUrl(filePath, 3600); // 1 hour expiry
            
            if (!signedError && signedUrlData) {
                return NextResponse.json({
                    url: signedUrlData.signedUrl,
                });
            }
        }

        // If we can't create a signed URL, return the original URL
        // It might be a public URL that works, or a default image
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

