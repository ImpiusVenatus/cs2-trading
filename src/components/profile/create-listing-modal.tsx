"use client";

import { useState } from "react";
import { Search, DollarSign, Link2, FileText, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface CreateListingModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const conditions = [
    { value: "Factory New", label: "Factory New (FN)", short: "FN" },
    { value: "Minimal Wear", label: "Minimal Wear (MW)", short: "MW" },
    { value: "Field-Tested", label: "Field-Tested (FT)", short: "FT" },
    { value: "Well-Worn", label: "Well-Worn (WW)", short: "WW" },
    { value: "Battle-Scarred", label: "Battle-Scarred (BS)", short: "BS" },
];

export function CreateListingModal({ open, onOpenChange }: CreateListingModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        itemName: "",
        condition: "",
        floatValue: "",
        patternIndex: "",
        isStatTrak: false,
        isSouvenir: false,
        price: "",
        currency: "BDT",
        description: "",
        tradeLink: "",
        steamTradeLink: "",
    });

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // TODO: Submit to backend
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        setIsSubmitting(false);
        onOpenChange(false);
        // Reset form
        setFormData({
            itemName: "",
            condition: "",
            floatValue: "",
            patternIndex: "",
            isStatTrak: false,
            isSouvenir: false,
            price: "",
            currency: "BDT",
            description: "",
            tradeLink: "",
            steamTradeLink: "",
        });
    };

    const handleClose = () => {
        if (!isSubmitting) {
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Listing</DialogTitle>
                    <DialogDescription>
                        List your CS2 item for sale. Fill in all required details to help buyers find your item.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Item Name / Search */}
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
                                onChange={(e) => handleInputChange("itemName", e.target.value)}
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
                                Condition <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={formData.condition}
                                onValueChange={(value) => handleInputChange("condition", value)}
                                required
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
                                        onChange={(e) =>
                                            handleInputChange("isStatTrak", e.target.checked)
                                        }
                                        className="w-4 h-4 rounded border-border"
                                    />
                                    <span className="text-sm">StatTrak™</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isSouvenir}
                                        onChange={(e) =>
                                            handleInputChange("isSouvenir", e.target.checked)
                                        }
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
                                onChange={(e) => handleInputChange("floatValue", e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                                Enter the exact float value from CS2
                            </p>
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
                                onChange={(e) => handleInputChange("patternIndex", e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                                Pattern index for special skins (e.g., Case Hardened)
                            </p>
                        </div>
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                        <Label htmlFor="price">
                            Price <span className="text-destructive">*</span>
                        </Label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    value={formData.price}
                                    onChange={(e) => handleInputChange("price", e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                            <Select
                                value={formData.currency}
                                onValueChange={(value) => handleInputChange("currency", value)}
                            >
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="BDT">BDT</SelectItem>
                                    <SelectItem value="USD">USD</SelectItem>
                                    <SelectItem value="EUR">EUR</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Set your asking price for this item
                        </p>
                    </div>

                    {/* Trade Links */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="steamTradeLink">
                                Steam Trade Offer Link <span className="text-destructive">*</span>
                            </Label>
                            <div className="relative">
                                <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    id="steamTradeLink"
                                    type="url"
                                    placeholder="https://steamcommunity.com/tradeoffer/..."
                                    value={formData.steamTradeLink}
                                    onChange={(e) => handleInputChange("steamTradeLink", e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                            <div className="flex items-start gap-2 mt-2 p-3 bg-muted/50 rounded-lg">
                                <Info className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                                <p className="text-xs text-muted-foreground">
                                    Create a trade offer in Steam with your item and copy the trade offer URL.
                                    Buyers will use this link to send you the trade offer.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tradeLink">
                                CS2Trade BD Profile Link
                                <span className="text-xs text-muted-foreground ml-1">(optional)</span>
                            </Label>
                            <div className="relative">
                                <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    id="tradeLink"
                                    type="url"
                                    placeholder="https://cs2tradebd.com/profile/..."
                                    value={formData.tradeLink}
                                    onChange={(e) => handleInputChange("tradeLink", e.target.value)}
                                    className="pl-10"
                                />
                            </div>
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
                                placeholder="Add any additional details about your item (e.g., special pattern, stickers, etc.)"
                                value={formData.description}
                                onChange={(e) => handleInputChange("description", e.target.value)}
                                className="pl-10 min-h-24"
                                rows={4}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Help buyers understand what makes your item special
                        </p>
                    </div>

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
            </DialogContent>
        </Dialog>
    );
}

