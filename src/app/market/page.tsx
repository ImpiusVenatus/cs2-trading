"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ItemCard } from "@/components/ui/item-card";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const categories = [
    "Rifles", "Pistols", "SMGs", "Heavy", "Knives", "Gloves",
    "Agents", "Containers", "Stickers", "Keychains", "Patches",
    "Collectibles", "Music Kits"
];

const filters = [
    "All Items", "Sticker Combos", "Unique Items", "Best Deals"
];

const mockItems = [
  {
    id: 1,
    name: "AK-47 | Case Hardened",
    condition: "Field-Tested",
    price: 675.00,
    priceChange: -4.2,
    floatValue: "0.1234567890",
    patternIndex: "#235",
    isStatTrak: true,
    status: "online" as const,
  },
  {
    id: 2,
    name: "Karambit | Gamma Doppler",
    condition: "Factory New",
    price: 1200.50,
    priceChange: 2.1,
    floatValue: "0.0012345678",
    patternIndex: "#789",
    status: "offline" as const,
  },
  {
    id: 3,
    name: "Sport Gloves | Superconductor",
    condition: "Well-Worn",
    price: 890.25,
    priceChange: -8.7,
    floatValue: "0.2345678901",
    patternIndex: "#123",
    status: "online" as const,
  },
  {
    id: 4,
    name: "AWP | Dragon Lore",
    condition: "Field-Tested",
    price: 2500.00,
    priceChange: -12.3,
    floatValue: "0.1678901234",
    patternIndex: "#654",
    isStatTrak: true,
    status: "offline" as const,
  },
  {
    id: 5,
    name: "Butterfly Knife | Doppler",
    condition: "Minimal Wear",
    price: 980.75,
    priceChange: 5.2,
    floatValue: "0.0567890123",
    patternIndex: "#321",
    status: "online" as const,
  },
  {
    id: 6,
    name: "M4A4 | Poseidon",
    condition: "Factory New",
    price: 450.00,
    priceChange: -3.8,
    floatValue: "0.0123456789",
    patternIndex: "#987",
    isSouvenir: true,
    status: "offline" as const,
  },
  {
    id: 7,
    name: "Glock-18 | Fade",
    condition: "Factory New",
    price: 320.50,
    priceChange: 1.5,
    floatValue: "0.0012345678",
    patternIndex: "#456",
    status: "online" as const,
  },
  {
    id: 8,
    name: "Moto Gloves | Spearmint",
    condition: "Field-Tested",
    price: 750.25,
    priceChange: -6.9,
    floatValue: "0.1234567890",
    patternIndex: "#159",
    isStatTrak: true,
    status: "offline" as const,
  },
];

export default function MarketPage() {
  const [selectedCategory, setSelectedCategory] = useState("Knives");
  const [selectedFilter, setSelectedFilter] = useState("All Items");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

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
                    <motion.div variants={fadeInUp} className="space-y-6">
                        <div>
                            <h1 className="text-4xl font-bold">Marketplace</h1>
                            <p className="text-xl text-muted-foreground">
                                Buy and sell CS2 items with the best rates in Bangladesh
                            </p>
                        </div>

                        {/* Search Bar */}
                        <div className="flex gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    placeholder="Search for items..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2"
                            >
                                <SlidersHorizontal className="w-4 h-4" />
                                Filters
                            </Button>
                        </div>

            {/* Results Count */}
            <div className="text-sm text-muted-foreground">
              Showing {mockItems.length} of {mockItems.length} items
            </div>
                    </motion.div>

                    {/* Category Navigation */}
                    <motion.div variants={fadeInUp} className="space-y-4">
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

                    {/* Filter Tabs */}
                    <motion.div variants={fadeInUp}>
                        <div className="flex gap-2">
                            {filters.map((filter) => (
                                <Button
                                    key={filter}
                                    variant={selectedFilter === filter ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setSelectedFilter(filter)}
                                >
                                    {filter}
                                </Button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Filters Sidebar */}
                    {showFilters && (
                        <motion.div
                            variants={fadeInUp}
                            className="grid grid-cols-1 lg:grid-cols-4 gap-8"
                        >
                            {/* Filters */}
                            <div className="lg:col-span-1 space-y-6">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-semibold mb-4">Price Range</h3>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input placeholder="From" type="number" />
                      <Input placeholder="To" type="number" />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">&lt;$10</Button>
                      <Button variant="outline" size="sm">$10-$50</Button>
                      <Button variant="outline" size="sm">$50-$250</Button>
                      <Button variant="outline" size="sm">&gt;$250</Button>
                    </div>
                  </div>
                </div>

                                <div className="bg-card border border-border rounded-lg p-6">
                                    <h3 className="font-semibold mb-4">Wear</h3>
                                    <div className="space-y-2">
                                        {["FN", "MW", "FT", "WW", "BS"].map((wear) => (
                                            <label key={wear} className="flex items-center space-x-2">
                                                <input type="checkbox" className="rounded" />
                                                <span className="text-sm">{wear}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-card border border-border rounded-lg p-6">
                                    <h3 className="font-semibold mb-4">Special</h3>
                                    <div className="space-y-2">
                                        {["StatTrak™", "Souvenir", "Highlight", "Normal"].map((special) => (
                                            <label key={special} className="flex items-center space-x-2">
                                                <input type="checkbox" className="rounded" />
                                                <span className="text-sm">{special}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Items Grid */}
                            <div className="lg:col-span-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {mockItems.map((item, index) => (
                                        <motion.div
                                            key={item.id}
                                            variants={fadeInUp}
                                            custom={index}
                                        >
                                            <ItemCard
                                                name={item.name}
                                                condition={item.condition}
                                                price={item.price}
                                                priceChange={item.priceChange}
                                                floatValue={item.floatValue}
                                                patternIndex={item.patternIndex}
                                                isStatTrak={item.isStatTrak}
                                                isSouvenir={item.isSouvenir}
                                                status={item.status}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Items Grid (when filters are hidden) */}
                    {!showFilters && (
                        <motion.div
                            variants={staggerContainer}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
                        >
                            {mockItems.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    variants={fadeInUp}
                                    custom={index}
                                >
                                    <ItemCard
                                        name={item.name}
                                        condition={item.condition}
                                        price={item.price}
                                        priceChange={item.priceChange}
                                        floatValue={item.floatValue}
                                        patternIndex={item.patternIndex}
                                        isStatTrak={item.isStatTrak}
                                        isSouvenir={item.isSouvenir}
                                        status={item.status}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* Load More Button */}
                    <motion.div variants={fadeInUp} className="text-center pt-8">
                        <Button size="lg" variant="outline">
                            Load More Items
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
