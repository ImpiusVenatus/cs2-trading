"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ItemCard } from "@/components/ui/item-card";
import { Button } from "@/components/ui/button";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { CS2DataService, type CS2Item } from "@/lib/data/cs2-data";

const tabs = ["Top Deals", "Newest Listings", "Premium Items"];

export function FeaturedItems() {
    const [activeTab, setActiveTab] = useState("Top Deals");
    const [items, setItems] = useState<CS2Item[]>([]);

    useEffect(() => {
        // Load featured items based on active tab
        let result;
        switch (activeTab) {
            case "Top Deals":
                // Get items with price drops (negative priceChange)
                result = CS2DataService.getItems({ limit: 8 });
                // Filter and sort by best deals (negative price change)
                const deals = result.items
                    .filter(item => item.priceChange && item.priceChange < 0)
                    .sort((a, b) => (a.priceChange || 0) - (b.priceChange || 0))
                    .slice(0, 8);
                setItems(deals.length > 0 ? deals : result.items.slice(0, 8));
                break;
            case "Newest Listings":
                // Get newest items
                result = CS2DataService.getItems({ limit: 8 });
                setItems(result.items.slice(0, 8));
                break;
            case "Premium Items":
                // Get high-value items
                result = CS2DataService.getItems({ limit: 50 });
                const premium = result.items
                    .filter(item => item.price > 1000)
                    .sort((a, b) => b.price - a.price)
                    .slice(0, 8);
                setItems(premium.length > 0 ? premium : result.items.slice(0, 8));
                break;
            default:
                result = CS2DataService.getItems({ limit: 8 });
                setItems(result.items.slice(0, 8));
        }
    }, [activeTab]);

    return (
        <section className="py-20 bg-muted/20">
            <div className="container mx-auto px-4">
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="space-y-12"
                >
                    {/* Section Header */}
                    <motion.div variants={fadeInUp} className="text-center space-y-4">
                        <h2 className="text-4xl font-bold">Featured Listings</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Browse premium CS2 skins from verified sellers across Bangladesh
                        </p>
                    </motion.div>

                    {/* Tabs */}
                    <motion.div
                        variants={fadeInUp}
                        className="flex justify-center"
                    >
                        <div className="flex bg-muted rounded-lg p-1">
                            {tabs.map((tab) => (
                                <Button
                                    key={tab}
                                    variant={activeTab === tab ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setActiveTab(tab)}
                                    className="px-6"
                                >
                                    {tab}
                                </Button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Items Grid */}
                    <motion.div
                        variants={staggerContainer}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
                    >
                        {items.map((item, index) => (
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
                                    imageUrl={item.imageUrl}
                                    isStatTrak={item.isStatTrak}
                                    isSouvenir={item.isSouvenir}
                                    status={item.status}
                                    rarity={item.rarity}
                                />
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* View All Button */}
                    <motion.div variants={fadeInUp} className="text-center">
                        <Button size="lg" variant="outline" asChild>
                            <Link href="/market">View All Items</Link>
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}


