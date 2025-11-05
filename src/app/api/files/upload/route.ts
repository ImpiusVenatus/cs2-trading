import { createClient } from "@/lib/supabase/server";
import { uploadFile, getSignedUrl } from "@/lib/storage/client";
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
        const fileType = formData.get("fileType") as "profile_picture" | "nid_document";

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        if (!fileType || !["profile_picture", "nid_document"].includes(fileType)) {
            return NextResponse.json(
                { error: "Invalid file type. Must be 'profile_picture' or 'nid_document'" },
                { status: 400 }
            );
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: "File size exceeds 5MB limit" },
                { status: 400 }
            );
        }

        // Validate file type
        const allowedMimeTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
            "application/pdf",
        ];
        if (!allowedMimeTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "Invalid file type. Only JPEG, PNG, WebP, and PDF are allowed" },
                { status: 400 }
            );
        }

        // Delete old file of the same type if it exists
        const { data: existingFiles } = await supabase
            .from("files")
            .select("id, storage_path")
            .eq("user_id", user.id)
            .eq("file_type", fileType)
            .single();

        if (existingFiles) {
            // Delete from storage
            const { error: deleteError } = await supabase.storage
                .from("user-files")
                .remove([existingFiles.storage_path]);

            if (deleteError) {
                console.error("Error deleting old file:", deleteError);
                // Continue with upload even if deletion fails
            }

            // Delete from database
            await supabase
                .from("files")
                .delete()
                .eq("id", existingFiles.id);
        }

        // Upload file to Supabase Storage (pass the authenticated client)
        const { path, url } = await uploadFile(supabase, file, fileType, user.id);

        // Generate signed URL (valid for 1 hour, will be regenerated when needed)
        const { url: signedUrl, expiresAt } = await getSignedUrl(supabase, path, 3600);

        // Debug: Check auth context before insert
        const {
            data: { user: authUser },
            error: authError,
        } = await supabase.auth.getUser();
        
        console.log("🔍 Auth Debug:", {
            userFromGetUser: user?.id,
            authUserFromClient: authUser?.id,
            authError: authError?.message,
            userMatch: user?.id === authUser?.id,
        });

        // Test auth.uid() in database context
        const { data: authUidTest, error: authUidError } = await supabase.rpc(
            "test_auth_uid"
        );
        
        console.log("🔍 Database auth.uid() Test:", {
            authUid: authUidTest,
            authUidError: authUidError?.message,
            matchesUserId: authUidTest === user.id,
            isNull: authUidTest === null,
        });

        // Test if we can query with RLS (this will verify auth.uid() works)
        const { data: testQuery, error: testError } = await supabase
            .from("files")
            .select("id")
            .eq("user_id", user.id)
            .limit(1);
        
        console.log("🔍 RLS Test Query:", {
            canQuery: !testError,
            testError: testError?.message,
            testErrorCode: testError?.code,
        });

        // Save file metadata to database - try direct insert first
        const insertData = {
            user_id: user.id,
            file_type: fileType,
            file_name: file.name,
            file_size: file.size,
            mime_type: file.type,
            storage_path: path,
            storage_bucket: "user-files",
            public_url: url,
            signed_url: signedUrl,
            signed_url_expires_at: expiresAt,
        };

        console.log("🔍 Insert Data:", {
            user_id: insertData.user_id,
            file_type: insertData.file_type,
            storage_path: insertData.storage_path,
        });

        const { data: fileRecord, error: dbError } = await supabase
            .from("files")
            .insert(insertData)
            .select()
            .single();

        if (dbError) {
            console.error("❌ Database Insert Error:", {
                message: dbError.message,
                code: dbError.code,
                details: dbError.details,
                hint: dbError.hint,
                fullError: JSON.stringify(dbError, null, 2),
            });
            
            // If database insert fails, try to delete the uploaded file
            await supabase.storage.from("user-files").remove([path]);
            throw new Error(`Failed to save file metadata: ${dbError.message}`);
        }

        // Update profile with the file URL
        const profileUpdateField =
            fileType === "profile_picture" ? "profile_picture_url" : "nid_document_url";

        // If NID is uploaded, set verification status to pending
        const profileUpdate: any = {
            [profileUpdateField]: signedUrl, // Use signed URL for now
        };

        if (fileType === "nid_document") {
            profileUpdate.verification_status = "pending";
        }

        await supabase
            .from("profiles")
            .update(profileUpdate)
            .eq("user_id", user.id);

        return NextResponse.json({
            success: true,
            file: {
                id: fileRecord.id,
                fileType,
                fileName: file.name,
                fileSize: file.size,
                url: signedUrl,
                publicUrl: url,
            },
        });
    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : "Failed to upload file",
            },
            { status: 500 }
        );
    }
}

