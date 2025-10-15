"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Loader2, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ItemCard } from "@/components/ui/item-card";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { CS2DataService, type CS2Item } from "@/lib/data/cs2-data";

const categories = [
    "Rifles", "Pistols", "SMGs", "Heavy", "Knives", "Gloves",
    "Agents", "Containers", "Stickers", "Keychains", "Patches",
    "Collectibles", "Music Kits"
];

const filters = [
    "All Items", "Sticker Combos", "Unique Items", "Best Deals"
];

// Filter options
const wearOptions = ["FN", "MW", "FT", "WW", "BS"];
const specialOptions = ["StatTrak™", "Souvenir", "Highlight", "Normal"];

export default function MarketPage() {
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("All Items");
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [minPrice, setMinPrice] = useState<number | undefined>();
    const [maxPrice, setMaxPrice] = useState<number | undefined>();
    const [selectedWear, setSelectedWear] = useState<string[]>([]);
    const [selectedSpecial, setSelectedSpecial] = useState<string[]>([]);

    // Simple state management
    const [items, setItems] = useState<CS2Item[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const itemsPerPage = 20;

    // Load items function
    const loadItems = useCallback((page: number = currentPage, reset: boolean = false) => {
        setIsLoading(true);
        setError(null);

        try {
            const offset = (page - 1) * itemsPerPage;
            const result = CS2DataService.getItems({
                search: searchQuery,
                category: selectedCategory || undefined,
                minPrice,
                maxPrice,
                wear: selectedWear.length > 0 ? selectedWear : undefined,
                special: selectedSpecial.length > 0 ? selectedSpecial : undefined,
                limit: itemsPerPage,
                offset
            });

            if (reset || page === 1) {
                setItems(result.items);
            } else {
                setItems(prev => [...prev, ...result.items]);
            }

            setTotalCount(result.totalCount);
            setHasMore(result.hasMore);
            setCurrentPage(page);

            // Debug pagination
            console.log('🔍 Pagination Debug:', {
                page,
                itemsLoaded: result.items.length,
                totalItems: result.totalCount,
                hasMore: result.hasMore,
                reset
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load items');
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, searchQuery, selectedCategory, minPrice, maxPrice, selectedWear, selectedSpecial, itemsPerPage]);

    // Load items on mount
    useEffect(() => {
        setCurrentPage(1);
        loadItems(1, true);
    }, [loadItems]);

    // Load items when filters change (reset to page 1)
    useEffect(() => {
        setCurrentPage(1);
        loadItems(1, true);
    }, [selectedCategory, minPrice, maxPrice, selectedWear, selectedSpecial, loadItems]);

    // Debounced search (reset to page 1)
    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPage(1);
            loadItems(1, true);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery, loadItems]);

    // Load more items function
    const loadMore = () => {
        if (hasMore && !isLoading) {
            loadItems(currentPage + 1, false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="space-y-8"
                >
                    {/* Hero Section */}
                    <div className="text-center">
                        <h2 className="text-4xl font-bold mb-2">Marketplace</h2>
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
                    {totalCount > 0 && (
                        <div className="text-sm text-muted-foreground">
                            Showing {items.length} of {totalCount} items
                        </div>
                    )}

                    {/* Advanced Filters Panel */}
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-card border rounded-lg p-4 space-y-4"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold">Advanced Filters</h3>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowFilters(false)}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Price Range */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Price Range</label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="number"
                                            placeholder="Min"
                                            value={minPrice || ""}
                                            onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
                                            className="w-full"
                                        />
                                        <Input
                                            type="number"
                                            placeholder="Max"
                                            value={maxPrice || ""}
                                            onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
                                            className="w-full"
                                        />
                                    </div>
                                </div>

                                {/* Wear Condition */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Wear Condition</label>
                                    <div className="flex flex-wrap gap-1">
                                        {wearOptions.map((wear) => (
                                            <Button
                                                key={wear}
                                                variant={selectedWear.includes(wear) ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedWear(prev =>
                                                        prev.includes(wear)
                                                            ? prev.filter(w => w !== wear)
                                                            : [...prev, wear]
                                                    );
                                                }}
                                                className="text-xs"
                                            >
                                                {wear}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                {/* Special Properties */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Special Properties</label>
                                    <div className="flex flex-wrap gap-1">
                                        {specialOptions.map((special) => (
                                            <Button
                                                key={special}
                                                variant={selectedSpecial.includes(special) ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedSpecial(prev =>
                                                        prev.includes(special)
                                                            ? prev.filter(s => s !== special)
                                                            : [...prev, special]
                                                    );
                                                }}
                                                className="text-xs"
                                            >
                                                {special}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Clear Filters */}
                            <div className="flex justify-end">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setMinPrice(undefined);
                                        setMaxPrice(undefined);
                                        setSelectedWear([]);
                                        setSelectedSpecial([]);
                                        setCurrentPage(1);
                                        loadItems(1, true);
                                    }}
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* Category Navigation */}
                    <motion.div variants={fadeInUp} className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant={selectedCategory === "" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedCategory("")}
                            >
                                All Items
                            </Button>
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
                                    variant={selectedFilter === filter ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => {
                                        setSelectedFilter(filter);
                                        // Apply filter logic
                                        if (filter === "Best Deals") {
                                            // Show items with price drops
                                            setSelectedSpecial(["Highlight"]);
                                        } else if (filter === "Sticker Combos") {
                                            // This would need more complex logic for sticker detection
                                            setSelectedSpecial([]);
                                        } else if (filter === "Unique Items") {
                                            // Show StatTrak and Souvenir items
                                            setSelectedSpecial(["StatTrak™", "Souvenir"]);
                                        } else {
                                            // All Items - clear special filters
                                            setSelectedSpecial([]);
                                        }
                                    }}
                                >
                                    {filter}
                                </Button>
                            ))}
                        </div>
                    </motion.div>


                    {/* Items Grid */}
                    <div>
                        {isLoading && items.length === 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                                {Array.from({ length: 12 }).map((_, index) => (
                                    <div key={index} className="animate-pulse">
                                        <div className="bg-muted/20 rounded-lg overflow-hidden">
                                            <div className="aspect-square bg-muted/40" />
                                            <div className="p-4 space-y-2">
                                                <div className="h-4 bg-muted/40 rounded w-3/4" />
                                                <div className="h-3 bg-muted/40 rounded w-1/2" />
                                                <div className="h-4 bg-muted/40 rounded w-1/3" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : error ? (
                            <div className="text-center py-12">
                                <p className="text-red-500 mb-4">Error: {error}</p>
                                <Button onClick={() => loadItems(1, true)} variant="outline">
                                    Try Again
                                </Button>
                            </div>
                        ) : items.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">No items found matching your criteria.</p>
                                <Button
                                    variant="outline"
                                    className="mt-4"
                                    onClick={() => {
                                        setSearchQuery("");
                                        setSelectedCategory("");
                                        setMinPrice(undefined);
                                        setMaxPrice(undefined);
                                        setSelectedWear([]);
                                        setSelectedSpecial([]);
                                    }}
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                                {items.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.3,
                                            delay: index * 0.05,
                                            ease: "easeOut"
                                        }}
                                        whileHover={{ y: -4 }}
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
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Pagination Controls - Outside motion.div */}
            {items.length > 0 && (
                <div className="flex items-center justify-center space-x-4 py-8">
                    {/* Debug pagination state */}
                    <div className="text-xs text-gray-500 mb-2">
                        Debug: items={items.length}, hasMore={hasMore.toString()}, totalCount={totalCount}
                    </div>
                    {hasMore ? (
                        <Button
                            onClick={loadMore}
                            disabled={isLoading}
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                <>
                                    Load More Items
                                    <ChevronRight className="w-4 h-4" />
                                </>
                            )}
                        </Button>
                    ) : (
                        <div className="text-center text-muted-foreground">
                            <p>You&apos;ve reached the end of the results</p>
                            <p className="text-sm">Showing all {totalCount} items</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
