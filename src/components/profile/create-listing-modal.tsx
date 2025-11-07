"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useProfile } from "@/lib/supabase/hooks";
import { hasMinimumInfo } from "@/lib/supabase/profile-utils";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ListingTypeSelector } from "@/components/listings/listing-type-selector";
import { CS2SkinForm } from "@/components/listings/cs2-skin-form";
import { SubscriptionForm } from "@/components/listings/subscription-form";
import { ReferralCodeForm } from "@/components/listings/referral-code-form";
import { toast } from "sonner";
import type { ListingInsert } from "@/lib/supabase/types";

interface CreateListingModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

type ListingTypeSlug = "cs2-skins" | "subscriptions" | "referral-codes";

interface CS2SkinFormData {
    itemName: string;
    categoryId: string;
    subcategoryId: string;
    weaponTypeId: string;
    condition: string;
    floatValue: string;
    patternIndex: string;
    isStatTrak: boolean;
    isSouvenir: boolean;
    price: string;
    currency: "BDT" | "USD";
    description: string;
    steamTradeLink: string;
    imageFile: File | null;
    imagePreview: string | null;
}

interface SubscriptionFormData {
    categoryId: string;
    subcategoryId: string;
    duration: string;
    price: string;
    currency: "BDT" | "USD";
    description: string;
    accountDetails: string;
}

interface ReferralCodeFormData {
    serviceName: string;
    code: string;
    discount: string;
    price: string;
    currency: "BDT" | "USD";
    description: string;
    terms: string;
}

