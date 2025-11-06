"use client";

import { motion } from "framer-motion";
import {
    Shield,
    Percent,
    Gavel,
    Tag,
    Clock,
    Calculator,
    Star,
    CheckCircle,
    Gift
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const features = [
    {
        icon: Shield,
        title: "Secure Middleman Service",
        description: "We act as your trusted middleman for CS2 skin trades. Items sent via Steam, funds held securely until verification - protecting both buyers and sellers from scams",
    },
    {
        icon: CheckCircle,
        title: "Verified Sellers Only",
        description: "All sellers are verified with NID to ensure legitimacy. Buy with confidence knowing every seller has been authenticated - no scams, no fraud",
    },
    {
        icon: Tag,
        title: "CS2 Skin Trading",
        description: "Facilitate safe CS2 skin trades through our platform. We handle the transaction as middleman, ensuring items are delivered before funds are released",
    },
    {
        icon: Percent,
        title: "Lowest Fees in Bangladesh",
        description: "Dynamic fees from 0.5% to 3.5% - keep more of your earnings from every trade",
        comparison: { competitor: "15%", us: "2%" },
    },
    {
        icon: Gavel,
        title: "Premium Subscriptions",
        description: "Sellers can list and sell premium subscriptions like Netflix and Spotify. Buyers get instant access to verified subscription services",
    },
    {
        icon: Gift,
        title: "Steam Referral Codes",
        description: "Trade Steam referral codes safely through our platform. Verified sellers offer legitimate codes with our middleman protection",
    },
];

const stats = [
    { label: "Active Listings", value: "10,000+" },
    { label: "Verified Traders", value: "5,000+" },
    { label: "Successful Trades", value: "50,000+" },
    { label: "BDT Traded", value: "৳50M+" },
];

const reviews = {
    rating: 4.9,
    count: "500+",
    status: "Excellent",
};

export function FeaturesSection() {
    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="space-y-20"
                >
                    {/* Platform Features Grid */}
                    <motion.div variants={fadeInUp} className="space-y-12">
                        <div className="text-center space-y-4">
                            <h2 className="text-4xl font-bold">Why Choose CS2BD</h2>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                We facilitate secure CS2 skin trades as your trusted middleman, connect you with verified sellers, and enable sales of premium subscriptions and Steam referral codes
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <motion.div key={feature.title} variants={fadeInUp} custom={index}>
                                    <Card className="h-full">
                                        <CardHeader>
                                            <div className="flex items-center space-x-3 mb-4">
                                                <div className="p-2 bg-primary/10 rounded-lg">
                                                    <feature.icon className="w-6 h-6 text-primary" />
                                                </div>
                                                <CardTitle className="text-lg">{feature.title}</CardTitle>
                                            </div>
                                            <CardDescription>{feature.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            {/* Special content for specific features */}
                                            {feature.comparison && (
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <div className="text-sm text-muted-foreground">Competitors</div>
                                                        <div className="text-lg font-bold text-[#EF626C]">{feature.comparison.competitor}</div>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div className="text-sm text-muted-foreground">CS2BD</div>
                                                        <div className="text-lg font-bold text-[#84DCCF]">{feature.comparison.us}</div>
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Trust Section */}
                    <motion.div variants={fadeInUp} className="text-center space-y-12">
                        <div>
                            <h2 className="text-4xl font-bold mb-4">Trusted by the Community</h2>
                            <p className="text-xl text-muted-foreground">
                                Join Bangladesh&apos;s fastest growing CS2 trading community
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {stats.map((stat, index) => (
                                <motion.div key={stat.label} variants={fadeInUp} custom={index}>
                                    <div className="text-center space-y-2">
                                        <div className="text-3xl font-bold text-primary">{stat.value}</div>
                                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Rating */}
                        <motion.div variants={fadeInUp} className="flex items-center justify-center space-x-4">
                            <div className="flex items-center space-x-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-5 h-5 ${i < Math.floor(reviews.rating)
                                            ? "text-[#EF626C] fill-current"
                                            : "text-muted-foreground"
                                            }`}
                                    />
                                ))}
                            </div>
                            <div className="text-sm">
                                <span className="font-semibold">{reviews.rating}</span>{" "}
                                <span className="text-muted-foreground">
                                    ({reviews.count} {reviews.status})
                                </span>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}

