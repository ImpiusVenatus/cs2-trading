"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ListingCard } from "@/components/market/listing-card";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import type { Listing, ListingCategory, ListingSubcategory, ListingWeaponType } from "@/lib/supabase/types";

// Extended type for listings with nested category/subcategory objects from API
type ListingWithRelations = Listing & {
    imageUrl?: string;
    category?: ListingCategory | null;
    subcategory?: ListingSubcategory | null;
    weapon_type?: ListingWeaponType | null;
};
import { toast } from "sonner";

export default function MarketPage() {
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [minPrice, setMinPrice] = useState<number | undefined>();
    const [maxPrice, setMaxPrice] = useState<number | undefined>();

    // Categories and subcategories
    const [categories, setCategories] = useState<ListingCategory[]>([]);
    const [subcategories, setSubcategories] = useState<ListingSubcategory[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    // Listings state
    const [allListings, setAllListings] = useState<ListingWithRelations[]>([]);
    const [filteredListings, setFilteredListings] = useState<ListingWithRelations[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch("/api/listings/categories");
                if (!response.ok) throw new Error("Failed to fetch categories");
                const { categories: data } = await response.json();
                setCategories(data || []);
            } catch (error) {
                console.error("Error fetching categories:", error);
                toast.error("Failed to load categories");
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    // Fetch subcategories when category changes
    useEffect(() => {
        const fetchSubcategories = async () => {
            if (!selectedCategoryId) {
                setSubcategories([]);
                return;
            }
            try {
                const response = await fetch(`/api/listings/subcategories?category_id=${selectedCategoryId}`);
                if (!response.ok) throw new Error("Failed to fetch subcategories");
                const { subcategories: data } = await response.json();
                setSubcategories(data || []);
            } catch (error) {
                console.error("Error fetching subcategories:", error);
                toast.error("Failed to load subcategories");
            }
        };
        fetchSubcategories();
    }, [selectedCategoryId]);

    // Fetch all listings once on mount
    useEffect(() => {
        const fetchAllListings = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // Fetch all active listings (we'll fetch in batches if needed, but for now let's get a reasonable amount)
                const response = await fetch(`/api/listings?status=active&limit=1000&offset=0`);
                if (!response.ok) throw new Error("Failed to fetch listings");

                const data = await response.json();
                const fetchedListings = data.listings || [];

                // Fetch image URLs for listings and transform to match ListingCard props
                const listingsWithImages = await Promise.all(
                    fetchedListings.map(async (listing: ListingWithRelations) => {
                        let imageUrl: string | undefined;
                        if (listing.image_urls && listing.image_urls.length > 0) {
                            try {
                                const imageResponse = await fetch("/api/listings/image-url", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ imageUrl: listing.image_urls[0] }),
                                });
                                if (imageResponse.ok) {
                                    const imageData = await imageResponse.json();
                                    imageUrl = imageData.url;
                                }
                            } catch (error) {
                                console.error(`Error fetching image for listing ${listing.id}:`, error);
                            }
                        }
                        // Transform category/subcategory to match ListingCard expected format
                        return {
                            ...listing,
                            imageUrl,
                            category: listing.category ? { name: listing.category.name, slug: listing.category.slug } : null,
                            subcategory: listing.subcategory ? { name: listing.subcategory.name, slug: listing.subcategory.slug } : null,
                            weapon_type: listing.weapon_type ? { name: listing.weapon_type.name, slug: listing.weapon_type.slug } : null,
                        };
                    })
                );

                setAllListings(listingsWithImages);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load listings');
                toast.error("Failed to load listings");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllListings();
    }, []);

    // Client-side filtering
    useEffect(() => {
        let filtered = [...allListings];

        // Filter by category
        if (selectedCategoryId) {
            filtered = filtered.filter(listing => listing.category_id === selectedCategoryId);
        }

        // Filter by subcategory
        if (selectedSubcategoryId) {
            filtered = filtered.filter(listing => listing.subcategory_id === selectedSubcategoryId);
        }

        // Filter by price range
        if (minPrice !== undefined) {
            filtered = filtered.filter(listing => listing.price >= minPrice);
        }
        if (maxPrice !== undefined) {
            filtered = filtered.filter(listing => listing.price <= maxPrice);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(listing =>
                listing.title.toLowerCase().includes(query) ||
                listing.description?.toLowerCase().includes(query) ||
                listing.category?.name.toLowerCase().includes(query) ||
                listing.subcategory?.name.toLowerCase().includes(query)
            );
        }

        setFilteredListings(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    }, [allListings, selectedCategoryId, selectedSubcategoryId, minPrice, maxPrice, searchQuery]);

    // Paginate filtered listings
    const paginatedListings = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredListings.slice(startIndex, endIndex);
    }, [filteredListings, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredListings.length / itemsPerPage);

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
                                disabled={isLoading}
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

                    {/* Results Count and Loading State */}
                    <div className="flex items-center justify-between">
                        {!isLoading && (
                            <div className="text-sm text-muted-foreground">
                                Showing {paginatedListings.length} of {filteredListings.length} listings
                                {filteredListings.length !== allListings.length && ` (${allListings.length} total)`}
                            </div>
                        )}
                        {isLoading && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Loading listings...</span>
                            </div>
                        )}
                    </div>

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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                            disabled={isLoading}
                                        />
                                        <Input
                                            type="number"
                                            placeholder="Max"
                                            value={maxPrice || ""}
                                            onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
                                            className="w-full"
                                            disabled={isLoading}
                                        />
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
                                        setSelectedCategoryId(null);
                                        setSelectedSubcategoryId(null);
                                        setCurrentPage(1);
                                        // Filters will reset automatically via useEffect
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
                                variant={selectedCategoryId === null ? "default" : "outline"}
                                size="sm"
                                onClick={() => {
                                    setSelectedCategoryId(null);
                                    setSelectedSubcategoryId(null);
                                }}
                                disabled={isLoading}
                            >
                                All Items
                            </Button>
                            {loadingCategories ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                categories.map((category) => (
                                    <Button
                                        key={category.id}
                                        variant={selectedCategoryId === category.id ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => {
                                            setSelectedCategoryId(category.id);
                                            setSelectedSubcategoryId(null);
                                        }}
                                        disabled={isLoading}
                                    >
                                        {category.name}
                                    </Button>
                                ))
                            )}
                        </div>
                    </motion.div>

                    {/* Subcategory Navigation */}
                    {selectedCategoryId && subcategories.length > 0 && (
                        <motion.div variants={fadeInUp} className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    variant={selectedSubcategoryId === null ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedSubcategoryId(null)}
                                    disabled={isLoading}
                                >
                                    All {categories.find(c => c.id === selectedCategoryId)?.name || "Items"}
                                </Button>
                                {subcategories.map((subcategory) => (
                                    <Button
                                        key={subcategory.id}
                                        variant={selectedSubcategoryId === subcategory.id ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setSelectedSubcategoryId(subcategory.id)}
                                        disabled={isLoading}
                                    >
                                        {subcategory.name}
                                    </Button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Listings Grid */}
                    <div>
                        {isLoading ? (
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
                                <Button onClick={() => window.location.reload()} variant="outline">
                                    Try Again
                                </Button>
                            </div>
                        ) : filteredListings.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">No listings found matching your criteria.</p>
                                <Button
                                    variant="outline"
                                    className="mt-4"
                                    onClick={() => {
                                        setSearchQuery("");
                                        setSelectedCategoryId(null);
                                        setSelectedSubcategoryId(null);
                                        setMinPrice(undefined);
                                        setMaxPrice(undefined);
                                    }}
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                                {paginatedListings.map((listing, index) => (
                                    <motion.div
                                        key={listing.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.3,
                                            delay: index * 0.05,
                                            ease: "easeOut"
                                        }}
                                    >
                                        <ListingCard listing={listing} imageUrl={listing.imageUrl} />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Pagination Controls */}
            {!isLoading && filteredListings.length > 0 && (
                <div className="flex items-center justify-center space-x-4 py-8">
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            variant="outline"
                        >
                            Previous
                        </Button>
                        <span className="text-sm text-muted-foreground">
                            Page {currentPage} of {totalPages || 1}
                        </span>
                        <Button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage >= totalPages}
                            variant="outline"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
