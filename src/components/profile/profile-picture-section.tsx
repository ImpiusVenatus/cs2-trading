"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera, BadgeCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fadeInUp } from "@/lib/animations";
import { useProfile } from "@/lib/supabase/hooks";
import { toast } from "sonner";

export function ProfilePictureSection() {
    const { profile, loading } = useProfile();
    const [isSaving, setIsSaving] = useState(false);
    const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);

    useEffect(() => {
        if (profile?.profile_picture_url) {
            setProfilePictureUrl(profile.profile_picture_url);
        }
    }, [profile]);

    const handleUrlChange = async (url: string) => {
        if (!url.trim()) return;

        try {
            setIsSaving(true);
            const response = await fetch("/api/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ profile_picture_url: url }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to save profile picture");
            }

            setProfilePictureUrl(url);
            toast.success("Profile picture updated");
        } catch (error) {
            console.error("Error updating profile picture:", error);
            toast.error(error instanceof Error ? error.message : "Failed to update profile picture");
        } finally {
            setIsSaving(false);
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
                                <img
                                    src={profilePictureUrl}
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full object-cover border-2 border-border"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                                    {initial}
                                </div>
                            )}
                            <button
                                type="button"
                                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors shadow-md"
                                onClick={() => {
                                    const url = prompt("Enter Backblaze URL for profile picture:");
                                    if (url) handleUrlChange(url);
                                }}
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
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground mb-2">
                                Paste your Backblaze URL here (we'll set up upload later)
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                type="button"
                                onClick={() => {
                                    const url = prompt("Enter Backblaze URL for profile picture:");
                                    if (url) handleUrlChange(url);
                                }}
                                disabled={isSaving || loading}
                            >
                                {isSaving ? "Saving..." : "Update URL"}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

