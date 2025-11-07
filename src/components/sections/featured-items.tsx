"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Package, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import type { Listing } from "@/lib/supabase/types";

export function FeaturedItems() {
    const router = useRouter();
    const [latestListings, setLatestListings] = useState<(Listing & { imageUrl?: string })[]>([]);
    const [loadingListings, setLoadingListings] = useState(true);

    useEffect(() => {
        const fetchLatestListings = async () => {
            try {
                const response = await fetch(`/api/listings?status=active&limit=5&offset=0`);
                if (!response.ok) throw new Error("Failed to fetch listings");
                const data = await response.json();
                const fetchedListings = data.listings || [];

                // Fetch image URLs for listings with images
                const listingsWithImages = await Promise.all(
                    fetchedListings.map(async (listing: Listing) => {
                        let imageUrl: string | undefined;
                        if (listing.image_urls && listing.image_urls.length > 0) {
                            try {
                                const imageResponse = await fetch("/api/listings/image-url", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ imageUrl: listing.image_urls[0] }),
                                });
                                if (imageResponse.ok) {
                                    const imageData = await imageResponse.json();
                                    imageUrl = imageData.url;
                                }
                            } catch (error) {
                                console.error(`Error fetching image for listing ${listing.id}:`, error);
                            }
                        }
                        return { ...listing, imageUrl };
                    })
                );

                setLatestListings(listingsWithImages);
            } catch (error) {
                console.error("Error fetching latest listings:", error);
            } finally {
                setLoadingListings(false);
            }
        };

        fetchLatestListings();
    }, []);

    const formatPrice = (price: number, currency: string) => {
        if (currency === "USD") {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
            }).format(price);
        }
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(price);
    };

    return (
        <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="space-y-8"
                >
                    <motion.div variants={fadeInUp} className="text-center space-y-4">
                        <h2 className="text-4xl font-bold">Latest Listings</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Check out the newest items available on our platform
                        </p>
                    </motion.div>

                    {loadingListings ? (
                        <motion.div variants={fadeInUp} className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
                        </motion.div>
                    ) : latestListings.length === 0 ? (
                        <motion.div variants={fadeInUp} className="text-center py-12">
                            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">No listings available at the moment</p>
                        </motion.div>
                    ) : (
                        <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                            {latestListings.map((listing, index) => (
                                <motion.div
                                    key={listing.id}
                                    variants={fadeInUp}
                                    custom={index}
                                    className="cursor-pointer"
                                    onClick={() => router.push(`/market`)}
                                >
                                    <Card className="h-full hover:shadow-lg transition-shadow">
                                        <CardContent className="p-0">
                                            {listing.imageUrl ? (
                                                <div className="relative w-full h-48 bg-muted overflow-hidden">
                                                    <img
                                                        src={listing.imageUrl}
                                                        alt={listing.title}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = "none";
                                                        }}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="relative w-full h-48 bg-muted flex items-center justify-center">
                                                    <Package className="w-12 h-12 text-muted-foreground/50" />
                                                </div>
                                            )}
                                            <div className="p-4">
                                                <h3 className="font-semibold text-sm mb-2 line-clamp-2 min-h-[2.5rem]">
                                                    {listing.title}
                                                </h3>
                                                <p className="text-lg font-bold text-primary">
                                                    {formatPrice(listing.price, listing.currency)}
                                                </p>
                                                {listing.condition && (
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {listing.condition}
                                                    </p>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    <motion.div variants={fadeInUp} className="text-center">
                        <Button
                            onClick={() => router.push("/market")}
                            variant="outline"
                            size="lg"
                        >
                            View All Listings
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
