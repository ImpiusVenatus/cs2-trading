"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ItemCard } from "@/components/ui/item-card";
import { Button } from "@/components/ui/button";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const mockItems = [
    {
        id: 1,
        name: "AK-47 | Hydroponic",
        condition: "Field-Tested",
        price: 10600.00,
        priceChange: -19.4,
        floatValue: "0.1234567890",
        patternIndex: "#235",
        isStatTrak: true,
        status: "online" as const,
    },
    {
        id: 2,
        name: "Sport Gloves | Superconductor",
        condition: "Well-Worn",
        price: 10033.56,
        priceChange: -15.6,
        floatValue: "0.2345678901",
        patternIndex: "#123",
        status: "offline" as const,
    },
    {
        id: 3,
        name: "Moto Gloves | Spearmint",
        condition: "Factory New",
        price: 7302.22,
        priceChange: -17.2,
        floatValue: "0.0123456789",
        patternIndex: "#456",
        isStatTrak: true,
        status: "online" as const,
    },
    {
        id: 4,
        name: "Karambit | Gamma Doppler",
        condition: "Factory New",
        price: 6874.87,
        priceChange: -18.0,
        floatValue: "0.0012345678",
        patternIndex: "#789",
        status: "offline" as const,
    },
    {
        id: 5,
        name: "Butterfly Knife | Doppler",
        condition: "Minimal Wear",
        price: 5800.00,
        priceChange: -12.5,
        floatValue: "0.0567890123",
        patternIndex: "#321",
        isSouvenir: true,
        status: "online" as const,
    },
    {
        id: 6,
        name: "AWP | Dragon Lore",
        condition: "Field-Tested",
        price: 15200.00,
        priceChange: -8.3,
        floatValue: "0.1678901234",
        patternIndex: "#654",
        isStatTrak: true,
        status: "offline" as const,
    },
];

const tabs = ["Top Deals", "Newest Listings", "Premium Items"];

export function FeaturedItems() {
    const [activeTab, setActiveTab] = useState("Top Deals");

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

                    {/* View All Button */}
                    <motion.div variants={fadeInUp} className="text-center">
                        <Button size="lg" variant="outline">
                            View All Items
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}


