"use client";

import { motion } from "framer-motion";
import {
    Smartphone,
    Search,
    Bell,
    Globe,
    CheckCircle,
    Database,
    Calculator,
    Eye,
    Chrome
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fadeInUp, staggerContainer, slideInFromLeft, slideInFromRight } from "@/lib/animations";

const features = [
    {
        icon: Search,
        title: "Search and Buy Instantly, Anywhere",
        description: "Browse and purchase CS2 items on the go with our mobile app",
    },
    {
        icon: Bell,
        title: "Push Notifications",
        description: "Get notified about account activities, price changes, and trade updates",
    },
    {
        icon: Globe,
        title: "Sell Anywhere",
        description: "Automatically create trade offers from your mobile device",
    },
    {
        icon: CheckCircle,
        title: "Sales Verification",
        description: "Automatically update trade status and confirmations",
    },
    {
        icon: Database,
        title: "Explore FloatDB",
        description: "Access our complete database of CS2 skins on mobile",
    },
];

const appFeatures = [
    {
        title: "Advanced Search",
        description: "Quickly filter and discover items on the CS2Trade BD Marketplace",
        image: "📱",
        features: ["Filter by price", "Search by name", "Sort by float value"],
    },
    {
        title: "Marketplace",
        description: "Buy and Sell CS2 items with features like offers and auctions",
        image: "🛒",
        features: ["Live pricing", "Instant buy", "Make offers"],
    },
    {
        title: "Database",
        description: "Explore over a billion skins with screenshots & history",
        image: "🗄️",
        features: ["Float tracking", "Price history", "Item statistics"],
    },
];

const tools = [
    {
        icon: Calculator,
        title: "Trade Up Calculator",
        description: "Calculate exactly which items you'll get from trade ups",
    },
    {
        icon: Eye,
        title: "Float Checker",
        description: "Check detailed item statistics and float values",
    },
    {
        icon: Chrome,
        title: "Browser Extension",
        description: "Enhance your Steam trading experience with our browser extension",
        browsers: ["Chrome"],
        actions: ["Add CS2Trade BD Trade Offers", "Enhance Steam Community Market", "View Screenshots"],
    },
];

