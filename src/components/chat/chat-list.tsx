"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare } from "lucide-react";
import type { Profile } from "@/lib/supabase/types";

interface ChatRoom {
    id: string;
    participant1_id: string;
    participant2_id: string;
    last_message_at: string | null;
    created_at: string;
    other_user: Profile;
    last_message?: {
        content: string;
        sender_id: string;
    };
    unread_count?: number;
}

interface ChatListProps {
    userId: string;
    selectedChatRoomId: string | null;
    onSelectChatRoom: (chatRoomId: string) => void;
}

export function ChatList({ userId, selectedChatRoomId, onSelectChatRoom }: ChatListProps) {
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const supabase = createClient();

        const fetchChatRooms = async () => {
            try {
                // Fetch chat rooms where user is a participant
                const { data: rooms, error } = await supabase
                    .from("chat_rooms")
                    .select("*")
                    .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)
                    .order("last_message_at", { ascending: false, nullsFirst: false });

                if (error) throw error;

                // Fetch the other user's profile for each room
                const roomsWithProfiles = await Promise.all(
                    (rooms || []).map(async (room) => {
                        const otherUserId =
                            room.participant1_id === userId
                                ? room.participant2_id
                                : room.participant1_id;

                        // Get other user's profile
                        const { data: profile } = await supabase
                            .from("profiles")
                            .select("*")
                            .eq("user_id", otherUserId)
                            .single();

                        // Get last message
                        const { data: lastMessage } = await supabase
                            .from("messages")
                            .select("content, sender_id")
                            .eq("chat_room_id", room.id)
                            .order("created_at", { ascending: false })
                            .limit(1)
                            .single();

                        return {
                            ...room,
                            other_user: profile,
                            last_message: lastMessage || undefined,
                        };
                    })
                );

                setChatRooms(roomsWithProfiles);
            } catch (error) {
                console.error("Error fetching chat rooms:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchChatRooms();

        // Subscribe to new messages to update last_message_at
        const channel = supabase
            .channel("chat_rooms_updates")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "messages",
                },
                () => {
                    fetchChatRooms();
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "chat_rooms",
                },
                () => {
                    fetchChatRooms();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId]);

    if (loading) {
        return (
            <Card className="h-full p-4">
                <div className="flex items-center justify-center h-full">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            </Card>
        );
    }

    if (chatRooms.length === 0) {
        return (
            <Card className="h-full p-4">
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No conversations yet</p>
                    <p className="text-sm text-muted-foreground mt-2">
                        Start a new conversation from a listing
                    </p>
                </div>
            </Card>
        );
    }

    return (
        <Card className="h-full flex flex-col overflow-hidden">
            <div className="p-4 border-b border-border">
                <h2 className="text-lg font-semibold">Conversations</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
                {chatRooms.map((room) => {
                    const displayName =
                        room.other_user?.full_name || "Unknown User";
                    const initial = displayName.charAt(0).toUpperCase();

                    return (
                        <button
                            key={room.id}
                            onClick={() => onSelectChatRoom(room.id)}
                            className={cn(
                                "w-full p-4 border-b border-border hover:bg-muted/50 transition-colors text-left",
                                selectedChatRoomId === room.id && "bg-muted"
                            )}
                        >
                            <div className="flex items-start gap-3">
                                {/* Avatar */}
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                                    {initial}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="font-semibold truncate">
                                            {displayName}
                                        </h3>
                                        {room.last_message_at && (
                                            <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                                                {formatDistanceToNow(
                                                    new Date(room.last_message_at),
                                                    { addSuffix: true }
                                                )}
                                            </span>
                                        )}
                                    </div>
                                    {room.last_message && (
                                        <p className="text-sm text-muted-foreground truncate">
                                            {room.last_message.sender_id === userId
                                                ? "You: "
                                                : ""}
                                            {room.last_message.content}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </Card>
    );
}


