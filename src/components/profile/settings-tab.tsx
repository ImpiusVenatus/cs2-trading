"use client";

import { motion } from "framer-motion";
import { Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fadeInUp } from "@/lib/animations";

export function SettingsTab() {
    return (
        <motion.div
            initial="initial"
            animate="animate"
            className="space-y-6"
        >
            <motion.div variants={fadeInUp}>
                <h2 className="text-2xl font-bold">Settings</h2>
                <p className="text-muted-foreground mt-1">
                    Manage your account settings and preferences
                </p>
            </motion.div>

            <motion.div variants={fadeInUp}>
                <Card className="border-border/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="w-5 h-5" />
                            Account Settings
                        </CardTitle>
                        <CardDescription>
                            Update your account preferences and security settings
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Settings content coming soon...</p>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}

