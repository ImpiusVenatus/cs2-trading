"use client";

import { FileText, Gift } from "lucide-react";
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

interface ReferralCodeFormData {
    serviceName: string;
    code: string;
    discount: string;
    price: string;
    currency: "BDT" | "USD";
    description: string;
    terms: string;
}

interface ReferralCodeFormProps {
    formData: ReferralCodeFormData;
    onChange: (field: keyof ReferralCodeFormData, value: string) => void;
}

export function ReferralCodeForm({ formData, onChange }: ReferralCodeFormProps) {
    return (
        <div className="space-y-6">
            {/* Service Name */}
            <div className="space-y-2">
                <Label htmlFor="serviceName">
                    Service Name <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="serviceName"
                    placeholder="e.g., Uber, DoorDash, Airbnb"
                    value={formData.serviceName}
                    onChange={(e) => onChange("serviceName", e.target.value)}
                    required
                />
            </div>

            {/* Referral Code */}
            <div className="space-y-2">
                <Label htmlFor="code">
                    Referral Code
                    <span className="text-xs text-muted-foreground ml-1">(optional)</span>
                </Label>
                <div className="relative">
                    <Gift className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                        id="code"
                        placeholder="Enter referral code"
                        value={formData.code}
                        onChange={(e) => onChange("code", e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Discount */}
            <div className="space-y-2">
                <Label htmlFor="discount">
                    Discount / Benefit
                    <span className="text-xs text-muted-foreground ml-1">(optional)</span>
                </Label>
                <Input
                    id="discount"
                    placeholder="e.g., $10 off, 20% discount, Free trial"
                    value={formData.discount}
                    onChange={(e) => onChange("discount", e.target.value)}
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

            {/* Terms */}
            <div className="space-y-2">
                <Label htmlFor="terms">
                    Terms & Conditions
                    <span className="text-xs text-muted-foreground ml-1">(optional)</span>
                </Label>
                <Textarea
                    id="terms"
                    placeholder="Any terms, conditions, or restrictions for using this code"
                    value={formData.terms}
                    onChange={(e) => onChange("terms", e.target.value)}
                    className="min-h-20"
                    rows={3}
                />
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
                        placeholder="Additional details about the referral code"
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

