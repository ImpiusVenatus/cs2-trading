"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Save, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { fadeInUp } from "@/lib/animations";
import { useProfile, useUser } from "@/lib/supabase/hooks";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

type Division = { id: number; name: string };
type District = { id: number; name: string; division_id: number };

export function PersonalInformationForm() {
    const { profile, loading } = useProfile();
    const { user } = useUser();
    const [isSaving, setIsSaving] = useState(false);
    const [divisions, setDivisions] = useState<Division[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [selectedDivisionId, setSelectedDivisionId] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        division: "",
        district: "",
        postalCode: "",
        bio: "",
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                fullName: profile.full_name || "",
                email: user?.email || profile.email || "", // Get email from auth user first
                phone: profile.phone || "",
                address: profile.address || "",
                division: profile.division || "",
                district: profile.district || "",
                postalCode: profile.postal_code || "",
                bio: profile.bio || "",
            });
        } else if (user) {
            // If no profile yet, at least show email from auth
            setFormData((prev) => ({
                ...prev,
                email: user.email || "",
            }));
        }
    }, [profile, user]);

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // Load divisions on mount
    useEffect(() => {
        const loadDivisions = async () => {
            const supabase = createClient();
            const { data } = await supabase.from("divisions").select("id, name").order("name", { ascending: true });
            setDivisions(data || []);
        };
        loadDivisions();
    }, []);

    // Load districts when division changes
    useEffect(() => {
        const loadDistricts = async () => {
            if (!selectedDivisionId) {
                setDistricts([]);
                return;
            }
            const supabase = createClient();
            const { data } = await supabase
                .from("districts")
                .select("id, name, division_id")
                .eq("division_id", selectedDivisionId)
                .order("name", { ascending: true });
            setDistricts(data || []);
        };
        loadDistricts();
    }, [selectedDivisionId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setIsSaving(true);
            const response = await fetch("/api/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    full_name: formData.fullName || null,
                    phone: formData.phone || null,
                    address: formData.address || null,
                    division: formData.division || null,
                    district: formData.district || null,
                    postal_code: formData.postalCode || null,
                    bio: formData.bio || null,
                    // Don't send email, account_type, or current_mode - they're managed separately
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to save profile");
            }

            toast.success("Profile updated successfully");
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error(error instanceof Error ? error.message : "Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <motion.div variants={fadeInUp}>
            <Card className="border-border/50">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>
                                Update your profile details. All fields are optional, but completing them is required for account verification.
                            </CardDescription>
                        </div>
                        {profile && profile.verification_status !== "verified" && (
                            <div className="flex items-center gap-1.5 text-sm text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1.5 rounded-lg">
                                <AlertCircle className="w-4 h-4" />
                                <span>Unverified</span>
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    id="fullName"
                                    placeholder="Enter your full name"
                                    value={formData.fullName}
                                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                                    className="pl-10"
                                    disabled={loading}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Required for verification
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="your.email@example.com"
                                    value={formData.email}
                                    className="pl-10 bg-muted cursor-not-allowed"
                                    disabled={true}
                                    readOnly
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Email cannot be changed (linked to your Google account)
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="+880 1XXX-XXXXXX"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange("phone", e.target.value)}
                                    className="pl-10"
                                    disabled={loading}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Required for verification
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Street Address</Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 text-muted-foreground w-4 h-4" />
                                <Textarea
                                    id="address"
                                    placeholder="Enter your street address"
                                    value={formData.address}
                                    onChange={(e) => handleInputChange("address", e.target.value)}
                                    className="pl-10 min-h-20"
                                    rows={3}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="division">Division</Label>
                                <Select
                                    value={formData.division}
                                    onValueChange={(value) => {
                                        handleInputChange("division", value);
                                        const div = divisions.find(d => d.name === value);
                                        setSelectedDivisionId(div ? div.id : null);
                                        // Reset district when division changes
                                        handleInputChange("district", "");
                                    }}
                                    disabled={loading}
                                >
                                    <SelectTrigger id="division" className="w-full">
                                        <SelectValue placeholder="Select division" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {divisions.map((d) => (
                                            <SelectItem key={d.id} value={d.name}>
                                                {d.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">Required for verification</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="district">District</Label>
                                <Select
                                    value={formData.district}
                                    onValueChange={(value) => handleInputChange("district", value)}
                                    disabled={loading || !formData.division}
                                >
                                    <SelectTrigger id="district" className="w-full">
                                        <SelectValue placeholder="Select district (optional)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {districts.map((dist) => (
                                            <SelectItem key={dist.id} value={dist.name}>
                                                {dist.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    Required for verification
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="postalCode">Postal Code</Label>
                            <Input
                                id="postalCode"
                                placeholder="Enter postal code"
                                value={formData.postalCode}
                                onChange={(e) => handleInputChange("postalCode", e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                                id="bio"
                                placeholder="Tell us about yourself (optional)"
                                value={formData.bio}
                                onChange={(e) => handleInputChange("bio", e.target.value)}
                                className="min-h-24"
                                rows={4}
                                disabled={loading}
                            />
                            <p className="text-xs text-muted-foreground">
                                A brief description about yourself (max 500 characters)
                            </p>
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    if (profile) {
                                        setFormData({
                                            fullName: profile.full_name || "",
                                            email: profile.email || "",
                                            phone: profile.phone || "",
                                            address: profile.address || "",
                                            division: profile.division || "",
                                            district: profile.district || "",
                                            postalCode: profile.postal_code || "",
                                            bio: profile.bio || "",
                                        });
                                    }
                                }}
                                disabled={isSaving || loading}
                            >
                                Reset
                            </Button>
                            <Button type="submit" disabled={isSaving || loading}>
                                {isSaving ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Profile
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    );
}

