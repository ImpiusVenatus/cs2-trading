"use client";

import Link from "next/link";
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {

    return (
        <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and Navigation */}
                    <div className="flex items-center space-x-8">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">f</span>
                            </div>
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
                        </nav>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Notifications */}
                        <Button variant="ghost" size="sm" className="hidden sm:flex">
                            <Bell className="w-4 h-4" />
                        </Button>

                        {/* Theme Toggle */}
                        <ThemeToggle />

                        {/* Sign In Button */}
                        <Button asChild className="hidden sm:flex">
                            <Link href="/auth/signin">
                                <User className="w-4 h-4 mr-2" />
                                Sign In
                            </Link>
                        </Button>

                        {/* Mobile Menu Button */}
                        <Button variant="ghost" size="sm" className="md:hidden" asChild>
                            <Link href="/auth/signin">
                                <User className="w-4 h-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}

