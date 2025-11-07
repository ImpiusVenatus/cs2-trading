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

        // Check if user is banned or account is closed
        const { data: profile } = await supabase
            .from("profiles")
            .select("is_banned, account_closed")
            .eq("user_id", user.id)
            .single();

        if (profile?.is_banned) {
            return NextResponse.json(
                { error: "Your account has been banned" },
                { status: 403 }
            );
        }

        if (profile?.account_closed) {
            return NextResponse.json(
                { error: "Your account has been closed" },
                { status: 403 }
            );
        }

        // Parse form data
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: "File size exceeds 5MB limit" },
                { status: 400 }
            );
        }

        // Validate file type (only images for listings)
        const allowedMimeTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
        ];
        if (!allowedMimeTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "Invalid file type. Only JPEG, PNG, and WebP are allowed" },
                { status: 400 }
            );
        }

        // Upload file to Supabase Storage
        const fileExt = file.name.split(".").pop();
        const timestamp = Date.now();
        const fileName = `listing-image-${timestamp}.${fileExt}`;
        const bucket = "user-files";
        const folder = "listing-images";
        const filePath = `${folder}/${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, file, {
                cacheControl: "3600",
                upsert: false,
            });

        if (uploadError) {
            console.error("Error uploading file:", uploadError);
            return NextResponse.json(
                { error: `Failed to upload file: ${uploadError.message}` },
                { status: 500 }
            );
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return NextResponse.json({
            url: urlData.publicUrl,
            path: filePath,
        });
    } catch (error) {
        console.error("Error uploading listing image:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

