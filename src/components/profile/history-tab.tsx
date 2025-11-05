"use client";

import { motion } from "framer-motion";
import { History } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { fadeInUp } from "@/lib/animations";

export function HistoryTab() {
    return (
        <motion.div
            initial="initial"
            animate="animate"
            className="space-y-6"
        >
            <motion.div variants={fadeInUp}>
                <h2 className="text-2xl font-bold">Transaction History</h2>
                <p className="text-muted-foreground mt-1">
                    View all your past transactions and trades
                </p>
            </motion.div>

            <motion.div variants={fadeInUp}>
                <Card className="border-border/50">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <History className="w-16 h-16 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No transactions yet</h3>
                        <p className="text-muted-foreground text-center">
                            Your transaction history will appear here
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}

