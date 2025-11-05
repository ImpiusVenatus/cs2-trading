import type { Profile } from "./types";

/**
 * Check if user has filled out minimum required information for trading
 * Required: full_name, phone, address, division, district, postal_code
 * NOT required: profile_picture_url, nid_document_url
 */
export function hasMinimumInfo(profile: Profile | null): boolean {
    if (!profile) return false;

    return !!(
        profile.full_name &&
        profile.phone &&
        profile.address &&
        profile.division &&
        profile.district &&
        profile.postal_code
    );
}

/**
 * Get missing required fields for trading
 */
export function getMissingFields(profile: Profile | null): string[] {
    if (!profile) {
        return ["Full Name", "Phone Number", "Address", "Division", "District", "Postal Code"];
    }

    const missing: string[] = [];
    if (!profile.full_name) missing.push("Full Name");
    if (!profile.phone) missing.push("Phone Number");
    if (!profile.address) missing.push("Address");
    if (!profile.division) missing.push("Division");
    if (!profile.district) missing.push("District");
    if (!profile.postal_code) missing.push("Postal Code");

    return missing;
}

