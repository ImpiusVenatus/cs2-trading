"use client";

import { AlertCircle, Store, CheckCircle2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface BecomeSellerModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    isUpgrading: boolean;
}

export function BecomeSellerModal({
    open,
    onOpenChange,
    onConfirm,
    isUpgrading,
}: BecomeSellerModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Store className="w-6 h-6 text-primary" />
                        </div>
                        <DialogTitle className="text-2xl">Become a Seller</DialogTitle>
                    </div>
                    <DialogDescription className="text-base">
                        Upgrade your account to start selling CS2 items
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 shrink-0" />
                            <div>
                                <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                                    Verification Required
                                </h4>
                                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                    To create and manage listings, you need to be verified. Please complete the following in your profile:
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="font-medium">Required for Verification:</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                                <span>Complete all profile information</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                                <span>Upload NID document</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                                <span>Wait for admin verification</span>
                            </li>
                        </ul>
                    </div>

                    <p className="text-sm text-muted-foreground pt-2">
                        Once verified, you&apos;ll be able to create listings and start selling your CS2 items.
                    </p>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isUpgrading}
                    >
                        Cancel
                    </Button>
                    <Button onClick={onConfirm} disabled={isUpgrading}>
                        {isUpgrading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                Upgrading...
                            </>
                        ) : (
                            <>
                                <Store className="w-4 h-4 mr-2" />
                                Become a Seller
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

