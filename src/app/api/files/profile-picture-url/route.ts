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
        const { storagePath } = body;

        if (!storagePath) {
            return NextResponse.json(
                { error: "Storage path is required" },
                { status: 400 }
            );
        }

        // Generate a fresh signed URL (valid for 1 hour)
        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
            .from("user-files")
            .createSignedUrl(storagePath, 3600);

        if (signedUrlError) {
            console.error("Error generating signed URL:", signedUrlError);
            return NextResponse.json(
                { error: "Failed to generate signed URL" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            url: signedUrlData.signedUrl,
        });
    } catch (error) {
        console.error("Error getting profile picture URL:", error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : "Failed to get profile picture URL",
            },
            { status: 500 }
        );
    }
}

