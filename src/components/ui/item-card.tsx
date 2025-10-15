"use client";

import { motion } from "framer-motion";
import { Star, ShoppingCart, Eye, Info, TrendingDown, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ItemCardProps {
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
    expiresIn?: string;
    className?: string;
    rarity?: string;
}

export function ItemCard({
    name,
    condition,
    price,
    priceChange = 0,
    floatValue,
    patternIndex,
    imageUrl,
    isStatTrak = false,
    isSouvenir = false,
    status = "offline",
    expiresIn,
    className,
    rarity = "Consumer",
}: ItemCardProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(price);
    };

    const getStatusColor = (status: string) => {
        return status === "online" ? "bg-green-500" : "bg-gray-500";
    };

    const getRarityColor = (rarity: string) => {
        switch (rarity.toLowerCase()) {
            case 'contraband':
                return {
                    border: 'border-yellow-400',
                    gradient: 'from-yellow-400/30 via-yellow-400/15 to-transparent',
                    bottomBorder: 'bg-yellow-400'
                };
            case 'covert':
                return {
                    border: 'border-red-500',
                    gradient: 'from-red-500/30 via-red-500/15 to-transparent',
                    bottomBorder: 'bg-red-500'
                };
            case 'classified':
                return {
                    border: 'border-purple-500',
                    gradient: 'from-purple-500/30 via-purple-500/15 to-transparent',
                    bottomBorder: 'bg-purple-500'
                };
            case 'restricted':
                return {
                    border: 'border-blue-500',
                    gradient: 'from-blue-500/30 via-blue-500/15 to-transparent',
                    bottomBorder: 'bg-blue-500'
                };
            case 'mil-spec':
                return {
                    border: 'border-blue-400',
                    gradient: 'from-blue-400/30 via-blue-400/15 to-transparent',
                    bottomBorder: 'bg-blue-400'
                };
            case 'consumer':
            default:
                return {
                    border: 'border-gray-500',
                    gradient: 'from-gray-500/30 via-gray-500/15 to-transparent',
                    bottomBorder: 'bg-gray-500'
                };
        }
    };

    const rarityColors = getRarityColor(rarity);

    return (
        <motion.div
            className={cn(
                "group relative bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300",
                rarityColors.border,
                className
            )}
            whileHover={{ y: -4 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Rarity Gradient Background */}
            <div className={cn(
                "absolute inset-0 bg-gradient-to-t opacity-30 group-hover:opacity-50 transition-opacity duration-300",
                rarityColors.gradient
            )} />

            {/* Rarity Bottom Border */}
            <div className={cn(
                "absolute bottom-0 left-0 right-0 h-0.5",
                rarityColors.bottomBorder
            )} />
            {/* Special Badges */}
            <div className="absolute top-2 left-2 z-10 flex space-x-1">
                {isStatTrak && (
                    <div className="bg-yellow-500 text-black text-xs px-2 py-1 rounded font-semibold">
                        StatTrak™
                    </div>
                )}
                {isSouvenir && (
                    <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded font-semibold">
                        Souvenir
                    </div>
                )}
            </div>

            {/* Status Indicator */}
            <div className="absolute top-2 right-2 z-10">
                <div className={cn("w-2 h-2 rounded-full", getStatusColor(status))} />
            </div>

            {/* Item Image */}
            <div className="relative aspect-square bg-muted/20 flex items-center justify-center overflow-hidden">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={name}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                ) : (
                    <div className="text-muted-foreground text-center">
                        <div className="w-16 h-16 bg-muted rounded-lg mx-auto mb-2" />
                        <p className="text-xs">No Image</p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
                    <Button size="sm" variant="secondary">
                        <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="secondary">
                        <ShoppingCart className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="secondary">
                        <Info className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Item Details */}
            <div className="p-4 space-y-2">
                {/* Name and Condition */}
                <div>
                    <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <h3 className="font-semibold text-sm truncate">{name}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground">{condition}</p>
                </div>

                {/* Price and Change */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-bold text-green-500">{formatPrice(price)}</p>
                        {priceChange !== 0 && (
                            <div className={cn(
                                "flex items-center text-xs",
                                priceChange > 0 ? "text-green-500" : "text-red-500"
                            )}>
                                {priceChange > 0 ? (
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                ) : (
                                    <TrendingDown className="w-3 h-3 mr-1" />
                                )}
                                {Math.abs(priceChange).toFixed(1)}%
                            </div>
                        )}
                    </div>
                    <div className="text-right">
                        <Button size="sm" className="text-xs">
                            Buy Now
                        </Button>
                    </div>
                </div>

                {/* Float Value and Pattern */}
                {(floatValue || patternIndex) && (
                    <div className="text-xs text-muted-foreground space-y-1">
                        {floatValue && (
                            <p>Float: {floatValue}</p>
                        )}
                        {patternIndex && (
                            <p>Pattern: {patternIndex}</p>
                        )}
                    </div>
                )}

                {/* Expiration */}
                {expiresIn && (
                    <div className="text-xs text-orange-500">
                        Expires in: {expiresIn}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
