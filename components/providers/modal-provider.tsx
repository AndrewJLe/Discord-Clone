"use client"

import { useState, useEffect } from "react";
import { CreateServerModal } from "@/components/modals/create-server-modal"
import { InviteModal } from "@/components/modals/invite-modal";
import { EditServerModal } from "@/components/modals/edit-server-modal";
import { MembersModal } from "@/components/modals/members-modal";

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
            <EditServerModal />
            <InviteModal />
            <MembersModal />
        </>
    )
}