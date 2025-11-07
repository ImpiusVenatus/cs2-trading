"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Search, FileText, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { ListingCategory, ListingSubcategory, ListingWeaponType } from "@/lib/supabase/types";

const conditions = [
    { value: "Factory New", label: "Factory New (FN)", short: "FN" },
    { value: "Minimal Wear", label: "Minimal Wear (MW)", short: "MW" },
    { value: "Field-Tested", label: "Field-Tested (FT)", short: "FT" },
    { value: "Well-Worn", label: "Well-Worn (WW)", short: "WW" },
    { value: "Battle-Scarred", label: "Battle-Scarred (BS)", short: "BS" },
];

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

interface CS2SkinFormProps {
    formData: CS2SkinFormData;
    onChange: (field: keyof CS2SkinFormData, value: string | boolean | File | null) => void;
}

export function CS2SkinForm({ formData, onChange }: CS2SkinFormProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [cs2SkinsCategoryId, setCS2SkinsCategoryId] = useState<string | null>(null);
    const [subcategories, setSubcategories] = useState<ListingSubcategory[]>([]);
    const [weaponTypes, setWeaponTypes] = useState<ListingWeaponType[]>([]);
    const [loadingSubcategories, setLoadingSubcategories] = useState(false);
    const [loadingWeaponTypes, setLoadingWeaponTypes] = useState(false);

    // Fetch CS2 Skins category ID on mount and auto-select it
    useEffect(() => {
        const fetchCS2SkinsCategory = async () => {
            try {
                const response = await fetch("/api/listings/categories");
                if (!response.ok) throw new Error("Failed to fetch categories");
                const { categories } = await response.json();
                const cs2Category = categories.find(
                    (cat: ListingCategory) => cat.slug === "cs2-skins" || cat.slug === "skins"
                );
                if (cs2Category) {
                    setCS2SkinsCategoryId(cs2Category.id);
                    // Always set the category ID (since it's CS2 Skins)
                    onChange("categoryId", cs2Category.id);
                }
            } catch (error) {
                console.error("Error fetching CS2 Skins category:", error);
            }
        };
        fetchCS2SkinsCategory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetch subcategories when category changes
    useEffect(() => {
        if (formData.categoryId && formData.categoryId === cs2SkinsCategoryId) {
            fetchSubcategories(formData.categoryId);
        } else {
            setSubcategories([]);
            setWeaponTypes([]);
            onChange("subcategoryId", "");
            onChange("weaponTypeId", "");
        }
    }, [formData.categoryId, cs2SkinsCategoryId]);

    // Fetch weapon types when subcategory changes
    useEffect(() => {
        if (formData.subcategoryId) {
            fetchWeaponTypes(formData.subcategoryId);
        } else {
            setWeaponTypes([]);
            onChange("weaponTypeId", "");
        }
    }, [formData.subcategoryId]);

    // Cleanup preview URL on unmount
    useEffect(() => {
        return () => {
            if (formData.imagePreview) {
                URL.revokeObjectURL(formData.imagePreview);
            }
        };
    }, [formData.imagePreview]);

    const fetchSubcategories = async (categoryId: string) => {
        setLoadingSubcategories(true);
        try {
            const response = await fetch(`/api/listings/subcategories?category_id=${categoryId}`);
            if (!response.ok) throw new Error("Failed to fetch subcategories");
            const { subcategories: data } = await response.json();
            setSubcategories(data || []);
        } catch (error) {
            console.error("Error fetching subcategories:", error);
            toast.error("Failed to load subcategories");
        } finally {
            setLoadingSubcategories(false);
        }
    };

    const fetchWeaponTypes = async (subcategoryId: string) => {
        setLoadingWeaponTypes(true);
        try {
            const response = await fetch(`/api/listings/weapon-types?subcategory_id=${subcategoryId}`);
            if (!response.ok) throw new Error("Failed to fetch weapon types");
            const { weaponTypes: data } = await response.json();
            setWeaponTypes(data || []);
        } catch (error) {
            console.error("Error fetching weapon types:", error);
            toast.error("Failed to load weapon types");
        } finally {
            setLoadingWeaponTypes(false);
        }
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            toast.error("Invalid file type. Only JPEG, PNG, and WebP are allowed");
            return;
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            toast.error("File size exceeds 5MB limit");
            return;
        }

        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        onChange("imageFile", file);
        onChange("imagePreview", previewUrl);
    };

    const handleRemoveImage = () => {
        // Revoke the object URL to free memory
        if (formData.imagePreview) {
            URL.revokeObjectURL(formData.imagePreview);
        }
        onChange("imageFile", null);
        onChange("imagePreview", null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="space-y-6">
            {/* Category - Read-only display */}
            <div className="space-y-2">
                <Label>Category</Label>
                <div className="px-3 py-2 bg-muted rounded-md border border-border text-sm">
                    CS2 Skins
                </div>
            </div>

            {/* Subcategory Selection */}
            {formData.categoryId && (
                <div className="space-y-2">
                    <Label htmlFor="subcategory">
                        Weapon Type <span className="text-destructive">*</span>
                    </Label>
                    <Select
                        value={formData.subcategoryId}
                        onValueChange={(value) => {
                            onChange("subcategoryId", value);
                            onChange("weaponTypeId", "");
                        }}
                        disabled={loadingSubcategories || subcategories.length === 0}
                        required
                    >
                        <SelectTrigger id="subcategory">
                            <SelectValue placeholder={loadingSubcategories ? "Loading..." : "Select weapon type"} />
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

            {/* Weapon Type Selection */}
            {formData.subcategoryId && (
                <div className="space-y-2">
                    <Label htmlFor="weaponType">
                        Specific Weapon
                        <span className="text-xs text-muted-foreground ml-1">(optional)</span>
                    </Label>
                    <Select
                        value={formData.weaponTypeId}
                        onValueChange={(value) => onChange("weaponTypeId", value)}
                        disabled={loadingWeaponTypes || weaponTypes.length === 0}
                    >
                        <SelectTrigger id="weaponType">
                            <SelectValue placeholder={loadingWeaponTypes ? "Loading..." : "Select specific weapon"} />
                        </SelectTrigger>
                        <SelectContent>
                            {weaponTypes.map((weapon) => (
                                <SelectItem key={weapon.id} value={weapon.id}>
                                    {weapon.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            {/* Item Name */}
            <div className="space-y-2">
                <Label htmlFor="itemName">
                    Item Name <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                        id="itemName"
                        placeholder="Search for item (e.g., AK-47 | Redline)"
                        value={formData.itemName}
                        onChange={(e) => onChange("itemName", e.target.value)}
                        className="pl-10"
                        required
                    />
                </div>
                <p className="text-xs text-muted-foreground">
                    Start typing to search for items from our database
                </p>
            </div>

            {/* Condition and Special Variants */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="condition">
                        Condition
                        <span className="text-xs text-muted-foreground ml-1">(optional)</span>
                    </Label>
                    <Select
                        value={formData.condition}
                        onValueChange={(value) => onChange("condition", value)}
                    >
                        <SelectTrigger id="condition">
                            <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                            {conditions.map((cond) => (
                                <SelectItem key={cond.value} value={cond.value}>
                                    {cond.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Special Variants</Label>
                    <div className="flex gap-4 pt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isStatTrak}
                                onChange={(e) => onChange("isStatTrak", e.target.checked)}
                                className="w-4 h-4 rounded border-border"
                            />
                            <span className="text-sm">StatTrak™</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isSouvenir}
                                onChange={(e) => onChange("isSouvenir", e.target.checked)}
                                className="w-4 h-4 rounded border-border"
                            />
                            <span className="text-sm">Souvenir</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Float Value and Pattern Index */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="floatValue">
                        Float Value
                        <span className="text-xs text-muted-foreground ml-1">(optional)</span>
                    </Label>
                    <Input
                        id="floatValue"
                        type="number"
                        step="0.0000000001"
                        min="0"
                        max="1"
                        placeholder="0.0000000000"
                        value={formData.floatValue}
                        onChange={(e) => onChange("floatValue", e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="patternIndex">
                        Pattern Index
                        <span className="text-xs text-muted-foreground ml-1">(optional)</span>
                    </Label>
                    <Input
                        id="patternIndex"
                        placeholder="#123"
                        value={formData.patternIndex}
                        onChange={(e) => onChange("patternIndex", e.target.value)}
                    />
                </div>
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

            {/* Steam Trade Link */}
            <div className="space-y-2">
                <Label htmlFor="steamTradeLink">
                    Steam Trade Offer Link <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="steamTradeLink"
                    type="url"
                    placeholder="https://steamcommunity.com/tradeoffer/..."
                    value={formData.steamTradeLink}
                    onChange={(e) => onChange("steamTradeLink", e.target.value)}
                    required
                />
            </div>

            {/* Image Selection */}
            <div className="space-y-2">
                <Label htmlFor="image">
                    Item Image <span className="text-destructive">*</span>
                </Label>
                {formData.imagePreview ? (
                    <div className="relative">
                        <div className="relative w-full h-64 rounded-lg border-2 border-border overflow-hidden bg-muted flex items-center justify-center">
                            <img
                                src={formData.imagePreview}
                                alt="Listing image preview"
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={handleRemoveImage}
                            className="mt-2"
                        >
                            <X className="w-4 h-4 mr-2" />
                            Remove Image
                        </Button>
                    </div>
                ) : (
                    <div className="border-2 border-dashed border-border rounded-lg p-8">
                        <input
                            ref={fileInputRef}
                            type="file"
                            id="image"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={handleImageSelect}
                            className="hidden"
                        />
                        <div className="flex flex-col items-center justify-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                <Upload className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <div className="text-center">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    Select Image
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground text-center">
                                JPEG, PNG, or WebP (max 5MB)
                            </p>
                        </div>
                    </div>
                )}
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
                        placeholder="Add any additional details about your item"
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

