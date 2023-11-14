"use client"
import { CreateServerModal } from "@/components/modals/create-server-modal"
import { useState, useEffect } from "react";

export const ModalProvider = () => {
    // mount check to prevent models from being rendered serverside
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, [])

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <CreateServerModal />
        </>
    )
}