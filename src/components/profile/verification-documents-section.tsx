"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Upload, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fadeInUp } from "@/lib/animations";
import { useProfile } from "@/lib/supabase/hooks";
import { toast } from "sonner";

export function VerificationDocumentsSection() {
    const { profile, loading } = useProfile();
    const [isSaving, setIsSaving] = useState(false);
    const [nidUrl, setNidUrl] = useState<string | null>(null);

    useEffect(() => {
        if (profile?.nid_document_url) {
            setNidUrl(profile.nid_document_url);
        }
    }, [profile]);

    const handleNidUrlChange = async (url: string) => {
        if (!url.trim()) return;

        try {
            setIsSaving(true);
            const response = await fetch("/api/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nid_document_url: url,
                    verification_status: "pending", // Set to pending when NID is uploaded
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to save NID document");
            }

            setNidUrl(url);
            toast.success("NID document URL saved. Your verification will be reviewed.");
        } catch (error) {
            console.error("Error updating NID document:", error);
            toast.error(error instanceof Error ? error.message : "Failed to update NID document");
        } finally {
            setIsSaving(false);
        }
    };

    const handleRemoveNid = async () => {
        try {
            setIsSaving(true);
            const response = await fetch("/api/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nid_document_url: null,
                    verification_status: null,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to remove NID document");
            }

            setNidUrl(null);
            toast.success("NID document removed");
        } catch (error) {
            console.error("Error removing NID document:", error);
            toast.error(error instanceof Error ? error.message : "Failed to remove NID document");
        } finally {
            setIsSaving(false);
        }
    };

    const isVerified = profile?.verification_status === "verified";
    const verificationStatus = profile?.verification_status;

    return (
        <motion.div variants={fadeInUp}>
            <Card className="border-border/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Verification Documents
                    </CardTitle>
                    <CardDescription>
                        Upload your verification documents to get verified and build trust with other traders
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="nid" className="text-base font-medium">
                                National ID Card (NID)
                            </Label>
                            {isVerified && (
                                <div className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>Verified</span>
                                </div>
                            )}
                            {verificationStatus === "pending" && (
                                <div className="flex items-center gap-1.5 text-sm text-yellow-600 dark:text-yellow-400">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>Pending Review</span>
                                </div>
                            )}
                            {verificationStatus === "rejected" && (
                                <div className="flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>Rejected</span>
                                </div>
                            )}
                        </div>
                        {!nidUrl ? (
                            <div className="border-2 border-dashed border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
                                <div className="flex flex-col items-center justify-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                        <Upload className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-medium mb-1">Upload NID Document</p>
                                        <p className="text-xs text-muted-foreground">
                                            Paste your Backblaze URL here (we'll set up upload later)
                                        </p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const url = prompt("Enter Backblaze URL for NID document:");
                                            if (url) handleNidUrlChange(url);
                                        }}
                                        disabled={isSaving || loading}
                                    >
                                        {isSaving ? "Saving..." : "Add URL"}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="border border-border rounded-lg p-4 bg-muted/30">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <FileText className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">NID Document</p>
                                            <p className="text-xs text-muted-foreground truncate max-w-xs">
                                                {nidUrl}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleRemoveNid}
                                        className="text-destructive hover:text-destructive"
                                        disabled={isSaving}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Upload a clear image or scan of your National ID Card. This will be reviewed by our team for verification.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

