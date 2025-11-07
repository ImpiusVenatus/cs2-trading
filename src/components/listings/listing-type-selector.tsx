"use client";

import { useState, useEffect } from "react";
import { Package, CreditCard, Gift } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ListingType {
    id: string;
    name: string;
    slug: string;
    description: string | null;
}

interface ListingTypeSelectorProps {
    onSelectType: (typeId: string, slug: string) => void;
}

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    "cs2-skins": Package,
    "skins": Package, // Fallback for old slug
    "subscriptions": CreditCard,
    "referral-codes": Gift,
};

export function ListingTypeSelector({ onSelectType }: ListingTypeSelectorProps) {
    const [types, setTypes] = useState<ListingType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const response = await fetch("/api/listings/types");
                if (!response.ok) throw new Error("Failed to fetch types");
                const { types: typesData } = await response.json();
                setTypes(typesData || []);
            } catch (error) {
                console.error("Error fetching listing types:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTypes();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Select Listing Type</h3>
                <p className="text-sm text-muted-foreground">
                    Choose the type of listing you want to create
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {types.map((type) => {
                    const Icon = typeIcons[type.slug] || Package;
                    return (
                        <button
                            key={type.id}
                            onClick={() => onSelectType(type.id, type.slug)}
                            className="text-left"
                        >
                            <Card className="p-6 hover:border-primary transition-colors h-full">
                                <div className="flex flex-col items-center text-center space-y-3">
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">{type.name}</h4>
                                        {type.description && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {type.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

