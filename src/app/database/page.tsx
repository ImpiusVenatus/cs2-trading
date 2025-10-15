"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Eye, Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const mockDatabaseItems = [
    {
        id: 1,
        rank: 1,
        name: "M9 Bayonet | Vanilla",
        floatValue: "0.00000000000000000000",
        seed: "0",
        wear: "FN",
        price: 850.00,
        stickers: ["ESL One Cologne 2015"],
        image: "🔪",
    },
    {
        id: 2,
        rank: 2,
        name: "AWP | Eye of Osiris",
        floatValue: "0.00000000000000000000",
        seed: "0",
        wear: "FN",
        price: 1200.00,
        stickers: ["Kato 2014"],
        image: "🔫",
    },
    {
        id: 3,
        rank: 3,
        name: "AK-47 | Neon Rider",
        floatValue: "0.00000000000000000000",
        seed: "0",
        wear: "FN",
        price: 450.00,
        stickers: ["Crown Foil", "Team Liquid"],
        image: "🔫",
    },
    {
        id: 4,
        rank: 4,
        name: "Karambit | Fade",
        floatValue: "0.00000000000000000000",
        seed: "0",
        wear: "FN",
        price: 2100.00,
        stickers: [],
        image: "🔪",
    },
    {
        id: 5,
        rank: 5,
        name: "Glock-18 | Fade",
        floatValue: "0.00000000000000000000",
        seed: "0",
        wear: "FN",
        price: 320.00,
        stickers: ["Titan"],
        image: "🔫",
    },
    {
        id: 6,
        rank: 6,
        name: "M4A4 | Howl",
        floatValue: "0.00000000000000000000",
        seed: "0",
        wear: "FN",
        price: 3800.00,
        stickers: [],
        image: "🔫",
    },
];

const wearColors = {
    FN: "text-green-500",
    MW: "text-blue-500",
    FT: "text-yellow-500",
    WW: "text-orange-500",
    BS: "text-red-500",
};

export default function DatabasePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [showFilters, setShowFilters] = useState(false);

    const categories = ["All", "Knives", "Rifles", "Pistols", "SMGs", "Heavy", "Gloves"];

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="space-y-8"
                >
                    {/* Page Header */}
                    <motion.div variants={fadeInUp} className="text-center space-y-6">
                        <div>
                            <h1 className="text-5xl font-bold mb-4">
                                <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                                    Float Database
                                </span>
                            </h1>
                            <p className="text-2xl text-muted-foreground">
                                1,313,261,393 Skins across millions of inventories
                            </p>
                            <p className="text-lg text-muted-foreground mt-4">
                                The Most Expansive Database in Counter-Strike
                            </p>
                        </div>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                                <Input
                                    placeholder="Search by name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-12 text-lg py-6"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Category Navigation */}
                    <motion.div variants={fadeInUp} className="flex justify-center">
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <Button
                                    key={category}
                                    variant={selectedCategory === category ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedCategory(category)}
                                >
                                    {category}
                                </Button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Database Stats */}
                    <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardContent className="p-6 text-center">
                                <div className="text-3xl font-bold text-blue-500 mb-2">1.3B+</div>
                                <div className="text-sm text-muted-foreground">Total Skins Indexed</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6 text-center">
                                <div className="text-3xl font-bold text-green-500 mb-2">50M+</div>
                                <div className="text-sm text-muted-foreground">Inventories Scanned</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6 text-center">
                                <div className="text-3xl font-bold text-purple-500 mb-2">24/7</div>
                                <div className="text-sm text-muted-foreground">Real-time Updates</div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Items Table */}
                    <motion.div variants={fadeInUp}>
                        <Card>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-muted/50">
                                            <tr>
                                                <th className="text-left p-4 font-semibold">#</th>
                                                <th className="text-left p-4 font-semibold">Name</th>
                                                <th className="text-left p-4 font-semibold">Float Value</th>
                                                <th className="text-left p-4 font-semibold">Seed</th>
                                                <th className="text-left p-4 font-semibold">Wear</th>
                                                <th className="text-left p-4 font-semibold">Applied</th>
                                                <th className="text-left p-4 font-semibold">Price</th>
                                                <th className="text-left p-4 font-semibold">Image</th>
                                                <th className="text-left p-4 font-semibold">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {mockDatabaseItems.map((item, index) => (
                                                <motion.tr
                                                    key={item.id}
                                                    variants={fadeInUp}
                                                    custom={index}
                                                    className={`border-b border-border hover:bg-muted/30 transition-colors ${index % 2 === 0 ? "bg-background" : "bg-muted/10"
                                                        }`}
                                                >
                                                    <td className="p-4 font-mono text-sm text-muted-foreground">
                                                        {item.rank}
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="font-medium">{item.name}</div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="font-mono text-sm">{item.floatValue}</div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="font-mono text-sm">{item.seed}</div>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className={`font-semibold ${wearColors[item.wear as keyof typeof wearColors]}`}>
                                                            {item.wear}
                                                        </span>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex space-x-1">
                                                            {item.stickers.slice(0, 3).map((sticker, i) => (
                                                                <div
                                                                    key={i}
                                                                    className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded text-xs flex items-center justify-center text-white font-bold"
                                                                >
                                                                    {sticker.charAt(0)}
                                                                </div>
                                                            ))}
                                                            {item.stickers.length > 3 && (
                                                                <div className="w-6 h-6 bg-muted rounded text-xs flex items-center justify-center text-muted-foreground">
                                                                    +{item.stickers.length - 3}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="font-bold text-green-500">
                                                            ${item.price.toFixed(2)}
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center text-2xl">
                                                            {item.image}
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex space-x-2">
                                                            <Button size="sm" variant="outline">
                                                                <Eye className="w-4 h-4" />
                                                            </Button>
                                                            <Button size="sm" variant="outline">
                                                                <Star className="w-4 h-4" />
                                                            </Button>
                                                            <Button size="sm" variant="outline">
                                                                <ShoppingCart className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Load More Button */}
                    <motion.div variants={fadeInUp} className="text-center pt-8">
                        <Button size="lg" variant="outline">
                            Load More Results
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
