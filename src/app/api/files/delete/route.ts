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
        const { fileId, fileType } = body;

        if (!fileId && !fileType) {
            return NextResponse.json(
                { error: "Either fileId or fileType is required" },
                { status: 400 }
            );
        }

        // Get file record(s)
        let query = supabase
            .from("files")
            .select("id, storage_path, file_type")
            .eq("user_id", user.id);

        if (fileId) {
            query = query.eq("id", fileId);
        } else if (fileType) {
            query = query.eq("file_type", fileType);
        }

        const { data: fileRecords, error: fileError } = await query;

        if (fileError || !fileRecords || fileRecords.length === 0) {
            return NextResponse.json(
                { error: "File not found" },
                { status: 404 }
            );
        }

        // Delete files from storage
        const pathsToDelete = fileRecords.map((f) => f.storage_path);
        const { error: storageError } = await supabase.storage
            .from("user-files")
            .remove(pathsToDelete);

        if (storageError) {
            console.error("Error deleting files from storage:", storageError);
            // Continue with database deletion even if storage deletion fails
        }

        // Delete file records from database
        const fileIds = fileRecords.map((f) => f.id);
        const { error: dbError } = await supabase
            .from("files")
            .delete()
            .in("id", fileIds);

        if (dbError) {
            throw new Error(`Failed to delete file records: ${dbError.message}`);
        }

        // Update profile to remove file URLs
        const fileTypes = [...new Set(fileRecords.map((f) => f.file_type))];
        const profileUpdate: {
            profile_picture_url?: null;
            nid_document_url?: null;
            verification_status?: null;
        } = {};

        if (fileTypes.includes("profile_picture")) {
            profileUpdate.profile_picture_url = null;
        }
        if (fileTypes.includes("nid_document")) {
            profileUpdate.nid_document_url = null;
            profileUpdate.verification_status = null;
        }

        if (Object.keys(profileUpdate).length > 0) {
            await supabase
                .from("profiles")
                .update(profileUpdate)
                .eq("user_id", user.id);
        }

        return NextResponse.json({
            success: true,
            message: "File deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting file:", error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : "Failed to delete file",
            },
            { status: 500 }
        );
    }
}

