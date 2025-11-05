"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Camera, BadgeCheck, AlertCircle, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fadeInUp } from "@/lib/animations";
import { useProfile } from "@/lib/supabase/hooks";
import { toast } from "sonner";

export function ProfilePictureSection() {
    const { profile, loading } = useProfile();
    const [isUploading, setIsUploading] = useState(false);
    const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
    const [imageLoading, setImageLoading] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (profile?.profile_picture_url) {
            setProfilePictureUrl(profile.profile_picture_url);
            setImageLoading(true); // Reset loading state when URL changes
        }
    }, [profile?.profile_picture_url]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
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
            formData.append("fileType", "profile_picture");

            const response = await fetch("/api/files/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to upload profile picture");
            }

            const data = await response.json();
            setProfilePictureUrl(data.file.url);
            toast.success("Profile picture uploaded successfully");
            
            // Refresh profile to get updated data
            window.location.reload();
        } catch (error) {
            console.error("Error uploading profile picture:", error);
            toast.error(error instanceof Error ? error.message : "Failed to upload profile picture");
        } finally {
            setIsUploading(false);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleRemove = async () => {
        if (!profile?.profile_picture_url) return;

        try {
            setIsUploading(true);
            const response = await fetch("/api/files/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fileType: "profile_picture" }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to remove profile picture");
            }

            setProfilePictureUrl(null);
            toast.success("Profile picture removed");
            
            // Refresh profile to get updated data
            window.location.reload();
        } catch (error) {
            console.error("Error removing profile picture:", error);
            toast.error(error instanceof Error ? error.message : "Failed to remove profile picture");
        } finally {
            setIsUploading(false);
        }
    };

    const isVerified = profile?.verification_status === "verified";
    const displayName = profile?.full_name || "?";
    const initial = displayName.charAt(0).toUpperCase();

    return (
        <motion.div variants={fadeInUp}>
            <Card className="border-border/50">
                <CardHeader>
                    <CardTitle>Profile Picture</CardTitle>
                    <CardDescription>
                        Upload a profile picture to help others recognize you
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            {profilePictureUrl ? (
                                <div className="relative w-24 h-24">
                                    {imageLoading && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-full border-2 border-border">
                                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                        </div>
                                    )}
                                    <Image
                                        src={profilePictureUrl}
                                        alt="Profile"
                                        width={96}
                                        height={96}
                                        className="w-24 h-24 rounded-full object-cover border-2 border-border"
                                        onLoad={() => setImageLoading(false)}
                                        onError={() => setImageLoading(false)}
                                    />
                                </div>
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                                    {initial}
                                </div>
                            )}
                            <button
                                type="button"
                                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors shadow-md"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading || loading}
                            >
                                <Camera className="w-4 h-4" />
                            </button>
                            {isVerified ? (
                                <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg border-2 border-background">
                                    <BadgeCheck className="w-4 h-4 text-white" />
                                </div>
                            ) : (
                                profile && (
                                    <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-yellow-500 flex items-center justify-center shadow-lg border-2 border-background">
                                        <AlertCircle className="w-4 h-4 text-white" />
                                    </div>
                                )
                            )}
                        </div>
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploading || loading}
                                >
                                    {isUploading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4 mr-2" />
                                            {profilePictureUrl ? "Change Picture" : "Upload Picture"}
                                        </>
                                    )}
                                </Button>
                                {profilePictureUrl && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        type="button"
                                        onClick={handleRemove}
                                        disabled={isUploading || loading}
                                        className="text-destructive hover:text-destructive"
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Remove
                                    </Button>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                JPG, PNG or WebP. Max size 5MB
                            </p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={handleFileSelect}
                                className="hidden"
                                disabled={isUploading || loading}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

