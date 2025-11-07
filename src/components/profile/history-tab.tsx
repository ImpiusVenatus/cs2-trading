"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { History, Package, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { fadeInUp } from "@/lib/animations";
import { useUser } from "@/lib/supabase/hooks";
import type { Listing } from "@/lib/supabase/types";

interface ListingWithImageUrl extends Listing {
    displayImageUrl?: string;
}

export function HistoryTab() {
    const { user } = useUser();
    const [listings, setListings] = useState<ListingWithImageUrl[]>([]);
    const [loading, setLoading] = useState(true);
    const [imageUrls, setImageUrls] = useState<Record<string, string>>({});

    const fetchHistory = useCallback(async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            // Fetch sold listings
            const response = await fetch(`/api/listings?seller_id=${user.id}&status=sold`);
            if (!response.ok) throw new Error("Failed to fetch history");
            const data = await response.json();
            const fetchedListings = data.listings || [];
            setListings(fetchedListings);

            // Fetch image URLs for listings with images
            const urlPromises = fetchedListings
                .filter((listing: Listing) => listing.image_urls && listing.image_urls.length > 0)
                .map(async (listing: Listing) => {
                    const imageUrl = listing.image_urls![0];
                    try {
                        const urlResponse = await fetch("/api/listings/image-url", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ imageUrl }),
                        });
                        if (urlResponse.ok) {
                            const urlData = await urlResponse.json();
                            return { listingId: listing.id, url: urlData.url };
                        }
                    } catch (error) {
                        console.error(`Error fetching image URL for listing ${listing.id}:`, error);
                    }
                    return null;
                });

            const urlResults = await Promise.all(urlPromises);
            const urlMap: Record<string, string> = {};
            urlResults.forEach((result) => {
                if (result) {
                    urlMap[result.listingId] = result.url;
                }
            });
            setImageUrls(urlMap);
        } catch (error) {
            console.error("Error fetching history:", error);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    // Listen for refresh events
    useEffect(() => {
        const handleRefresh = () => {
            fetchHistory();
        };
        window.addEventListener("refresh-history", handleRefresh);
        return () => window.removeEventListener("refresh-history", handleRefresh);
    }, [fetchHistory]);

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "Unknown date";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <motion.div
            initial="initial"
            animate="animate"
            className="space-y-6"
        >
            <motion.div variants={fadeInUp}>
                <h2 className="text-2xl font-bold">Transaction History</h2>
                <p className="text-muted-foreground mt-1">
                    View all your sold listings and completed transactions
                </p>
            </motion.div>

            {loading ? (
                <motion.div variants={fadeInUp}>
                    <Card className="border-border/50">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 text-muted-foreground animate-spin mb-4" />
                            <p className="text-muted-foreground">Loading history...</p>
                        </CardContent>
                    </Card>
                </motion.div>
            ) : listings.length === 0 ? (
                <motion.div variants={fadeInUp}>
                    <Card className="border-border/50">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <History className="w-16 h-16 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No transactions yet</h3>
                            <p className="text-muted-foreground text-center">
                                Your sold listings will appear here
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            ) : (
                <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {listings.map((listing) => {
                        const displayImageUrl = imageUrls[listing.id] || (listing.image_urls && listing.image_urls[0]);
                        return (
                            <Card key={listing.id} className="border-border/50">
                                <CardContent className="p-0">
                                    {displayImageUrl && (
                                        <div className="relative w-full h-48 bg-muted overflow-hidden">
                                            <img
                                                src={displayImageUrl}
                                                alt={listing.title}
                                                className="w-full h-full object-cover opacity-75"
                                                onError={(e) => {
                                                    console.error("Image failed to load:", displayImageUrl);
                                                    e.currentTarget.style.display = "none";
                                                }}
                                            />
                                        </div>
                                    )}
                                    {!displayImageUrl && (
                                        <div className="relative w-full h-48 bg-muted flex items-center justify-center opacity-75">
                                            <Package className="w-12 h-12 text-muted-foreground/50" />
                                        </div>
                                    )}
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                                                SOLD
                                            </span>
                                            {listing.sold_at && (
                                                <span className="text-xs text-muted-foreground">
                                                    {formatDate(listing.sold_at)}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{listing.title}</h3>
                                        <p className="text-2xl font-bold mb-2">
                                            {listing.price} {listing.currency}
                                        </p>
                                        {listing.condition && (
                                            <p className="text-sm text-muted-foreground">
                                                Condition: {listing.condition}
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </motion.div>
            )}
        </motion.div>
    );
}
