"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { fadeInUp, staggerContainer, slideInFromLeft, slideInFromRight } from "@/lib/animations";

const rifleImages = [
    { src: "/assets/rifle.png", name: "AK-47 | Spicy Edition", tag: "🔥 Extra Hot" },
    { src: "/assets/rifle-2.png", name: "AK-47 | Chicken Edition", tag: "🐔 Cluck Cluck" },
    { src: "/assets/rifle-3.png", name: "AK-47 | Rainbow Mode", tag: "🌈 Unicorn Approved" },
];

export function HeroSection() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % rifleImages.length);
        }, 4000); // Change every 4 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="/assets/hero-image.jpg"
                    alt="CS2 Trading Community"
                    fill
                    className="object-cover"
                    priority
                    quality={90}
                />
                {/* Dark Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/70" />
                {/* Additional Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background/80" />
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-20 relative z-10">
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
                                Your One-Stop{" "}
                                <span className="bg-gradient-to-r from-[#EF626C] to-[#84DCCF] bg-clip-text text-transparent">
                                    Trading Hub
                                </span>
                            </motion.h1>
                            <motion.p
                                className="text-xl text-foreground/90 max-w-2xl leading-relaxed"
                                variants={fadeInUp}
                            >
                                Trade CS2 skins, sell premium subscriptions (Spotify, Netflix), and 
                                exchange Steam referral codes all in one secure marketplace. Connect 
                                with verified traders, list your items, and enjoy the lowest fees in 
                                Bangladesh. Join thousands building the gaming and digital services 
                                community.
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
                                <div className="text-2xl font-bold text-[#EF626C]">10K+</div>
                                <div className="text-sm text-foreground/70">Active Listings</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-[#84DCCF]">5K+</div>
                                <div className="text-sm text-foreground/70">Verified Sellers</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-[#EF626C]">৳50M+</div>
                                <div className="text-sm text-foreground/70">Traded Value</div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Content - Trading Carousel */}
                    <motion.div
                        variants={slideInFromRight}
                        className="relative flex justify-center items-center"
                    >
                        <div className="relative w-full max-w-lg">
                            {/* Goofy Card Container */}
                            <div className="relative bg-card/90 backdrop-blur-sm border-2 border-border rounded-2xl p-8 shadow-2xl">
                                {/* Fun Badge */}
                                <motion.div
                                    animate={{
                                        rotate: [0, -5, 5, -5, 0],
                                        scale: [1, 1.1, 1],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                    className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#EF626C] to-[#84DCCF] text-white px-4 py-1 rounded-full text-sm font-semibold z-10"
                                >
                                    {rifleImages[currentIndex].tag}
                                </motion.div>

                                {/* Carousel */}
                                <div className="relative h-96 overflow-hidden rounded-xl bg-gradient-to-br from-muted/30 to-muted/10">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={currentIndex}
                                            initial={{ opacity: 0, rotate: -10, scale: 0.8 }}
                                            animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                            exit={{ opacity: 0, rotate: 10, scale: 0.8 }}
                                            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                                            className="absolute inset-0 flex flex-col items-center justify-center"
                                        >
                                            <motion.div
                                                animate={{
                                                    y: [0, -10, 0],
                                                    rotate: [0, 2, -2, 0],
                                                }}
                                                transition={{
                                                    duration: 3,
                                                    repeat: Infinity,
                                                    ease: "easeInOut",
                                                }}
                                                className="relative w-full h-full flex items-center justify-center"
                                            >
                                                <Image
                                                    src={rifleImages[currentIndex].src}
                                                    alt={rifleImages[currentIndex].name}
                                                    width={400}
                                                    height={400}
                                                    className="object-contain w-full h-full drop-shadow-2xl"
                                                    priority={currentIndex === 0}
                                                />
                                            </motion.div>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>

                                {/* Goofy Item Info */}
                                <div className="mt-6 space-y-4">
                                    <div className="text-center">
                                        <h3 className="font-bold text-xl">{rifleImages[currentIndex].name}</h3>
                                    </div>

                                    {/* Carousel Indicators */}
                                    <div className="flex justify-center gap-2">
                                        {rifleImages.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentIndex(index)}
                                                className={`h-2 rounded-full transition-all ${
                                                    index === currentIndex
                                                        ? "w-8 bg-[#EF626C]"
                                                        : "w-2 bg-muted-foreground/30"
                                                }`}
                                                aria-label={`Go to slide ${index + 1}`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Fun Animation Elements */}
                                <motion.div
                                    animate={{
                                        y: [0, -15, 0],
                                        rotate: [0, 10, -10, 0],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                    className="absolute -right-4 top-1/2 -translate-y-1/2 hidden lg:block"
                                >
                                    <div className="bg-[#84DCCF]/20 backdrop-blur-sm border border-[#84DCCF]/30 rounded-lg p-3">
                                        <div className="text-xs font-semibold text-[#84DCCF]">🎯 Pew Pew</div>
                                    </div>
                                </motion.div>
                                <motion.div
                                    animate={{
                                        y: [0, 15, 0],
                                        rotate: [0, -10, 10, 0],
                                    }}
                                    transition={{
                                        duration: 2.5,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: 0.5,
                                    }}
                                    className="absolute -left-4 bottom-1/4 hidden lg:block"
                                >
                                    <div className="bg-[#EF626C]/20 backdrop-blur-sm border border-[#EF626C]/30 rounded-lg p-3">
                                        <div className="text-xs font-semibold text-[#EF626C]">💥 Boom</div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
                
                {/* Floating Accent Dots */}
                <motion.div
                    className="absolute top-1/4 right-1/4 w-3 h-3 bg-[#EF626C]/30 rounded-full blur-sm"
                    animate={{
                        y: [0, -30, 0],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-[#84DCCF]/30 rounded-full blur-sm"
                    animate={{
                        y: [0, 25, 0],
                        opacity: [0.3, 0.7, 0.3],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1,
                    }}
                />
            </div>
        </section>
    );
}


