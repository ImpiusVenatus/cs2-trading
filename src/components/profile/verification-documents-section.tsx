"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FileText, Upload, CheckCircle2, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fadeInUp } from "@/lib/animations";
import { useProfile } from "@/lib/supabase/hooks";
import { toast } from "sonner";

export function VerificationDocumentsSection() {
    const { profile, loading } = useProfile();
    const [isUploading, setIsUploading] = useState(false);
    const [nidUrl, setNidUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (profile?.nid_document_url) {
            setNidUrl(profile.nid_document_url);
        }
    }, [profile]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type (images or PDF)
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];
        if (!allowedTypes.includes(file.type)) {
            toast.error("Please select an image file (JPG, PNG, WebP) or PDF");
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size must be less than 5MB");
            return;
        }

        handleFileUpload(file);
    };

    const handleFileUpload = async (file: File) => {
        try {
            setIsUploading(true);

            const formData = new FormData();
            formData.append("file", file);
            formData.append("fileType", "nid_document");

            const response = await fetch("/api/files/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to upload NID document");
            }

            const data = await response.json();
            setNidUrl(data.file.url);
            toast.success("NID document uploaded. Your verification will be reviewed.");
            
            // Refresh profile to get updated data
            window.location.reload();
        } catch (error) {
            console.error("Error uploading NID document:", error);
            toast.error(error instanceof Error ? error.message : "Failed to upload NID document");
        } finally {
            setIsUploading(false);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleRemoveNid = async () => {
        if (!profile?.nid_document_url) return;

        try {
            setIsUploading(true);
            const response = await fetch("/api/files/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fileType: "nid_document" }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to remove NID document");
            }

            setNidUrl(null);
            toast.success("NID document removed");
            
            // Refresh profile to get updated data
            window.location.reload();
        } catch (error) {
            console.error("Error removing NID document:", error);
            toast.error(error instanceof Error ? error.message : "Failed to remove NID document");
        } finally {
            setIsUploading(false);
        }
    };

    const isVerified = profile?.verification_status === "verified";
    const verificationStatus = profile?.verification_status;
    const isPending = verificationStatus === "pending";

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
                            {isVerified ? (
                                <div className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>Verified</span>
                                </div>
                            ) : isPending ? (
                                <div className="flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>Pending Review</span>
                                </div>
                            ) : (
                                profile && (
                                    <div className="flex items-center gap-1.5 text-sm text-yellow-600 dark:text-yellow-400">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>Unverified</span>
                                    </div>
                                )
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
                                            JPG, PNG, WebP or PDF. Max size 5MB
                                        </p>
                                    </div>
                                    <label htmlFor="nid" className="cursor-pointer">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            disabled={isUploading || loading}
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            {isUploading ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
                                                    Uploading...
                                                </>
                                            ) : (
                                                <>
                                                    <Upload className="w-4 h-4 mr-2" />
                                                    Choose File
                                                </>
                                            )}
                                        </Button>
                                        <input
                                            id="nid"
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                                            onChange={handleFileSelect}
                                            className="hidden"
                                            disabled={isUploading || loading}
                                        />
                                    </label>
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
                                            <p className="text-xs text-muted-foreground">
                                                Uploaded
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleRemoveNid}
                                        className="text-destructive hover:text-destructive"
                                        disabled={isUploading || loading}
                                    >
                                        <X className="w-4 h-4 mr-2" />
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

