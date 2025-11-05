import { createClient } from "@/lib/supabase/server";
import { getSignedUrl } from "@/lib/storage/client";
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
        const { fileId } = body;

        if (!fileId) {
            return NextResponse.json(
                { error: "File ID is required" },
                { status: 400 }
            );
        }

        // Get file record
        const { data: fileRecord, error: fileError } = await supabase
            .from("files")
            .select("storage_path, signed_url, signed_url_expires_at")
            .eq("id", fileId)
            .eq("user_id", user.id)
            .single();

        if (fileError || !fileRecord) {
            return NextResponse.json(
                { error: "File not found" },
                { status: 404 }
            );
        }

        // Check if existing signed URL is still valid (with 5 minute buffer)
        if (
            fileRecord.signed_url &&
            fileRecord.signed_url_expires_at &&
            new Date(fileRecord.signed_url_expires_at) > new Date(Date.now() + 5 * 60 * 1000)
        ) {
            return NextResponse.json({
                url: fileRecord.signed_url,
                expiresAt: fileRecord.signed_url_expires_at,
            });
        }

        // Generate new signed URL
        const { url, expiresAt } = await getSignedUrl(fileRecord.storage_path, 3600);

        // Update file record with new signed URL
        await supabase
            .from("files")
            .update({
                signed_url: url,
                signed_url_expires_at: expiresAt,
            })
            .eq("id", fileId);

        return NextResponse.json({
            url,
            expiresAt,
        });
    } catch (error) {
        console.error("Error generating signed URL:", error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : "Failed to generate signed URL",
            },
            { status: 500 }
        );
    }
}