export default function AppPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                    >
                        {/* Left Content */}
                        <motion.div variants={slideInFromLeft} className="space-y-8">
                            <div className="space-y-6">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                        <span className="text-white font-bold text-2xl">f</span>
                                    </div>
                                    <h1 className="text-5xl font-bold">CS2Trade BD App</h1>
                                </div>
                                <p className="text-xl text-muted-foreground">
                                    Buy, Sell, Search, and Discover CS2 skins seamlessly.
                                    Anytime, Anywhere.
                                </p>
                            </div>

                            {/* Download Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button size="lg" className="text-lg px-8 py-6 bg-green-600 hover:bg-green-700">
                                    <Smartphone className="w-6 h-6 mr-3" />
                                    Install for Android
                                </Button>
                                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                                    <Smartphone className="w-6 h-6 mr-3" />
                                    Install for iOS
                                </Button>
                            </div>
                        </motion.div>

                        {/* Right Content - Phone Mockup */}
                        <motion.div variants={slideInFromRight} className="flex justify-center">
                            <div className="relative">
                                {/* Phone Frame */}
                                <motion.div
                                    className="relative w-80 h-[600px] bg-gradient-to-br from-gray-900 to-gray-800 rounded-[3rem] p-2 shadow-2xl"
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
                                    {/* Screen */}
                                    <div className="w-full h-full bg-background rounded-[2.5rem] overflow-hidden">
                                        {/* Status Bar */}
                                        <div className="flex justify-between items-center p-4 text-xs">
                                            <span>9:41</span>
                                            <span>100%</span>
                                        </div>

                                        {/* App Header */}
                                        <div className="px-4 pb-4 border-b border-border">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded">
                                                        <span className="text-white text-xs font-bold flex items-center justify-center h-full">f</span>
                                                    </div>
                                                    <span className="font-bold">CS2Trade BD</span>
                                                </div>
                                                <Bell className="w-5 h-5 text-muted-foreground" />
                                            </div>
                                        </div>

                                        {/* App Content */}
                                        <div className="p-4 space-y-4">
                                            {/* Search Bar */}
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                                <input
                                                    placeholder="Search items..."
                                                    className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg text-sm"
                                                />
                                            </div>

                                            {/* Item Cards */}
                                            <div className="space-y-3">
                                                <div className="bg-card border border-border rounded-lg p-3">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center text-lg">
                                                            🔫
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="font-medium text-sm">AK-47 | Case Hardened</div>
                                                            <div className="text-xs text-muted-foreground">Field-Tested</div>
                                                            <div className="font-bold text-green-500 text-sm">$675.00</div>
                                                        </div>
                                                        <Button size="sm" className="text-xs">Buy</Button>
                                                    </div>
                                                </div>

                                                <div className="bg-card border border-border rounded-lg p-3">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center text-lg">
                                                            🔪
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="font-medium text-sm">Karambit | Fade</div>
                                                            <div className="text-xs text-muted-foreground">Factory New</div>
                                                            <div className="font-bold text-green-500 text-sm">$2,100.00</div>
                                                        </div>
                                                        <Button size="sm" className="text-xs">Buy</Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom Navigation */}
                                        <div className="absolute bottom-0 left-0 right-0 bg-background border-t border-border p-4">
                                            <div className="flex justify-around">
                                                {["🏠", "🔍", "🛒", "👤", "⚙️"].map((icon, index) => (
                                                    <div key={index} className="text-center">
                                                        <div className="text-lg mb-1">{icon}</div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {["Home", "Search", "Cart", "Profile", "Settings"][index]}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Glow Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-[3rem] blur-xl -z-10" />
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 bg-muted/20">
                <div className="container mx-auto px-4">
                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="space-y-12"
                    >
                        <motion.div variants={fadeInUp} className="text-center">
                            <h2 className="text-4xl font-bold mb-4">Mobile App Features</h2>
                            <p className="text-xl text-muted-foreground">
                                Everything you need for CS2 trading on mobile
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <motion.div key={feature.title} variants={fadeInUp} custom={index}>
                                    <Card className="h-full text-center">
                                        <CardHeader>
                                            <div className="mx-auto p-3 bg-primary/10 rounded-lg w-fit mb-4">
                                                <feature.icon className="w-8 h-8 text-primary" />
                                            </div>
                                            <CardTitle>{feature.title}</CardTitle>
                                            <CardDescription>{feature.description}</CardDescription>
                                        </CardHeader>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* App Screenshots */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="space-y-12"
                    >
                        <motion.div variants={fadeInUp} className="text-center">
                            <h2 className="text-4xl font-bold mb-4">App Screenshots</h2>
                            <p className="text-xl text-muted-foreground">
                                See what our mobile app looks like
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {appFeatures.map((feature, index) => (
                                <motion.div key={feature.title} variants={fadeInUp} custom={index}>
                                    <Card>
                                        <CardHeader>
                                            <div className="flex items-center space-x-3 mb-4">
                                                <div className="text-3xl">{feature.image}</div>
                                                <CardTitle>{feature.title}</CardTitle>
                                            </div>
                                            <CardDescription>{feature.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                {feature.features.map((item, i) => (
                                                    <div key={i} className="flex items-center space-x-2 text-sm">
                                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                                        <span>{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Tools Section */}
            <section className="py-20 bg-muted/20">
                <div className="container mx-auto px-4">
                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="space-y-12"
                    >
                        <motion.div variants={fadeInUp} className="text-center">
                            <h2 className="text-4xl font-bold mb-4">Additional Tools</h2>
                            <p className="text-xl text-muted-foreground">
                                Enhance your trading experience with our tools
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {tools.map((tool, index) => (
                                <motion.div key={tool.title} variants={fadeInUp} custom={index}>
                                    <Card className="h-full">
                                        <CardHeader>
                                            <div className="flex items-center space-x-3 mb-4">
                                                <div className="p-2 bg-primary/10 rounded-lg">
                                                    <tool.icon className="w-6 h-6 text-primary" />
                                                </div>
                                                <CardTitle>{tool.title}</CardTitle>
                                            </div>
                                            <CardDescription>{tool.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            {tool.browsers && (
                                                <div className="space-y-3">
                                                    <div className="flex space-x-2">
                                                        {tool.browsers.map((browser) => (
                                                            <div key={browser} className="flex items-center space-x-1 text-sm">

                                                                <Chrome className="w-4 h-4" />


                                                                <span>{browser}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="space-y-1">
                                                        {tool.actions?.map((action, i) => (
                                                            <div key={i} className="text-xs text-muted-foreground">
                                                                • {action}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Download CTA */}
            <section className="py-20">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <motion.div variants={fadeInUp}>
                            <h2 className="text-4xl font-bold mb-4">Download Now</h2>
                            <p className="text-xl text-muted-foreground">
                                Get the CS2Trade BD app and start trading on mobile
                            </p>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="text-lg px-8 py-6 bg-green-600 hover:bg-green-700">
                                <Smartphone className="w-6 h-6 mr-3" />
                                Install for Android
                            </Button>
                            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                                <Smartphone className="w-6 h-6 mr-3" />
                                Install for iOS
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
