"use client";

import { motion } from "framer-motion";
import { Scale, AlertTriangle, CheckCircle, FileText, Gavel, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const sections = [
    {
        icon: FileText,
        title: "Acceptance of Terms",
        content: [
            "By accessing and using CS2BD, you accept and agree to be bound by these Terms of Service",
            "If you do not agree to these terms, you must not use our platform",
            "We reserve the right to modify these terms at any time, and your continued use constitutes acceptance",
            "You must be at least 18 years old to use our services",
        ],
    },
    {
        icon: Shield,
        title: "Account Registration",
        content: [
            "You must provide accurate, current, and complete information during registration",
            "You are responsible for maintaining the confidentiality of your account credentials",
            "You must notify us immediately of any unauthorized access to your account",
            "Sellers must verify their identity with a valid National ID (NID) to list items",
            "We reserve the right to suspend or terminate accounts that violate these terms",
        ],
    },
    {
        icon: Gavel,
        title: "Trading Rules and Responsibilities",
        content: [
            "All trades are facilitated through our middleman service for security",
            "Sellers must accurately describe items and provide authentic products",
            "Buyers must complete payment before items are released",
            "We act as an intermediary and are not responsible for the quality of items traded",
            "All transactions are final once completed and verified",
            "Refunds are only available in cases of fraud or platform error",
        ],
    },
    {
        icon: AlertTriangle,
        title: "Prohibited Activities",
        content: [
            "Fraud, scams, or deceptive practices are strictly prohibited",
            "Selling stolen, hacked, or illegally obtained items is forbidden",
            "Creating multiple accounts to circumvent restrictions is not allowed",
            "Manipulating prices or engaging in market manipulation is prohibited",
            "Using automated tools or bots without authorization is forbidden",
            "Harassing, threatening, or abusing other users is not tolerated",
        ],
    },
    {
        icon: CheckCircle,
        title: "Fees and Payments",
        content: [
            "Transaction fees range from 0.5% to 3.5% depending on trade value",
            "All fees are clearly displayed before completing a transaction",
            "Payment methods include bank transfers, mobile banking, and other approved methods",
            "Withdrawal fees may apply depending on the payment method",
            "We reserve the right to adjust fees with 30 days notice",
        ],
    },
    {
        icon: Shield,
        title: "Middleman Service",
        content: [
            "We provide middleman services to facilitate secure trades",
            "Funds are held in escrow until trade verification is complete",
            "Items must be verified before funds are released to sellers",
            "We are not liable for disputes between buyers and sellers beyond our verification process",
            "Our role is limited to facilitating transactions, not guaranteeing item authenticity",
        ],
    },
    {
        icon: FileText,
        title: "Intellectual Property",
        content: [
            "All content on CS2BD, including logos, designs, and text, is our property",
            "You may not copy, modify, or distribute our content without permission",
            "CS2 skins and related content are property of Valve Corporation",
            "We are not affiliated with Valve Corporation",
            "User-generated content remains your property, but you grant us license to use it on our platform",
        ],
    },
    {
        icon: AlertTriangle,
        title: "Limitation of Liability",
        content: [
            "CS2BD is provided &quot;as is&quot; without warranties of any kind",
            "We are not liable for losses resulting from trades, disputes, or platform use",
            "We do not guarantee the availability, accuracy, or completeness of our services",
            "Our liability is limited to the fees collected for a specific transaction",
            "We are not responsible for third-party services or external factors",
        ],
    },
    {
        icon: Gavel,
        title: "Dispute Resolution",
        content: [
            "Disputes should first be reported through our support system",
            "We will investigate disputes and make decisions based on available evidence",
            "Our decisions are final and binding for platform-related matters",
            "For legal disputes, jurisdiction lies with the courts of Bangladesh",
            "Users agree to resolve disputes through our internal process before legal action",
        ],
    },
    {
        icon: FileText,
        title: "Termination",
        content: [
            "We may suspend or terminate accounts that violate these terms",
            "Users may close their accounts at any time through account settings",
            "Upon termination, access to the platform will be immediately revoked",
            "Outstanding transactions will be processed according to our policies",
            "We reserve the right to refuse service to anyone at our discretion",
        ],
    },
];

export default function TermsOfServicePage() {
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
                            <Scale className="w-8 h-8 text-primary" />
                            <h1 className="text-5xl font-bold">Terms of Service</h1>
                        </div>
                        <p className="text-xl text-muted-foreground">
                            Last updated: January 2025
                        </p>
                        <p className="text-muted-foreground">
                            Please read these Terms of Service carefully before using CS2BD. These terms govern your access 
                            to and use of our trading platform and services.
                        </p>
                    </motion.div>

                    {/* Introduction */}
                    <motion.div variants={fadeInUp} className="space-y-4">
                        <h2 className="text-2xl font-bold">Introduction</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Welcome to CS2BD. These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement 
                            between you and CS2BD regarding your use of our platform, which facilitates trading of CS2 skins, 
                            premium subscriptions, and Steam referral codes in Bangladesh. By accessing or using our services, 
                            you agree to be bound by these Terms.
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
                                    If you have any questions about these Terms of Service, please contact us:
                                </p>
                                <div className="space-y-2 text-muted-foreground">
                                    <p><strong className="text-foreground">Email:</strong> legal@cs2bd.com</p>
                                    <p><strong className="text-foreground">Address:</strong> CS2BD, Bangladesh</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Changes to Terms */}
                    <motion.div variants={fadeInUp} className="space-y-4">
                        <h2 className="text-2xl font-bold">Changes to Terms</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We reserve the right to modify or replace these Terms at any time. If a revision is material, 
                            we will provide at least 30 days notice prior to any new terms taking effect. What constitutes 
                            a material change will be determined at our sole discretion. Your continued use of the platform 
                            after any changes constitutes acceptance of the new Terms.
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}

