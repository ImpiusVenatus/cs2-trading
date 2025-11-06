"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const sections = [
    {
        icon: FileText,
        title: "Information We Collect",
        content: [
            "Personal Information: When you create an account, we collect your name, email address, phone number, and National ID (NID) for seller verification.",
            "Trading Information: We collect information about your trades, listings, transactions, and payment details.",
            "Technical Information: We automatically collect device information, IP address, browser type, and usage data to improve our services.",
            "Steam Account Information: When you connect your Steam account, we collect your Steam ID and public profile information to facilitate trades.",
        ],
    },
    {
        icon: Lock,
        title: "How We Use Your Information",
        content: [
            "To provide and maintain our trading platform services",
            "To verify seller identities and prevent fraud",
            "To process transactions and facilitate trades",
            "To communicate with you about your account and transactions",
            "To improve our services and develop new features",
            "To comply with legal obligations and protect our rights",
        ],
    },
    {
        icon: Shield,
        title: "Data Security",
        content: [
            "We implement industry-standard security measures to protect your personal information",
            "All sensitive data is encrypted in transit and at rest",
            "We use secure payment processors for financial transactions",
            "Access to personal information is restricted to authorized personnel only",
            "We regularly audit our security practices and update our systems",
        ],
    },
    {
        icon: Eye,
        title: "Data Sharing and Disclosure",
        content: [
            "We do not sell your personal information to third parties",
            "We may share information with service providers who assist in operating our platform",
            "We may disclose information if required by law or to protect our rights",
            "Transaction information may be shared with payment processors and financial institutions",
            "Aggregated, anonymized data may be used for analytics and business purposes",
        ],
    },
    {
        icon: FileText,
        title: "Your Rights",
        content: [
            "Access: You can request access to your personal information",
            "Correction: You can update or correct your account information at any time",
            "Deletion: You can request deletion of your account and personal data",
            "Data Portability: You can request a copy of your data in a portable format",
            "Opt-out: You can opt-out of marketing communications",
        ],
    },
    {
        icon: Lock,
        title: "Cookies and Tracking",
        content: [
            "We use cookies and similar technologies to enhance your experience",
            "Cookies help us remember your preferences and improve site functionality",
            "You can control cookie settings through your browser preferences",
            "Some features may not work properly if cookies are disabled",
        ],
    },
];

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-20">
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="space-y-12 max-w-4xl mx-auto"
                >
                    {/* Header */}
                    <motion.div variants={fadeInUp} className="text-center space-y-4">
                        <div className="flex items-center justify-center space-x-3 mb-4">
                            <Shield className="w-8 h-8 text-primary" />
                            <h1 className="text-5xl font-bold">Privacy Policy</h1>
                        </div>
                        <p className="text-xl text-muted-foreground">
                            Last updated: January 2025
                        </p>
                        <p className="text-muted-foreground">
                            At CS2BD, we are committed to protecting your privacy and ensuring the security of your personal information. 
                            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
                        </p>
                    </motion.div>

                    {/* Introduction */}
                    <motion.div variants={fadeInUp} className="space-y-4">
                        <h2 className="text-2xl font-bold">Introduction</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            CS2BD (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates a trading platform for CS2 skins, 
                            premium subscriptions, and Steam referral codes in Bangladesh. This Privacy Policy applies to all users 
                            of our website, mobile app, and services. By using our platform, you agree to the collection and use 
                            of information in accordance with this policy.
                        </p>
                    </motion.div>

                    {/* Sections */}
                    <div className="space-y-8">
                        {sections.map((section, index) => (
                            <motion.div key={section.title} variants={fadeInUp} custom={index}>
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-primary/10 rounded-lg">
                                                <section.icon className="w-6 h-6 text-primary" />
                                            </div>
                                            <CardTitle className="text-xl">{section.title}</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-3">
                                            {section.content.map((item, i) => (
                                                <li key={i} className="flex items-start space-x-3">
                                                    <span className="text-primary mt-1">•</span>
                                                    <span className="text-muted-foreground">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Contact Information */}
                    <motion.div variants={fadeInUp} className="space-y-4">
                        <h2 className="text-2xl font-bold">Contact Us</h2>
                        <Card>
                            <CardContent className="pt-6">
                                <p className="text-muted-foreground mb-4">
                                    If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us:
                                </p>
                                <div className="space-y-2 text-muted-foreground">
                                    <p><strong className="text-foreground">Email:</strong> privacy@cs2bd.com</p>
                                    <p><strong className="text-foreground">Address:</strong> CS2BD, Bangladesh</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Changes to Policy */}
                    <motion.div variants={fadeInUp} className="space-y-4">
                        <h2 className="text-2xl font-bold">Changes to This Privacy Policy</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We may update our Privacy Policy from time to time. We will notify you of any changes by posting 
                            the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. You are advised 
                            to review this Privacy Policy periodically for any changes.
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}

