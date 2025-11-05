"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Package, Plus, AlertCircle, Store, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { CreateListingModal } from "./create-listing-modal";
import { BecomeSellerModal } from "./become-seller-modal";
import { useProfile, useUser } from "@/lib/supabase/hooks";
import { hasMinimumInfo, getMissingFields } from "@/lib/supabase/profile-utils";
import { toast } from "sonner";

export function ListingsTab() {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBecomeSellerModalOpen, setIsBecomeSellerModalOpen] = useState(false);
    const [isUpgrading, setIsUpgrading] = useState(false);
    const { user, loading: userLoading } = useUser();
    const { profile, loading: profileLoading, refetch } = useProfile();

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
                    ) : (
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

