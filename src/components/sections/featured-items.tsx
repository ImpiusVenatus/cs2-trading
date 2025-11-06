"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ItemCard } from "@/components/ui/item-card";
import { Button } from "@/components/ui/button";
import { fadeInUp, staggerContainer } from "@/lib/animations";
type FeaturedItem = {
    id: string;
    name: string;
    condition: string;
    price: number;
    priceChange?: number;
    floatValue?: string;
    patternIndex?: string;
    imageUrl?: string;
    isStatTrak?: boolean;
    isSouvenir?: boolean;
    status?: "online" | "offline";
    rarity?: string;
};

const placeholderItems: FeaturedItem[] = [
    { id: "ph-1", name: "AK-47 | Redline", condition: "Field-Tested", price: 120.0, priceChange: -5.2, floatValue: "0.2200000000", patternIndex: "#131", imageUrl: "/assets/rifle.png", isStatTrak: false, isSouvenir: false, status: "online", rarity: "Classified" },
    { id: "ph-2", name: "M4A1-S | Golden Coil", condition: "Minimal Wear", price: 310.0, priceChange: 1.1, floatValue: "0.0900000000", patternIndex: "#027", imageUrl: "/assets/rifle-2.png", isStatTrak: true, isSouvenir: false, status: "online", rarity: "Covert" },
    { id: "ph-3", name: "AWP | Asiimov", condition: "Battle-Scarred", price: 210.0, priceChange: -0.8, floatValue: "0.7800000000", patternIndex: "#005", imageUrl: "/assets/rifle-3.png", isStatTrak: false, isSouvenir: false, status: "online", rarity: "Covert" },
    { id: "ph-4", name: "Glock-18 | Water Elemental", condition: "Field-Tested", price: 35.0, priceChange: 0.0, floatValue: "0.2500000000", patternIndex: "#090", imageUrl: "/assets/rifle.png", isStatTrak: false, isSouvenir: false, status: "online", rarity: "Classified" },
    { id: "ph-5", name: "Desert Eagle | Mecha Industries", condition: "Minimal Wear", price: 78.5, priceChange: 0.6, floatValue: "0.1200000000", patternIndex: "#064", imageUrl: "/assets/rifle-2.png", isStatTrak: false, isSouvenir: false, status: "online", rarity: "Classified" },
    { id: "ph-6", name: "USP-S | Kill Confirmed", condition: "Field-Tested", price: 160.0, priceChange: -1.3, floatValue: "0.2900000000", patternIndex: "#012", imageUrl: "/assets/rifle-3.png", isStatTrak: true, isSouvenir: false, status: "online", rarity: "Covert" },
    { id: "ph-7", name: "AK-47 | Case Hardened", condition: "Well-Worn", price: 245.0, priceChange: 0.9, floatValue: "0.4200000000", patternIndex: "#321", imageUrl: "/assets/rifle.png", isStatTrak: false, isSouvenir: false, status: "online", rarity: "Classified" },
    { id: "ph-8", name: "M4A4 | Howl", condition: "Field-Tested", price: 1250.0, priceChange: 2.3, floatValue: "0.2300000000", patternIndex: "#014", imageUrl: "/assets/rifle-2.png", isStatTrak: false, isSouvenir: false, status: "online", rarity: "Contraband" },
];

const tabs = ["Top Deals", "Newest Listings", "Premium Items"];

export function FeaturedItems() {
    const items = placeholderItems;

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


