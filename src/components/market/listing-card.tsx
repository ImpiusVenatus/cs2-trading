"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MessageSquare, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useUser } from "@/lib/supabase/hooks";
import type { Listing } from "@/lib/supabase/types";
import { toast } from "sonner";

interface ListingCardProps {
    listing: Listing & {
        category?: { name: string; slug: string } | null;
        subcategory?: { name: string; slug: string } | null;
        weapon_type?: { name: string; slug: string } | null;
        seller?: { full_name: string | null; email: string | null } | null;
    };
    imageUrl?: string;
}

export function ListingCard({ listing, imageUrl }: ListingCardProps) {
    const router = useRouter();
    const { user } = useUser();
    const [isStartingChat, setIsStartingChat] = useState(false);

    const formatPrice = (price: number, currency: string) => {
        if (currency === "USD") {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
            }).format(price);
        } else {
            return `৳${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
    };

    const handleContactSeller = async () => {
        if (!user) {
            toast.error("Please sign in to contact sellers");
            router.push("/auth/signin");
            return;
        }

        if (user.id === listing.seller_id) {
            toast.error("You are the seller. You cannot chat with yourself.");
            return;
        }

        setIsStartingChat(true);
        try {
            // Create or get chat room for this listing
            const response = await fetch(`/api/chat/rooms?otherUserId=${listing.seller_id}&listingId=${listing.id}`);

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to start chat");
            }

            const { chatRoom } = await response.json();

            // Navigate to chat page with the room ID
            router.push(`/chat?room=${chatRoom.id}`);
        } catch (error) {
            console.error("Error starting chat:", error);
            toast.error(error instanceof Error ? error.message : "Failed to start chat");
        } finally {
            setIsStartingChat(false);
        }
    };

    return (
        <motion.div
            className="group relative bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
            whileHover={{ y: -4 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Item Image */}
            <div className="relative aspect-square bg-muted/20 flex items-center justify-center overflow-hidden">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                ) : (
                    <div className="text-muted-foreground text-center">
                        <Package className="w-16 h-16 mx-auto mb-2 opacity-50" />
                        <p className="text-xs">No Image</p>
                    </div>
                )}

                {/* Contact Seller Button Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={handleContactSeller}
                        disabled={isStartingChat || user?.id === listing.seller_id}
                    >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        {isStartingChat ? "Starting..." : "Contact Seller"}
                    </Button>
                </div>
            </div>

            {/* Item Details */}
            <CardContent className="p-4 space-y-2">
                {/* Title */}
                <div>
                    <h3 className="font-semibold text-sm truncate">{listing.title}</h3>
                    {listing.category && (
                        <p className="text-xs text-muted-foreground">
                            {listing.category.name}
                            {listing.subcategory && ` • ${listing.subcategory.name}`}
                        </p>
                    )}
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                    <p className="font-bold text-green-500">{formatPrice(listing.price, listing.currency)}</p>
                    {listing.condition && (
                        <span className="text-xs text-muted-foreground">{listing.condition}</span>
                    )}
                </div>

                {/* Additional Info */}
                {(listing.float_value || listing.pattern_index) && (
                    <div className="text-xs text-muted-foreground space-y-1">
                        {listing.float_value && <p>Float: {listing.float_value}</p>}
                        {listing.pattern_index && <p>Pattern: {listing.pattern_index}</p>}
                    </div>
                )}

                {/* Seller Info */}
                {listing.seller && (
                    <div className="text-xs text-muted-foreground pt-2 border-t border-border">
                        <p>Seller: {listing.seller.full_name || listing.seller.email?.split("@")[0] || "Unknown"}</p>
                    </div>
                )}

                {/* Contact Button (Mobile) */}
                <Button
                    size="sm"
                    variant="outline"
                    className="w-full mt-2"
                    onClick={handleContactSeller}
                    disabled={isStartingChat || user?.id === listing.seller_id}
                >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    {isStartingChat ? "Starting..." : "Contact Seller"}
                </Button>
            </CardContent>
        </motion.div>
    );
}

