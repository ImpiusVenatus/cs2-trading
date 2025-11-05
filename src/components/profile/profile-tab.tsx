"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Save, Camera, BadgeCheck, FileText, Upload, CheckCircle2 } from "lucide-react";
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
import { fadeInUp, staggerContainer } from "@/lib/animations";

export function ProfileTab() {
    const [isSaving, setIsSaving] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [nidFile, setNidFile] = useState<File | null>(null);
    const [nidFileName, setNidFileName] = useState<string>("");
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        district: "",
        postalCode: "",
        bio: "",
        accountType: "",
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleNidUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNidFile(file);
            setNidFileName(file.name);
        }
    };

    const handleRemoveNid = () => {
        setNidFile(null);
        setNidFileName("");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
        }, 1000);
    };

    const districts = [
        "Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna",
        "Barisal", "Rangpur", "Mymensingh", "Comilla", "Narayanganj",
        "Gazipur", "Jessore", "Cox's Bazar", "Bogra", "Kushtia", "Other",
    ];

    return (
        <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-6"
        >
            {/* Profile Picture Section */}
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
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                                    {formData.fullName
                                        ? formData.fullName.charAt(0).toUpperCase()
                                        : "?"}
                                </div>
                                <button
                                    type="button"
                                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors shadow-md"
                                >
                                    <Camera className="w-4 h-4" />
                                </button>
                                {isVerified && (
                                    <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg border-2 border-background">
                                        <BadgeCheck className="w-4 h-4 text-white" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-muted-foreground mb-2">
                                    JPG, PNG or GIF. Max size 2MB
                                </p>
                                <Button variant="outline" size="sm" type="button">
                                    Upload Photo
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Verification Documents Section */}
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
                            </div>
                            {!nidFile ? (
                                <div className="border-2 border-dashed border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                            <Upload className="w-5 h-5 text-muted-foreground" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-medium mb-1">Upload NID Document</p>
                                            <p className="text-xs text-muted-foreground">JPG, PNG or PDF. Max size 5MB</p>
                                        </div>
                                        <label htmlFor="nid" className="cursor-pointer">
                                            <Button type="button" variant="outline" size="sm">
                                                Choose File
                                            </Button>
                                            <input
                                                id="nid"
                                                type="file"
                                                accept="image/*,.pdf"
                                                onChange={handleNidUpload}
                                                className="hidden"
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
                                                <p className="text-sm font-medium">{nidFileName}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {(nidFile.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleRemoveNid}
                                            className="text-destructive hover:text-destructive"
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

            {/* Personal Information Form */}
            <motion.div variants={fadeInUp}>
                <Card className="border-border/50">
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>
                            Fill in your details to complete your profile
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">
                                    Full Name <span className="text-destructive">*</span>
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                    <Input
                                        id="fullName"
                                        placeholder="Enter your full name"
                                        value={formData.fullName}
                                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">
                                    Email Address <span className="text-destructive">*</span>
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="your.email@example.com"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">
                                    Phone Number <span className="text-destructive">*</span>
                                </Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="+880 1XXX-XXXXXX"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange("phone", e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="accountType">
                                    Account Type <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={formData.accountType}
                                    onValueChange={(value) => handleInputChange("accountType", value)}
                                    required
                                >
                                    <SelectTrigger id="accountType" className="w-full">
                                        <SelectValue placeholder="Select account type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="buyer">Buyer</SelectItem>
                                        <SelectItem value="seller">Seller</SelectItem>
                                        <SelectItem value="both">Both (Buyer & Seller)</SelectItem>
                                    </SelectContent>
                                </Select>
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
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        placeholder="Enter your city"
                                        value={formData.city}
                                        onChange={(e) => handleInputChange("city", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="district">
                                        District <span className="text-destructive">*</span>
                                    </Label>
                                    <Select
                                        value={formData.district}
                                        onValueChange={(value) => handleInputChange("district", value)}
                                        required
                                    >
                                        <SelectTrigger id="district" className="w-full">
                                            <SelectValue placeholder="Select district" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {districts.map((district) => (
                                                <SelectItem key={district} value={district}>
                                                    {district}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="postalCode">Postal Code</Label>
                                <Input
                                    id="postalCode"
                                    placeholder="Enter postal code"
                                    value={formData.postalCode}
                                    onChange={(e) => handleInputChange("postalCode", e.target.value)}
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
                                        setFormData({
                                            fullName: "",
                                            email: "",
                                            phone: "",
                                            address: "",
                                            city: "",
                                            district: "",
                                            postalCode: "",
                                            bio: "",
                                            accountType: "",
                                        });
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSaving}>
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
        </motion.div>
    );
}

