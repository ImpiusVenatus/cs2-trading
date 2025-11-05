"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { fadeInUp, staggerContainer, slideInFromLeft, slideInFromRight } from "@/lib/animations";

export function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
            </div>

            <div className="container mx-auto px-4 py-20">
                <motion.div
                    className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                >
                    {/* Left Content */}
                    <motion.div variants={slideInFromLeft} className="space-y-8">
                        <div className="space-y-4">
                            <motion.h1
                                className="text-5xl lg:text-7xl font-bold leading-tight"
                                variants={fadeInUp}
                            >
                                Bangladesh's Premier{" "}
                                <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                                    CS2 Marketplace
                                </span>
                            </motion.h1>
                            <motion.p
                                className="text-xl text-muted-foreground max-w-2xl"
                                variants={fadeInUp}
                            >
                                The trusted platform for buying and selling CS2 skins in Bangladesh. 
                                List your items, connect with local buyers, and trade securely with 
                                the lowest fees in the region. Join thousands of traders building the 
                                CS2 community in Bangladesh.
                            </motion.p>
                        </div>

                        {/* CTA Buttons */}
                        <motion.div
                            className="flex flex-col sm:flex-row gap-4"
                            variants={fadeInUp}
                        >
                            <Button size="lg" className="text-lg px-8 py-6">
                                Start Selling
                            </Button>
                            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                                Explore Marketplace
                            </Button>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            className="grid grid-cols-3 gap-6 pt-8"
                            variants={fadeInUp}
                        >
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-500">10K+</div>
                                <div className="text-sm text-muted-foreground">Active Listings</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-500">5K+</div>
                                <div className="text-sm text-muted-foreground">Verified Sellers</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-500">৳50M+</div>
                                <div className="text-sm text-muted-foreground">Traded Value</div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Content - 3D Item Preview */}
                    <motion.div
                        variants={slideInFromRight}
                        className="relative flex justify-center"
                    >
                        {/* Mock 3D Item Card */}
                        <div className="relative w-full max-w-md">
                            {/* 3D Container */}
                            <motion.div
                                className="relative bg-gradient-to-br from-card to-muted border border-border rounded-2xl p-8 shadow-2xl"
                                whileHover={{
                                    rotateY: 5,
                                    rotateX: 5,
                                    scale: 1.02
                                }}
                                style={{
                                    transformStyle: "preserve-3d",
                                    perspective: "1000px"
                                }}
                            >
                                {/* Item Image Placeholder */}
                                <div className="aspect-square bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-xl mb-6 flex items-center justify-center relative overflow-hidden">
                                    <div className="text-6xl">🔫</div>
                                    {/* Glow Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-600/30 rounded-xl" />
                                </div>

                                {/* Item Details */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-bold text-lg">AK-47 | Case Hardened</h3>
                                            <p className="text-sm text-muted-foreground">StatTrak™ Factory New</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-green-500">$675.00</p>
                                            <p className="text-sm text-red-500">-4.2%</p>
                                        </div>
                                    </div>

                                    {/* Float Value */}
                                    <div className="bg-muted/50 rounded-lg p-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Float Value:</span>
                                            <span className="font-mono">0.0001234567</span>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-2 mt-2">
                                            <div className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full" style={{ width: '12%' }} />
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        <Button className="flex-1">Buy Now</Button>
                                        <Button variant="outline" className="flex-1">Make Offer</Button>
                                    </div>
                                </div>

                                {/* Decorative Elements */}
                                <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500/20 rounded-full" />
                                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-500/20 rounded-full" />
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Floating Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-500 rounded-full"
                    animate={{
                        y: [0, -20, 0],
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-500 rounded-full"
                    animate={{
                        y: [0, 20, 0],
                        opacity: [0.3, 0.8, 0.3],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1,
                    }}
                />
            </div>
        </section>
    );
}


