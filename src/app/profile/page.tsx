"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Package, History, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeInUp } from "@/lib/animations";
import { ProfileTab } from "@/components/profile/profile-tab";
import { ListingsTab } from "@/components/profile/listings-tab";
import { HistoryTab } from "@/components/profile/history-tab";
import { SettingsTab } from "@/components/profile/settings-tab";

type TabType = "profile" | "listings" | "history" | "settings";

const tabs = [
    { id: "profile" as TabType, label: "Profile", icon: User },
    { id: "listings" as TabType, label: "Listings", icon: Package },
    { id: "history" as TabType, label: "History", icon: History },
    { id: "settings" as TabType, label: "Settings", icon: Settings },
];

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState<TabType>("profile");

    const renderTabContent = () => {
        switch (activeTab) {
            case "profile":
                return <ProfileTab />;
            case "listings":
                return <ListingsTab />;
            case "history":
                return <HistoryTab />;
            case "settings":
                return <SettingsTab />;
            default:
                return <ProfileTab />;
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] px-4 py-8">
            <div className="container mx-auto max-w-6xl">
                <motion.div
                    initial="initial"
                    animate="animate"
                    className="space-y-6"
                >
                    {/* Header */}
                    <motion.div variants={fadeInUp}>
                        <h1 className="text-3xl font-bold">Profile Dashboard</h1>
                        <p className="text-muted-foreground mt-2">
                            Manage your profile, listings, and account settings
                        </p>
                    </motion.div>

                    {/* Tabs */}
                    <motion.div variants={fadeInUp}>
                        <div className="flex bg-muted rounded-lg p-1 gap-1 overflow-x-auto">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <Button
                                        key={tab.id}
                                        variant={activeTab === tab.id ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => setActiveTab(tab.id)}
                                        className="flex items-center gap-2 px-4"
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span>{tab.label}</span>
                                    </Button>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Tab Content */}
                    <div className="mt-6">
                        {renderTabContent()}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
