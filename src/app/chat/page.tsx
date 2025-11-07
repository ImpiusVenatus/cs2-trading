"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { fadeInUp } from "@/lib/animations";
import { ChatList } from "@/components/chat/chat-list";
import { ChatWindow } from "@/components/chat/chat-window";
import { useUser } from "@/lib/supabase/hooks";

function ChatPageContent() {
    const { user, loading } = useUser();
    const searchParams = useSearchParams();
    const [selectedChatRoomId, setSelectedChatRoomId] = useState<string | null>(null);

    // Check for room parameter in URL
    useEffect(() => {
        const roomId = searchParams.get("room");
        if (roomId) {
            setSelectedChatRoomId(roomId);
        }
    }, [searchParams]);

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
                <div className="text-center">
                    <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Please sign in</h2>
                    <p className="text-muted-foreground">You need to be signed in to use chat</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] px-4 py-8">
            <div className="container mx-auto max-w-7xl">
                <motion.div
                    initial="initial"
                    animate="animate"
                    className="space-y-6"
                >
                    {/* Header */}
                    <motion.div variants={fadeInUp}>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <MessageSquare className="w-8 h-8" />
                            Messages
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Chat with other traders
                        </p>
                    </motion.div>

                    {/* Chat Interface */}
                    <motion.div variants={fadeInUp} className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-12rem)]">
                        {/* Chat List */}
                        <div className="lg:col-span-1">
                            <ChatList
                                userId={user.id}
                                selectedChatRoomId={selectedChatRoomId}
                                onSelectChatRoom={setSelectedChatRoomId}
                            />
                        </div>

                        {/* Chat Window */}
                        <div className="lg:col-span-2">
                            {selectedChatRoomId ? (
                                <ChatWindow
                                    chatRoomId={selectedChatRoomId}
                                    userId={user.id}
                                />
                            ) : (
                                <div className="h-full flex items-center justify-center bg-muted/30 rounded-lg border border-border">
                                    <div className="text-center">
                                        <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                                        <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
                                        <p className="text-muted-foreground">
                                            Choose a chat from the list to start messaging
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}

export default function ChatPage() {
    return (
        <Suspense fallback={
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <ChatPageContent />
        </Suspense>
    );
}

