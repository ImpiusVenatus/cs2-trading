"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { File } from "@/lib/supabase/types";

/**
 * Hook to get signed URL for a file, refreshing if expired
 */
export function useFileUrl(fileId: string | null | undefined) {
    const [url, setUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!fileId) {
            setUrl(null);
            setLoading(false);
            return;
        }

        const fetchSignedUrl = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch("/api/files/signed-url", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ fileId }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Failed to get file URL");
                }

                const data = await response.json();
                setUrl(data.url);
            } catch (err) {
                console.error("Error fetching signed URL:", err);
                setError(err instanceof Error ? err.message : "Failed to load file");
            } finally {
                setLoading(false);
            }
        };

        fetchSignedUrl();
    }, [fileId]);

    return { url, loading, error };
}

/**
 * Hook to get file record by file type
 */
export function useFileByType(fileType: "profile_picture" | "nid_document") {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFile = async () => {
            try {
                setLoading(true);
                setError(null);

                const supabase = createClient();
                const {
                    data: { user },
                } = await supabase.auth.getUser();

                if (!user) {
                    setLoading(false);
                    return;
                }

                const { data, error: fetchError } = await supabase
                    .from("files")
                    .select("*")
                    .eq("user_id", user.id)
                    .eq("file_type", fileType)
                    .single();

                if (fetchError) {
                    if (fetchError.code === "PGRST116") {
                        // No file found
                        setFile(null);
                    } else {
                        throw fetchError;
                    }
                } else {
                    setFile(data);
                }
            } catch (err) {
                console.error("Error fetching file:", err);
                setError(err instanceof Error ? err.message : "Failed to load file");
            } finally {
                setLoading(false);
            }
        };

        fetchFile();
    }, [fileType]);

    return { file, loading, error };
}

