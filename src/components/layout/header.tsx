"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Bell, User, LogOut, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser, useProfile } from "@/lib/supabase/hooks";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function Header() {
    const router = useRouter();
    const { user, loading } = useUser();
    const { profile } = useProfile();
    const [desktopImageLoading, setDesktopImageLoading] = useState(true);
    const [mobileImageLoading, setMobileImageLoading] = useState(true);

    // Reset loading state when profile picture URL changes
    useEffect(() => {
        setDesktopImageLoading(true);
        setMobileImageLoading(true);
    }, [profile?.profile_picture_url]);

    const handleSignOut = async () => {
        const supabase = createClient();
        const { error } = await supabase.auth.signOut();
        if (error) {
            toast.error("Failed to sign out");
        } else {
            router.push("/");
            router.refresh();
        }
    };

    const getAvatarInitial = () => {
        if (profile?.full_name) {
            return profile.full_name.charAt(0).toUpperCase();
        }
        if (user?.email) {
            return user.email.charAt(0).toUpperCase();
        }
        return "?";
    };

    return (
        <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and Navigation */}
                    <div className="flex items-center space-x-8">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-2">
                            <Image
                                src="/logo.svg"
                                alt="CS2Trade BD"
                                width={32}
                                height={32}
                                className="w-8 h-8"
                                priority
                            />
                            <span className="font-bold text-xl hidden sm:block">CS2Trade BD</span>
                        </Link>

                        {/* Main Navigation */}
                        <nav className="hidden md:flex items-center space-x-6">
                            <Link
                                href="/market"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Market
                            </Link>
                            <Link
                                href="/database"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Database
                            </Link>
                            {user && (
                                <Link
                                    href="/chat"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Messages
                                </Link>
                            )}
                        </nav>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Notifications */}
                        {user && (
                            <Button variant="ghost" size="sm" className="hidden sm:flex hover:text-white">
                                <Bell className="w-4 h-4" />
                            </Button>
                        )}


                        {/* Theme Toggle */}
                        <ThemeToggle />

                        {/* User Menu or Sign In */}
                        {loading ? (
                            <div className="w-9 h-9" />
                        ) : user ? (
                            <>
                                {/* Desktop Avatar */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-2 hover:text-white">
                                            {profile?.profile_picture_url ? (
                                                <div className="relative w-6 h-6">
                                                    {desktopImageLoading && (
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                                        </div>
                                                    )}
                                                    <Image
                                                        src={profile.profile_picture_url}
                                                        alt="Profile"
                                                        width={24}
                                                        height={24}
                                                        className="rounded-full object-cover"
                                                        onLoad={() => setDesktopImageLoading(false)}
                                                        onError={() => setDesktopImageLoading(false)}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                                    {getAvatarInitial()}
                                                </div>
                                            )}
                                            <span className="max-w-[100px] truncate">
                                                {profile?.full_name || user.email?.split("@")[0] || "Profile"}
                                            </span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                            <Link href="/profile">
                                                <User className="w-4 h-4 mr-2" />
                                                Profile
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/chat">
                                                <MessageSquare className="w-4 h-4 mr-2" />
                                                Messages
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={handleSignOut}>
                                            <LogOut className="w-4 h-4 mr-2" />
                                            Sign Out
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                {/* Mobile Avatar */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="md:hidden hover:text-white">
                                            {profile?.profile_picture_url ? (
                                                <div className="relative w-6 h-6">
                                                    {mobileImageLoading && (
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                                        </div>
                                                    )}
                                                    <Image
                                                        src={profile.profile_picture_url}
                                                        alt="Profile"
                                                        width={24}
                                                        height={24}
                                                        className="rounded-full object-cover"
                                                        onLoad={() => setMobileImageLoading(false)}
                                                        onError={() => setMobileImageLoading(false)}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                                    {getAvatarInitial()}
                                                </div>
                                            )}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                            <Link href="/profile">
                                                <User className="w-4 h-4 mr-2" />
                                                Profile
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/chat">
                                                <MessageSquare className="w-4 h-4 mr-2" />
                                                Messages
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={handleSignOut}>
                                            <LogOut className="w-4 h-4 mr-2" />
                                            Sign Out
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            <>
                                <Button asChild className="hidden sm:flex">
                                    <Link href="/auth/signin">
                                        <User className="w-4 h-4 mr-2" />
                                        Sign In
                                    </Link>
                                </Button>
                                <Button variant="ghost" size="sm" className="md:hidden hover:text-white" asChild>
                                    <Link href="/auth/signin">
                                        <User className="w-4 h-4" />
                                    </Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
