import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * POST /api/chat/messages
 * Send a message
 */
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
        const { chatRoomId, content } = body;

        if (!chatRoomId || !content) {
            return NextResponse.json(
                { error: "chatRoomId and content are required" },
                { status: 400 }
            );
        }

        // Verify user is a participant in the chat room
        const { data: room, error: roomError } = await supabase
            .from("chat_rooms")
            .select("*")
            .eq("id", chatRoomId)
            .single();

        if (roomError || !room) {
            return NextResponse.json(
                { error: "Chat room not found" },
                { status: 404 }
            );
        }

        if (room.participant1_id !== user.id && room.participant2_id !== user.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 403 }
            );
        }

        // Insert message
        const { data: message, error: messageError } = await supabase
            .from("messages")
            .insert({
                chat_room_id: chatRoomId,
                sender_id: user.id,
                content: content.trim(),
            })
            .select()
            .single();

        if (messageError) {
            throw messageError;
        }

        return NextResponse.json({ message });
    } catch (error) {
        console.error("Error in POST /api/chat/messages:", error);
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to send message",
            },
            { status: 500 }
        );
    }
}

