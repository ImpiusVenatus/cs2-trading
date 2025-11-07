import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * GET /api/chat/rooms
 * Get or create a chat room between two users
 */
export async function GET(request: Request) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const otherUserId = searchParams.get("otherUserId");

        if (!otherUserId) {
            return NextResponse.json(
                { error: "otherUserId is required" },
                { status: 400 }
            );
        }

        if (otherUserId === user.id) {
            return NextResponse.json(
                { error: "Cannot create chat room with yourself" },
                { status: 400 }
            );
        }

        // Ensure participant1_id < participant2_id for consistency
        const participant1Id =
            user.id < otherUserId ? user.id : otherUserId;
        const participant2Id =
            user.id < otherUserId ? otherUserId : user.id;

        // Check if chat room already exists
        const { data: existingRoom, error: findError } = await supabase
            .from("chat_rooms")
            .select("*")
            .eq("participant1_id", participant1Id)
            .eq("participant2_id", participant2Id)
            .single();

        if (findError && findError.code !== "PGRST116") {
            // PGRST116 is "not found" error, which is expected
            throw findError;
        }

        if (existingRoom) {
            return NextResponse.json({ chatRoom: existingRoom });
        }

        // Create new chat room
        const { data: newRoom, error: createError } = await supabase
            .from("chat_rooms")
            .insert({
                participant1_id: participant1Id,
                participant2_id: participant2Id,
            })
            .select()
            .single();

        if (createError) {
            throw createError;
        }

        return NextResponse.json({ chatRoom: newRoom });
    } catch (error) {
        console.error("Error in GET /api/chat/rooms:", error);
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to get or create chat room",
            },
            { status: 500 }
        );
    }
}


