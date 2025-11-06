"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-muted/30 border-t border-border">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 gap-8">
                    {/* Logo and Description */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Image
                                src="/logo.svg"
                                alt="CS2BD"
                                width={32}
                                height={32}
                                className="w-8 h-8"
                            />
                            <span className="font-bold text-xl">CS2BD</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Bangladesh&apos;s premier CS2 trading platform. Trade with confidence, trade with us.
                        </p>
                        <div className="flex space-x-4">
                            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                <Facebook className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                <Instagram className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                <Twitter className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    
                </div>

                {/* Bottom Section */}
                <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                        © CS2BD 2025. Not affiliated with Valve Corp.
                    </div>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Terms of Service
                        </Link>
                        <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Privacy Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
