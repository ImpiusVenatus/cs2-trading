"use client";

import Link from "next/link";
import { Github, Twitter, Youtube, Instagram } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-muted/30 border-t border-border">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo and Description */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">f</span>
                            </div>
                            <span className="font-bold text-xl">CS2Trade BD</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Bangladesh&apos;s premier CS2 trading platform. Trade with confidence, trade with us.
                        </p>
                        <div className="flex space-x-4">
                            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                <Twitter className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                <Youtube className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                <Instagram className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                <Github className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Products */}
                    <div>
                        <h3 className="font-semibold mb-4">Products</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/market" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Market
                                </Link>
                            </li>
                            <li>
                                <Link href="/database" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Database
                                </Link>
                            </li>
                            <li>
                                <Link href="/app" className="text-muted-foreground hover:text-foreground transition-colors">
                                    App
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Tools */}
                    <div>
                        <h3 className="font-semibold mb-4">Tools</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/tools/calculator" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Trade Up Calculator
                                </Link>
                            </li>
                            <li>
                                <Link href="/tools/float-checker" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Float Checker
                                </Link>
                            </li>
                            <li>
                                <Link href="/tools/extension" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Browser Extension
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="font-semibold mb-4">Resources</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link href="/support" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Support
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="/affiliate" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Affiliate
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                        © CS2Trade BD 2024. Not affiliated with Valve Corp.
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
