"use client";

import { useState, useEffect } from "react";
import { FileText, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { ListingSubcategory } from "@/lib/supabase/types";
import { toast } from "sonner";

interface SubscriptionFormData {
    categoryId: string;
    subcategoryId: string;
    duration: string;
    price: string;
    currency: "BDT" | "USD";
    description: string;
    accountDetails: string;
}

interface SubscriptionFormProps {
    formData: SubscriptionFormData;
    onChange: (field: keyof SubscriptionFormData, value: string) => void;
}

export function SubscriptionForm({ formData, onChange }: SubscriptionFormProps) {
    const [subscriptionsCategoryId, setSubscriptionsCategoryId] = useState<string | null>(null);
    const [subcategories, setSubcategories] = useState<ListingSubcategory[]>([]);
    const [loadingSubcategories, setLoadingSubcategories] = useState(false);

    // Fetch Subscriptions category ID on mount and auto-select it
    useEffect(() => {
        const fetchSubscriptionsCategory = async () => {
            try {
                const response = await fetch("/api/listings/categories");
                if (!response.ok) throw new Error("Failed to fetch categories");
                const { categories } = await response.json();
                const subscriptionsCategory = categories.find(
                    (cat: { slug: string }) => cat.slug === "subscriptions"
                );
                if (subscriptionsCategory) {
                    setSubscriptionsCategoryId(subscriptionsCategory.id);
                    // Always set the category ID (since it's Subscriptions)
                    onChange("categoryId", subscriptionsCategory.id);
                }
            } catch (error) {
                console.error("Error fetching Subscriptions category:", error);
            }
        };
        fetchSubscriptionsCategory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetch subcategories when category changes
    useEffect(() => {
        if (formData.categoryId && formData.categoryId === subscriptionsCategoryId) {
            fetchSubcategories(formData.categoryId);
        } else {
            setSubcategories([]);
            onChange("subcategoryId", "");
        }
    }, [formData.categoryId, subscriptionsCategoryId]);

    const fetchSubcategories = async (categoryId: string) => {
        setLoadingSubcategories(true);
        try {
            const response = await fetch(`/api/listings/subcategories?category_id=${categoryId}`);
            if (!response.ok) throw new Error("Failed to fetch subcategories");
            const { subcategories: data } = await response.json();
            setSubcategories(data || []);
        } catch (error) {
            console.error("Error fetching subcategories:", error);
            toast.error("Failed to load subscription services");
        } finally {
            setLoadingSubcategories(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Category - Read-only display */}
            <div className="space-y-2">
                <Label>Category</Label>
                <div className="px-3 py-2 bg-muted rounded-md border border-border text-sm">
                    Subscriptions
                </div>
            </div>

            {/* Subcategory Selection (Service Type) */}
            {formData.categoryId && (
                <div className="space-y-2">
                    <Label htmlFor="subcategory">
                        Service <span className="text-destructive">*</span>
                    </Label>
                    <Select
                        value={formData.subcategoryId}
                        onValueChange={(value) => onChange("subcategoryId", value)}
                        disabled={loadingSubcategories || subcategories.length === 0}
                        required
                    >
                        <SelectTrigger id="subcategory">
                            <SelectValue placeholder={loadingSubcategories ? "Loading..." : "Select service"} />
                        </SelectTrigger>
                        <SelectContent>
                            {subcategories.map((subcat) => (
                                <SelectItem key={subcat.id} value={subcat.id}>
                                    {subcat.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            {/* Duration */}
            <div className="space-y-2">
                <Label htmlFor="duration">
                    Duration <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="duration"
                    placeholder="e.g., 1 Month, 3 Months, 1 Year"
                    value={formData.duration}
                    onChange={(e) => onChange("duration", e.target.value)}
                    required
                />
            </div>

            {/* Price */}
            <div className="space-y-2">
                <Label htmlFor="price">
                    Price <span className="text-destructive">*</span>
                </Label>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm font-medium">
                            {formData.currency === "USD" ? "$" : "৳"}
                        </div>
                        <Input
                            id="price"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            value={formData.price}
                            onChange={(e) => onChange("price", e.target.value)}
                            className="pl-8"
                            required
                        />
                    </div>
                    <Select
                        value={formData.currency}
                        onValueChange={(value) => onChange("currency", value as "BDT" | "USD")}
                    >
                        <SelectTrigger className="w-32">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="BDT">BDT</SelectItem>
                            <SelectItem value="USD">USD</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Account Details */}
            <div className="space-y-2">
                <Label htmlFor="accountDetails">
                    Account Details
                    <span className="text-xs text-muted-foreground ml-1">(optional)</span>
                </Label>
                <div className="relative">
                    <Info className="absolute left-3 top-3 text-muted-foreground w-4 h-4" />
                    <Textarea
                        id="accountDetails"
                        placeholder="Any relevant account information (e.g., region, features included)"
                        value={formData.accountDetails}
                        onChange={(e) => onChange("accountDetails", e.target.value)}
                        className="pl-10 min-h-20"
                        rows={3}
                    />
                </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Label htmlFor="description">
                    Description / Notes
                    <span className="text-xs text-muted-foreground ml-1">(optional)</span>
                </Label>
                <div className="relative">
                    <FileText className="absolute left-3 top-3 text-muted-foreground w-4 h-4" />
                    <Textarea
                        id="description"
                        placeholder="Additional details about the subscription"
                        value={formData.description}
                        onChange={(e) => onChange("description", e.target.value)}
                        className="pl-10 min-h-24"
                        rows={4}
                    />
                </div>
            </div>
        </div>
    );
}

