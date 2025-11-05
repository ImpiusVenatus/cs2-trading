"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function SignUpPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [accountType, setAccountType] = useState<"buyer" | "seller" | null>(null);

    const handleGoogleSignUp = async (type: "buyer" | "seller") => {
        if (!accountType && type) {
            setAccountType(type);
        }

        try {
            setIsLoading(true);
            const supabase = createClient();

            // Store account type in sessionStorage to use in callback
            sessionStorage.setItem("signup_account_type", type);

            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback?redirect=/profile&account_type=${type}`,
                },
            });

            if (error) {
                toast.error("Failed to sign up", {
                    description: error.message,
                });
                setIsLoading(false);
                setAccountType(null);
            }
        } catch (error) {
            console.error("Sign up error:", error);
            toast.error("An unexpected error occurred");
            setIsLoading(false);
            setAccountType(null);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
            <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="w-full max-w-md"
            >
                <motion.div variants={fadeInUp}>
                    <Card className="border-border/50 shadow-lg">
                        <CardHeader className="space-y-1 text-center">
                            <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
                            <CardDescription>
                                Sign up to start trading CS2 items in Bangladesh
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Sign up as Buyer */}
                            <Button
                                onClick={() => handleGoogleSignUp("buyer")}
                                disabled={isLoading}
                                variant="outline"
                                className="w-full h-auto py-4 flex flex-col items-center gap-2"
                            >
                                {isLoading && accountType === "buyer" ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-gray-900 dark:border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Signing up...</span>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-3">
                                            <ShoppingBag className="w-5 h-5" />
                                            <span className="font-medium">Sign up as Buyer</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground font-normal">
                                            Browse and purchase CS2 skins from verified sellers
                                        </p>
                                    </>
                                )}
                            </Button>

                            {/* Sign up as Seller */}
                            <Button
                                onClick={() => handleGoogleSignUp("seller")}
                                disabled={isLoading}
                                variant="default"
                                className="w-full h-auto py-4 flex flex-col items-center gap-2"
                            >
                                {isLoading && accountType === "seller" ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Signing up...</span>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-3">
                                            <Store className="w-5 h-5" />
                                            <span className="font-medium">Sign up as Seller</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground font-normal">
                                            List and sell your CS2 skins (verification required)
                                        </p>
                                    </>
                                )}
                            </Button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-border" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-card px-2 text-muted-foreground">
                                        Already have an account?
                                    </span>
                                </div>
                            </div>

                            <div className="text-center text-sm">
                                <span className="text-muted-foreground">
                                    Already registered?{" "}
                                </span>
                                <Link
                                    href="/auth/signin"
                                    className="text-primary hover:underline font-medium"
                                >
                                    Sign in
                                </Link>
                            </div>

                            <p className="text-xs text-center text-muted-foreground pt-2">
                                By signing up, you agree to our Terms of Service and Privacy Policy
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </div>
    );
}
