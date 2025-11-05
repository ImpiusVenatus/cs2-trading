"use client";

import { useState, useEffect } from "react";
import { AlertCircle, ShoppingCart, User } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/lib/supabase/hooks";
import { hasMinimumInfo, getMissingFields } from "@/lib/supabase/profile-utils";
import { useRouter } from "next/navigation";

interface BuyItemModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    itemName: string;
    itemPrice: number;
}

export function BuyItemModal({
    open,
    onOpenChange,
    itemName,
    itemPrice,
}: BuyItemModalProps) {
    const router = useRouter();
    const { profile } = useProfile();
    const hasMinInfo = hasMinimumInfo(profile);
    const missingFields = getMissingFields(profile);

    const handleCompleteProfile = () => {
        onOpenChange(false);
        router.push("/profile");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <ShoppingCart className="w-6 h-6 text-primary" />
                        </div>
                        <DialogTitle className="text-2xl">Purchase Item</DialogTitle>
                    </div>
                    <DialogDescription className="text-base">
                        {itemName}
                    </DialogDescription>
                </DialogHeader>

                {!hasMinInfo ? (
                    <div className="space-y-4 py-4">
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                                        Complete Your Profile
                                    </h4>
                                    <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3">
                                        To purchase items, you need to provide your basic information:
                                    </p>
                                    <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
                                        {missingFields.map((field) => (
                                            <li key={field} className="flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-yellow-600 dark:bg-yellow-400" />
                                                {field}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <p className="text-sm text-muted-foreground">
                            This information is required to process your purchase and ensure secure transactions.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4 py-4">
                        <div className="bg-card border rounded-lg p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Item:</span>
                                <span className="font-medium">{itemName}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Price:</span>
                                <span className="font-bold text-green-500 text-lg">
                                    ${itemPrice.toFixed(2)}
                                </span>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Click &quot;Confirm Purchase&quot; to proceed with the transaction.
                        </p>
                    </div>
                )}

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    {hasMinInfo ? (
                        <Button>
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Confirm Purchase
                        </Button>
                    ) : (
                        <Button onClick={handleCompleteProfile}>
                            <User className="w-4 h-4 mr-2" />
                            Complete Profile
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

