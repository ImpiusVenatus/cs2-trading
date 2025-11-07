"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Package, Plus, AlertCircle, Store, Loader2, Edit, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { CreateListingModal } from "./create-listing-modal";
import { BecomeSellerModal } from "./become-seller-modal";
import { useProfile, useUser } from "@/lib/supabase/hooks";
import { hasMinimumInfo, getMissingFields } from "@/lib/supabase/profile-utils";
import { toast } from "sonner";
import type { Listing } from "@/lib/supabase/types";

interface ListingWithImageUrl extends Listing {
    displayImageUrl?: string;
}

export function ListingsTab() {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBecomeSellerModalOpen, setIsBecomeSellerModalOpen] = useState(false);
    const [isUpgrading, setIsUpgrading] = useState(false);
    const [listings, setListings] = useState<ListingWithImageUrl[]>([]);
    const [loadingListings, setLoadingListings] = useState(false);
    const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
    const [closingListingId, setClosingListingId] = useState<string | null>(null);
    const { user, loading: userLoading } = useUser();
    const { profile, loading: profileLoading, refetch } = useProfile();

    const fetchListings = useCallback(async () => {
        if (!user?.id) return;
        setLoadingListings(true);
        try {
            // Only fetch active listings for the "My Listings" tab
            const response = await fetch(`/api/listings?seller_id=${user.id}&status=active`);
            if (!response.ok) throw new Error("Failed to fetch listings");
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
                    return { listingId: listing.id, url: imageUrl };
                });
            
            const urlResults = await Promise.all(urlPromises);
            const urlMap: Record<string, string> = {};
            urlResults.forEach(({ listingId, url }) => {
                urlMap[listingId] = url;
            });
            setImageUrls(urlMap);
        } catch (error) {
            console.error("Error fetching listings:", error);
            toast.error("Failed to load listings");
        } finally {
            setLoadingListings(false);
        }
    }, [user?.id]);

    // Fetch listings when user is available
    useEffect(() => {
        if (user?.id && (profile?.account_type === "seller" || profile?.account_type === "both")) {
            fetchListings();
        }
    }, [user?.id, profile?.account_type, fetchListings]);

    // Listen for refresh event
    useEffect(() => {
        const handleRefresh = () => {
            console.log("Refresh listings event received");
            if (user?.id && (profile?.account_type === "seller" || profile?.account_type === "both")) {
                fetchListings();
            }
        };
        window.addEventListener("refresh-listings", handleRefresh);
        return () => window.removeEventListener("refresh-listings", handleRefresh);
    }, [user?.id, profile?.account_type, fetchListings]);

    const handleBecomeSeller = async () => {
        try {
            setIsUpgrading(true);
            const response = await fetch("/api/profile/upgrade-to-seller", {
                method: "POST",
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to upgrade to seller");
            }

            toast.success("Account upgraded to seller! Complete your profile for verification.");
            setIsBecomeSellerModalOpen(false);
            // Refetch profile to update the UI immediately
            await refetch();
        } catch (error) {
            console.error("Error upgrading to seller:", error);
            toast.error(error instanceof Error ? error.message : "Failed to upgrade account");
        } finally {
            setIsUpgrading(false);
        }
    };

    // Show loading state to prevent content flash
    // CRITICAL: Don't render ANY content until profile is fully loaded and has account_type
    // This prevents the "Become a Seller" button from flashing for sellers
    if (userLoading || profileLoading || !user || !profile || profile.account_type === null || profile.account_type === undefined) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    // Additional safety check - if we somehow get here without a valid profile, show loader
    if (!profile || profile.account_type === null || profile.account_type === undefined) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    // NOW we can safely evaluate profile properties - profile is guaranteed to exist with account_type
    const accountType = profile.account_type;
    const isSeller = accountType === "seller" || accountType === "both";
    const isBuyer = accountType === "buyer";
    const isVerified = profile.verification_status === "verified";
    const hasMinInfo = hasMinimumInfo(profile);
    const canCreateListing = isSeller && isVerified && hasMinInfo;

    return (
        <>
            <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="space-y-6"
            >
                <motion.div variants={fadeInUp} className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">My Listings</h2>
                        <p className="text-muted-foreground mt-1">
                            {isSeller
                                ? "Manage your active listings and create new ones"
                                : "You need to be a verified seller to create listings"}
                        </p>
                    </div>
                    {canCreateListing && (
                        <Button onClick={() => setIsModalOpen(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Create Listing
                        </Button>
                    )}
                </motion.div>

                {/* STRICT MUTUAL EXCLUSIVITY: Check seller first, then buyer */}
                {isSeller ? (
                    // Seller path - never show "Become a Seller" button
                    !hasMinInfo ? (
                        <motion.div variants={fadeInUp}>
                            <Card className="border-border/50">
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <AlertCircle className="w-16 h-16 text-yellow-500 mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">Complete Your Profile</h3>
                                    <p className="text-muted-foreground text-center mb-4">
                                        Please fill in your basic information (Full Name, Phone, Address, City, Postal Code) to create listings.
                                    </p>
                                    <Button onClick={() => router.push("/profile")}>
                                        Go to Profile
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ) : !isVerified ? (
                        <motion.div variants={fadeInUp}>
                            <Card className="border-border/50">
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <AlertCircle className="w-16 h-16 text-yellow-500 mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">Verification Required</h3>
                                    <p className="text-muted-foreground text-center mb-4">
                                        Your account needs to be verified before you can create listings. Complete your profile and upload your NID document for verification.
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ) : loadingListings ? (
                        <motion.div variants={fadeInUp}>
                            <Card className="border-border/50">
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground mt-4">Loading listings...</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ) : listings.length === 0 ? (
                        <motion.div variants={fadeInUp}>
                            <Card className="border-border/50">
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <Package className="w-16 h-16 text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">No listings yet</h3>
                                    <p className="text-muted-foreground text-center mb-4">
                                        Start selling by creating your first listing
                                    </p>
                                    <Button onClick={() => setIsModalOpen(true)}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create Your First Listing
                                    </Button>
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
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        console.error("Image failed to load:", displayImageUrl);
                                                        e.currentTarget.style.display = "none";
                                                    }}
                                                />
                                            </div>
                                        )}
                                        {!displayImageUrl && (
                                            <div className="relative w-full h-48 bg-muted flex items-center justify-center">
                                                <Package className="w-12 h-12 text-muted-foreground/50" />
                                            </div>
                                        )}
                                        <div className="p-4">
                                            <h3 className="font-semibold text-lg mb-2 line-clamp-2">{listing.title}</h3>
                                            <p className="text-2xl font-bold mb-2">
                                                {listing.price} {listing.currency}
                                            </p>
                                            {listing.condition && (
                                                <p className="text-sm text-muted-foreground mb-2">
                                                    Condition: {listing.condition}
                                                </p>
                                            )}
                                            <div className="flex gap-2 mt-4">
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    className="flex-1"
                                                    onClick={async () => {
                                                        if (!listing.id) return;
                                                        setClosingListingId(listing.id);
                                                        try {
                                                            const response = await fetch(`/api/listings/${listing.id}/close`, {
                                                                method: "PATCH",
                                                            });
                                                            if (!response.ok) {
                                                                const error = await response.json();
                                                                throw new Error(error.error || "Failed to close listing");
                                                            }
                                                            toast.success("Listing marked as sold and moved to history");
                                                            // Remove from active listings
                                                            setListings(prev => prev.filter(l => l.id !== listing.id));
                                                            // Dispatch event to refresh history tab
                                                            window.dispatchEvent(new CustomEvent("refresh-history"));
                                                        } catch (error) {
                                                            console.error("Error closing listing:", error);
                                                            toast.error(error instanceof Error ? error.message : "Failed to close listing");
                                                        } finally {
                                                            setClosingListingId(null);
                                                        }
                                                    }}
                                                    disabled={closingListingId === listing.id}
                                                >
                                                    {closingListingId === listing.id ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                            Closing...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CheckCircle2 className="w-4 h-4 mr-2" />
                                                            Mark as Sold
                                                        </>
                                                    )}
                                                </Button>
                                                <Button variant="outline" size="sm" className="flex-1">
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Edit
                                                </Button>
                                                <Button variant="destructive" size="sm" className="flex-1">
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )})}
                        </motion.div>
                    )
                ) : isBuyer ? (
                    // Buyer path - only show "Become a Seller" button
                    <motion.div variants={fadeInUp}>
                        <Card className="border-border/50">
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Store className="w-16 h-16 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">Become a Seller</h3>
                                <p className="text-muted-foreground text-center mb-4">
                                    Upgrade your account to seller to start creating listings and selling your CS2 items.
                                </p>
                                {!hasMinInfo && (
                                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4 w-full">
                                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                            <AlertCircle className="w-4 h-4 inline mr-1" />
                                            Complete your profile information to enable buying and selling features.
                                        </p>
                                    </div>
                                )}
                                <Button onClick={() => setIsBecomeSellerModalOpen(true)}>
                                    <Store className="w-4 h-4 mr-2" />
                                    Become a Seller
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ) : null}
            </motion.div>

            <CreateListingModal open={isModalOpen} onOpenChange={setIsModalOpen} />
            <BecomeSellerModal
                open={isBecomeSellerModalOpen}
                onOpenChange={setIsBecomeSellerModalOpen}
                onConfirm={handleBecomeSeller}
                isUpgrading={isUpgrading}
            />
        </>
    );
}

