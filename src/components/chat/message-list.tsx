"use client";

import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface Message {
    id: string;
    chat_room_id: string;
    sender_id: string;
    content: string;
    read_at: string | null;
    created_at: string;
    sender_profile?: {
        full_name: string | null;
    };
}

interface MessageListProps {
    messages: Message[];
    userId: string;
}

export function MessageList({ messages, userId }: MessageListProps) {
    if (messages.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <p className="text-muted-foreground">No messages yet</p>
                    <p className="text-sm text-muted-foreground mt-2">
                        Start the conversation!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {messages.map((message) => {
                const isOwn = message.sender_id === userId;
                const displayName =
                    message.sender_profile?.full_name || "Unknown User";

                return (
                    <div
                        key={message.id}
                        className={cn(
                            "flex",
                            isOwn ? "justify-end" : "justify-start"
                        )}
                    >
                        <div
                            className={cn(
                                "max-w-[70%] rounded-lg px-4 py-2",
                                isOwn
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-foreground"
                            )}
                        >
                            {!isOwn && (
                                <p className="text-xs font-semibold mb-1 opacity-80">
                                    {displayName}
                                </p>
                            )}
                            <p className="text-sm whitespace-pre-wrap break-words">
                                {message.content}
                            </p>
                            <p
                                className={cn(
                                    "text-xs mt-1",
                                    isOwn ? "opacity-70" : "opacity-60"
                                )}
                            >
                                {formatDistanceToNow(new Date(message.created_at), {
                                    addSuffix: true,
                                })}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}


