"use client";

import { motion } from "framer-motion";
import { staggerContainer } from "@/lib/animations";
import { ProfilePictureSection } from "./profile-picture-section";
import { VerificationDocumentsSection } from "./verification-documents-section";
import { PersonalInformationForm } from "./personal-information-form";

export function ProfileTab() {
    return (
        <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-6"
        >
            <ProfilePictureSection />
            <VerificationDocumentsSection />
            <PersonalInformationForm />
        </motion.div>
    );
}