export function CreateListingModal({ open, onOpenChange }: CreateListingModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);
    const [selectedTypeSlug, setSelectedTypeSlug] = useState<ListingTypeSlug | null>(null);
    const { profile } = useProfile();

    const isSeller = profile?.account_type === "seller" || profile?.account_type === "both";
    const isVerified = profile?.verification_status === "verified";
    const hasMinInfo = hasMinimumInfo(profile);
    const canCreate = isSeller && isVerified && hasMinInfo;

    // Form data for each type
    const [cs2SkinData, setCS2SkinData] = useState<CS2SkinFormData>({
        itemName: "",
        categoryId: "",
        subcategoryId: "",
        weaponTypeId: "",
        condition: "",
        floatValue: "",
        patternIndex: "",
        isStatTrak: false,
        isSouvenir: false,
        price: "",
        currency: "BDT",
        description: "",
        steamTradeLink: "",
        imageFile: null,
        imagePreview: null,
    });

    const [subscriptionData, setSubscriptionData] = useState<SubscriptionFormData>({
        categoryId: "",
        subcategoryId: "",
        duration: "",
        price: "",
        currency: "BDT",
        description: "",
        accountDetails: "",
    });

    const [referralCodeData, setReferralCodeData] = useState<ReferralCodeFormData>({
        serviceName: "",
        code: "",
        discount: "",
        price: "",
        currency: "BDT",
        description: "",
        terms: "",
    });

    useEffect(() => {
        if (open && !canCreate) {
            onOpenChange(false);
        }
    }, [open, canCreate, onOpenChange]);

    const handleTypeSelect = (typeId: string, slug: string) => {
        setSelectedTypeId(typeId);
        setSelectedTypeSlug(slug as ListingTypeSlug);
    };

    const handleBack = () => {
        setSelectedTypeId(null);
        setSelectedTypeSlug(null);
    };

    const handleCS2SkinChange = (field: keyof CS2SkinFormData, value: string | boolean | File | null) => {
        setCS2SkinData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubscriptionChange = (field: keyof SubscriptionFormData, value: string) => {
        setSubscriptionData((prev) => ({ ...prev, [field]: value }));
    };

    const handleReferralCodeChange = (field: keyof ReferralCodeFormData, value: string) => {
        setReferralCodeData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!selectedTypeId || !selectedTypeSlug) {
            toast.error("Please select a listing type");
            return;
        }

        setIsSubmitting(true);

        try {
            // Prepare data based on type
            // category_id is the listing type (CS2 Skins, Subscriptions, Referral Codes)
            let listingData: Partial<ListingInsert> = {
                category_id: selectedTypeId || null,
            };

            if (selectedTypeSlug === "cs2-skins") {
                if (!cs2SkinData.itemName || !cs2SkinData.categoryId || !cs2SkinData.subcategoryId || !cs2SkinData.price || !cs2SkinData.steamTradeLink || !cs2SkinData.imageFile) {
                    toast.error("Please fill in all required fields including category, subcategory, price, and image");
                    setIsSubmitting(false);
                    return;
                }

                // Upload image first
                let imageUrl: string | null = null;
                if (cs2SkinData.imageFile) {
                    try {
                        const imageFormData = new FormData();
                        imageFormData.append("file", cs2SkinData.imageFile);

                        const imageResponse = await fetch("/api/listings/upload-image", {
                            method: "POST",
                            body: imageFormData,
                        });

                        if (!imageResponse.ok) {
                            const error = await imageResponse.json();
                            throw new Error(error.error || "Failed to upload image");
                        }

                        const imageData = await imageResponse.json();
                        imageUrl = imageData.url;
                    } catch (error) {
                        console.error("Error uploading image:", error);
                        toast.error(error instanceof Error ? error.message : "Failed to upload image");
                        setIsSubmitting(false);
                        return;
                    }
                }

                listingData = {
                    ...listingData,
                    category_id: cs2SkinData.categoryId,
                    subcategory_id: cs2SkinData.subcategoryId || null,
                    weapon_type_id: cs2SkinData.weaponTypeId || null,
                    title: cs2SkinData.itemName,
                    condition: (cs2SkinData.condition as "Factory New" | "Minimal Wear" | "Field-Tested" | "Well-Worn" | "Battle-Scarred" | null) || null,
                    float_value: cs2SkinData.floatValue || null,
                    pattern_index: cs2SkinData.patternIndex || null,
                    is_stattrak: cs2SkinData.isStatTrak,
                    is_souvenir: cs2SkinData.isSouvenir,
                    price: parseFloat(cs2SkinData.price),
                    currency: cs2SkinData.currency,
                    description: cs2SkinData.description || null,
                    steam_trade_link: cs2SkinData.steamTradeLink,
                    image_urls: imageUrl ? [imageUrl] : null,
                };
            } else if (selectedTypeSlug === "subscriptions") {
                if (!subscriptionData.categoryId || !subscriptionData.subcategoryId || !subscriptionData.duration || !subscriptionData.price) {
                    toast.error("Please fill in all required fields including service and price");
                    setIsSubmitting(false);
                    return;
                }
                // Fetch subcategory name for title
                let serviceName = "";
                try {
                    const subcatResponse = await fetch(`/api/listings/subcategories?category_id=${subscriptionData.categoryId}`);
                    if (subcatResponse.ok) {
                        const subcatData = await subcatResponse.json();
                        const selectedSubcat = subcatData.subcategories?.find(
                            (sub: { id: string }) => sub.id === subscriptionData.subcategoryId
                        );
                        if (selectedSubcat) {
                            serviceName = selectedSubcat.name;
                        }
                    }
                } catch (error) {
                    console.error("Error fetching subcategory name:", error);
                }
                
                // Use default subscription image from public folder
                const defaultImage = "/images/listings/subscription-default.png";
                listingData = {
                    ...listingData,
                    category_id: subscriptionData.categoryId,
                    subcategory_id: subscriptionData.subcategoryId,
                    title: serviceName ? `${serviceName} - ${subscriptionData.duration}` : subscriptionData.duration,
                    price: parseFloat(subscriptionData.price),
                    currency: subscriptionData.currency,
                    description: subscriptionData.description || subscriptionData.accountDetails || null,
                    image_urls: [defaultImage],
                };
            } else if (selectedTypeSlug === "referral-codes") {
                if (!referralCodeData.serviceName || !referralCodeData.price) {
                    toast.error("Please fill in all required fields including service name and price");
                    setIsSubmitting(false);
                    return;
                }
                // Use default referral code image from public folder
                const defaultImage = "/images/listings/referral-code-default.png";
                listingData = {
                    ...listingData,
                    title: `${referralCodeData.serviceName} Referral Code${referralCodeData.code ? ` - ${referralCodeData.code}` : ""}`,
                    price: parseFloat(referralCodeData.price),
                    currency: referralCodeData.currency,
                    description: referralCodeData.description || referralCodeData.terms || null,
                    image_urls: [defaultImage],
                };
            }

            const response = await fetch("/api/listings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(listingData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to create listing");
            }

            toast.success("Listing created successfully!");
            onOpenChange(false);
            
            // Notify that a listing was created (will switch to listings tab and refresh)
            if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("listing-created"));
            }
            
            // Reset form
            setSelectedTypeId(null);
            setSelectedTypeSlug(null);
            // Clean up preview URL if it exists
            if (cs2SkinData.imagePreview) {
                URL.revokeObjectURL(cs2SkinData.imagePreview);
            }
            setCS2SkinData({
                itemName: "",
                categoryId: "",
                subcategoryId: "",
                weaponTypeId: "",
                condition: "",
                floatValue: "",
                patternIndex: "",
                isStatTrak: false,
                isSouvenir: false,
                price: "",
                currency: "BDT",
                description: "",
                steamTradeLink: "",
                imageFile: null,
                imagePreview: null,
            });
            setSubscriptionData({
                categoryId: "",
                subcategoryId: "",
                duration: "",
                price: "",
                currency: "BDT",
                description: "",
                accountDetails: "",
            });
            setReferralCodeData({
                serviceName: "",
                code: "",
                discount: "",
                price: "",
                currency: "BDT",
                description: "",
                terms: "",
            });
        } catch (error) {
            console.error("Error creating listing:", error);
            toast.error(error instanceof Error ? error.message : "Failed to create listing");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            onOpenChange(false);
            // Reset on close
            setTimeout(() => {
                setSelectedTypeId(null);
                setSelectedTypeSlug(null);
            }, 200);
        }
    };

    const renderForm = () => {
        if (!selectedTypeSlug) return null;

        switch (selectedTypeSlug) {
            case "cs2-skins":
                return <CS2SkinForm formData={cs2SkinData} onChange={handleCS2SkinChange} />;
            case "subscriptions":
                return <SubscriptionForm formData={subscriptionData} onChange={handleSubscriptionChange} />;
            case "referral-codes":
                return <ReferralCodeForm formData={referralCodeData} onChange={handleReferralCodeChange} />;
            default:
                return null;
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {selectedTypeId ? "Create New Listing" : "Select Listing Type"}
                    </DialogTitle>
                    <DialogDescription>
                        {selectedTypeId
                            ? "Fill in the details for your listing"
                            : "Choose the type of listing you want to create"}
                    </DialogDescription>
                </DialogHeader>

                {!selectedTypeId ? (
                    <ListingTypeSelector onSelectType={handleTypeSelect} />
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleBack}
                            className="mb-2"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Type Selection
                        </Button>

                        {renderForm()}

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                        Creating...
                                    </>
                                ) : (
                                    "Create Listing"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
