"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Package, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { ListingCard } from "@/components/market/listing-card";
import type { Listing, ListingCategory, ListingSubcategory, ListingWeaponType } from "@/lib/supabase/types";

// Extended type for listings with nested category/subcategory objects from API
type ListingWithRelations = Listing & {
    imageUrl?: string;
    category?: ListingCategory | null;
    subcategory?: ListingSubcategory | null;
    weapon_type?: ListingWeaponType | null;
};

export function FeaturedItems() {
    const router = useRouter();
    const [latestListings, setLatestListings] = useState<ListingWithRelations[]>([]);
    const [loadingListings, setLoadingListings] = useState(true);

    useEffect(() => {
        const fetchLatestListings = async () => {
            try {
                const response = await fetch(`/api/listings?status=active&limit=6&offset=0`);
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.error || "Failed to fetch listings");
                }
                const data = await response.json();
                const fetchedListings = data.listings || [];

                // Fetch image URLs for listings with images and transform to match ListingCard props
                const listingsWithImages = await Promise.all(
                    fetchedListings.map(async (listing: ListingWithRelations) => {
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
                                } else {
                                    // If image URL fetch fails, try to construct public URL directly
                                    const urlStr = listing.image_urls[0];
                                    if (urlStr.includes('storage/v1/object')) {
                                        // Extract path and construct public URL
                                        const pathMatch = urlStr.match(/\/user-files\/(.+)$/);
                                        if (pathMatch) {
                                            imageUrl = urlStr.replace(/\/storage\/v1\/object\/[^\/]+/, '/storage/v1/object/public');
                                        } else {
                                            imageUrl = urlStr;
                                        }
                                    } else {
                                        imageUrl = urlStr;
                                    }
                                }
                            } catch (error) {
                                console.error(`Error fetching image for listing ${listing.id}:`, error);
                                // Fallback to original URL
                                imageUrl = listing.image_urls[0];
                            }
                        }
                        // Transform category/subcategory/weapon_type to match ListingCard expected format
                        return {
                            ...listing,
                            imageUrl,
                            category: listing.category ? { name: listing.category.name, slug: listing.category.slug } : null,
                            subcategory: listing.subcategory ? { name: listing.subcategory.name, slug: listing.subcategory.slug } : null,
                            weapon_type: listing.weapon_type ? { name: listing.weapon_type.name, slug: listing.weapon_type.slug } : null,
                        };
                    })
                );

                setLatestListings(listingsWithImages);
            } catch (error) {
                console.error("Error fetching latest listings:", error);
                // Set empty array on error so empty state shows
                setLatestListings([]);
            } finally {
                setLoadingListings(false);
            }
        };

        fetchLatestListings();
    }, []);

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
                        <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                            {latestListings.map((listing, index) => (
                                <motion.div
                                    key={listing.id}
                                    variants={fadeInUp}
                                    custom={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.3,
                                        delay: index * 0.05,
                                        ease: "easeOut"
                                    }}
                                >
                                    <ListingCard listing={listing} imageUrl={listing.imageUrl} />
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
