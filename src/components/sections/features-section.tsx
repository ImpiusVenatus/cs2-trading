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
    CheckCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const features = [
    {
        icon: Shield,
        title: "Secure Peer-to-Peer Trades",
        description: "Sellers send items directly to buyers on Steam, funds released after verification",
        diagram: ["Seller", "CS2Trade BD", "Steam Trade", "Buyer"],
    },
    {
        icon: Percent,
        title: "Lowest Fees in Bangladesh",
        description: "Dynamic fees from 0.5% to 3.5% - keep more of your earnings",
        comparison: { competitor: "15%", us: "2%" },
    },
    {
        icon: CheckCircle,
        title: "Verified Sellers",
        description: "All sellers are verified with NID - trade with confidence and security",
    },
    {
        icon: Tag,
        title: "Direct Negotiation",
        description: "Make offers and negotiate directly with sellers for the best prices",
    },
    {
        icon: Clock,
        title: "No Trade Holds",
        description: "Avoid Steam's 7-day trade hold with our instant trading system",
        highlight: "0 Days",
    },
    {
        icon: Calculator,
        title: "Fee Calculator",
        description: "Calculate exactly how much you'll pay in fees before trading",
        interactive: true,
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
                            <h2 className="text-4xl font-bold">Why Choose CS2Trade BD</h2>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                Built for the Bangladesh CS2 community - fast, secure, and affordable trading
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
                                            {feature.diagram && (
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between text-sm">
                                                        {feature.diagram.map((step, i) => (
                                                            <div key={step} className="flex items-center">
                                                                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
                                                                    {step}
                                                                </div>
                                                                {i < feature.diagram.length - 1 && (
                                                                    <div className="w-8 h-0.5 bg-border mx-2" />
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {feature.comparison && (
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <div className="text-sm text-muted-foreground">Competitors</div>
                                                        <div className="text-lg font-bold text-red-500">{feature.comparison.competitor}</div>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div className="text-sm text-muted-foreground">CS2Trade BD</div>
                                                        <div className="text-lg font-bold text-green-500">{feature.comparison.us}</div>
                                                    </div>
                                                </div>
                                            )}

                                            {feature.highlight && (
                                                <div className="text-center">
                                                    <div className="text-3xl font-bold text-primary">{feature.highlight}</div>
                                                </div>
                                            )}

                                            {feature.interactive && (
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="sale-value">Sale Value</Label>
                                                        <Input
                                                            id="sale-value"
                                                            type="text"
                                                            placeholder="$10,000.00"
                                                            defaultValue="$10,000.00"
                                                        />
                                                    </div>
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex justify-between">
                                                            <span className="text-muted-foreground">Sales Fee:</span>
                                                            <span className="font-medium">$200.00</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-muted-foreground">Withdraw Fee:</span>
                                                            <span className="font-medium">$50.00</span>
                                                        </div>
                                                        <div className="border-t pt-2 flex justify-between font-semibold">
                                                            <span>Total Fees:</span>
                                                            <span>$250.00</span>
                                                        </div>
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
                                Join Bangladesh's fastest growing CS2 trading community
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
                                            ? "text-yellow-500 fill-current"
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

