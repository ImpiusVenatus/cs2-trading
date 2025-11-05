"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fadeInUp } from "@/lib/animations";
import { CreateListingModal } from "./create-listing-modal";

export function ListingsTab() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <motion.div
                initial="initial"
                animate="animate"
                className="space-y-6"
            >
                <motion.div variants={fadeInUp} className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">My Listings</h2>
                        <p className="text-muted-foreground mt-1">
                            Manage your active listings and create new ones
                        </p>
                    </div>
                    <Button onClick={() => setIsModalOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Listing
                    </Button>
                </motion.div>

                <motion.div variants={fadeInUp}>
                    <Card className="border-border/50">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Package className="w-16 h-16 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No listings yet</h3>
                            <p className="text-muted-foreground text-center mb-4">
                                Start selling by creating your first listing
                            </p>
                            <Button onClick={() => setIsModalOpen(true)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Create Your First Listing
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>

            <CreateListingModal open={isModalOpen} onOpenChange={setIsModalOpen} />
        </>
    );
}

