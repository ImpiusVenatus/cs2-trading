"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Bell, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
    const [searchQuery, setSearchQuery] = useState("");

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
                            <Link
                                href="/app"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                App
                            </Link>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors">
                                    <span>Tools</span>
                                    <ChevronDown className="w-4 h-4" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem>Trade Up Calculator</DropdownMenuItem>
                                    <DropdownMenuItem>Float Checker</DropdownMenuItem>
                                    <DropdownMenuItem>Browser Extension</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </nav>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-md mx-4 hidden sm:block">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                                placeholder="Search for items..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-muted/50 border-border focus:bg-background"
                            />
                        </div>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Currency Selector */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="hidden sm:flex">
                                    USD
                                    <ChevronDown className="w-4 h-4 ml-1" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>USD</DropdownMenuItem>
                                <DropdownMenuItem>EUR</DropdownMenuItem>
                                <DropdownMenuItem>BDT</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Language Selector */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="hidden sm:flex">
                                    EN
                                    <ChevronDown className="w-4 h-4 ml-1" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>English</DropdownMenuItem>
                                <DropdownMenuItem>বাংলা</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Notifications */}
                        <Button variant="ghost" size="sm" className="hidden sm:flex">
                            <Bell className="w-4 h-4" />
                        </Button>

                        {/* Theme Toggle */}
                        <ThemeToggle />

                        {/* Sign In Button */}
                        <Button className="hidden sm:flex">
                            <User className="w-4 h-4 mr-2" />
                            Sign In
                        </Button>

                        {/* Mobile Menu Button */}
                        <Button variant="ghost" size="sm" className="md:hidden">
                            <User className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}

