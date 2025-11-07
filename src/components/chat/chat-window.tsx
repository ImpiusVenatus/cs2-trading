"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { MessageInput } from "./message-input";
import { MessageList } from "./message-list";
import type { Profile } from "@/lib/supabase/types";

interface Message {
    id: string;
    chat_room_id: string;
    sender_id: string;
    content: string;
    read_at: string | null;
    created_at: string;
    sender_profile?: Profile;
}

interface ChatWindowProps {
    chatRoomId: string;
    userId: string;
}

export function ChatWindow({ chatRoomId, userId }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [otherUser, setOtherUser] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const lastMessageTimeRef = useRef<string>("1970-01-01");

    useEffect(() => {
        const supabase = createClient();

        const fetchChatData = async () => {
            try {
                // Get chat room to find other user
                const { data: room, error: roomError } = await supabase
                    .from("chat_rooms")
                    .select("*")
                    .eq("id", chatRoomId)
                    .single();

                if (roomError) throw roomError;

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

                if (profile) {
                    setOtherUser(profile);
                }

                // Fetch messages
                const { data: messagesData, error: messagesError } = await supabase
                    .from("messages")
                    .select("*")
                    .eq("chat_room_id", chatRoomId)
                    .order("created_at", { ascending: true });

                if (messagesError) throw messagesError;

                // Get sender profiles for all messages
                const messagesWithProfiles = await Promise.all(
                    (messagesData || []).map(async (msg) => {
                        const { data: senderProfile } = await supabase
                            .from("profiles")
                            .select("*")
                            .eq("user_id", msg.sender_id)
                            .single();

                        return {
                            ...msg,
                            sender_profile: senderProfile || undefined,
                        };
                    })
                );

                setMessages(messagesWithProfiles);
                
                // Update last message time ref
                if (messagesWithProfiles.length > 0) {
                    lastMessageTimeRef.current = messagesWithProfiles[messagesWithProfiles.length - 1].created_at;
                }

                // Mark messages as read
                await supabase
                    .from("messages")
                    .update({ read_at: new Date().toISOString() })
                    .eq("chat_room_id", chatRoomId)
                    .eq("read_at", null)
                    .neq("sender_id", userId);
            } catch (error) {
                console.error("Error fetching chat data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchChatData();

        // Subscribe to new messages using Broadcast (works without replication)
        const channel = supabase
            .channel(`chat:${chatRoomId}`, {
                config: {
                    broadcast: { self: true },
                },
            })
            .on("broadcast", { event: "new_message" }, async (payload) => {
                const newMessage = payload.payload as Message;

                // Get sender profile
                const { data: senderProfile } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("user_id", newMessage.sender_id)
                    .single();

                setMessages((prev) => {
                    // Avoid duplicates
                    if (prev.some((m) => m.id === newMessage.id)) {
                        return prev;
                    }
                    return [
                        ...prev,
                        {
                            ...newMessage,
                            sender_profile: senderProfile || undefined,
                        },
                    ];
                });

                // Mark as read if it's not from current user
                if (newMessage.sender_id !== userId) {
                    await supabase
                        .from("messages")
                        .update({ read_at: new Date().toISOString() })
                        .eq("id", newMessage.id);
                }

                // Scroll to bottom
                setTimeout(() => {
                    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
                }, 100);
            })
            .subscribe();

        // Also poll for new messages as a fallback (every 2 seconds)
        // This ensures messages are received even if broadcast fails
        const pollInterval = setInterval(async () => {
            const { data: newMessages } = await supabase
                .from("messages")
                .select("*")
                .eq("chat_room_id", chatRoomId)
                .gt("created_at", lastMessageTimeRef.current)
                .order("created_at", { ascending: true });

            if (newMessages && newMessages.length > 0) {
                const messagesWithProfiles = await Promise.all(
                    newMessages.map(async (msg) => {
                        const { data: senderProfile } = await supabase
                            .from("profiles")
                            .select("*")
                            .eq("user_id", msg.sender_id)
                            .single();

                        return {
                            ...msg,
                            sender_profile: senderProfile || undefined,
                        };
                    })
                );

                setMessages((prev) => {
                    const existingIds = new Set(prev.map((m) => m.id));
                    const uniqueNew = messagesWithProfiles.filter(
                        (m) => !existingIds.has(m.id)
                    );
                    if (uniqueNew.length > 0) {
                        lastMessageTimeRef.current = uniqueNew[uniqueNew.length - 1].created_at;
                    }
                    return [...prev, ...uniqueNew];
                });
            }
        }, 2000);

        return () => {
            supabase.removeChannel(channel);
            clearInterval(pollInterval);
        };
    }, [chatRoomId, userId]);

    useEffect(() => {
        // Scroll to bottom when messages change
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (content: string) => {
        if (!content.trim()) return;

        const supabase = createClient();

        // Insert message
        const { data: message, error } = await supabase
            .from("messages")
            .insert({
                chat_room_id: chatRoomId,
                sender_id: userId,
                content: content.trim(),
            })
            .select()
            .single();

        if (error) {
            console.error("Error sending message:", error);
            return;
        }

        // Broadcast the message to all subscribers
        const channel = supabase.channel(`chat:${chatRoomId}`);
        await channel.send({
            type: "broadcast",
            event: "new_message",
            payload: message,
        });
    };

    if (loading) {
        return (
            <Card className="h-full p-4">
                <div className="flex items-center justify-center h-full">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            </Card>
        );
    }

    const displayName = otherUser?.full_name || "Unknown User";
    const initial = displayName.charAt(0).toUpperCase();

    return (
        <Card className="h-full flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {initial}
                </div>
                <div>
                    <h2 className="font-semibold">{displayName}</h2>
                    <p className="text-xs text-muted-foreground">
                        {otherUser?.account_type || "User"}
                    </p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
                <MessageList messages={messages} userId={userId} />
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
                <MessageInput onSend={handleSendMessage} />
            </div>
        </Card>
    );
}

