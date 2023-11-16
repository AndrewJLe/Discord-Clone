import { useState, useEffect } from "react";

// The purpose of this hook is to retrieve and provide the origin (protocol, host, and port -> https://example.com:8080) of the current window's location.

export const useOrigin = () => {
    // State variable to track whether the component is mounted
    const [mounted, setMounted] = useState(false);

    // Effect to set the `mounted` state to `true` when the component is mounted
    useEffect(() => {
        setMounted(true);
    }, []);

    // Retrieve the origin based on whether the code is running in a browser environment
    const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : "";

    // If the component is not yet mounted, return an empty string
    if (!mounted) {
        return "";
    }

    // Return the calculated origin
    return origin;
};