"use client";

import qs from "query-string";
import axios from "axios";
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"


export const DeleteChannelModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const [isLoading, setIsLoading] = useState(false);
    const { channel, server } = data;
    const isModalOpen = isOpen && type == "deleteChannel";
    const router = useRouter();

    const onClick = async () => {
        try {
            setIsLoading(true);
            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query: {
                    serverId: server?.id
                }
            })
            await axios.delete(url);
            onClose();
            router.refresh();
            router.push(`/servers/${server?.id}`);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Delete '{channel?.name}'?
                    </DialogTitle>
                    <DialogDescription

                        className="text-center"
                    >
                        Are you sure you want to delete this channel?
                        <br />
                        <span className="font-semibold text-indigo-500">#{channel?.name.replace(/'/g, "&apos;")}</span> will be permanently deleted!
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter
                    className="bg-gray-100 px-6 py-4"
                >
                    <div
                        className="flex items-center justify-between w-full"
                    >
                        <Button
                            disabled={isLoading}
                            onClick={onClose}
                            className="hover:underline"
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={isLoading}
                            onClick={onClick}
                            className="bg-rose-500 text-white hover:bg-rose-800 font-semibold uppercase"
                        >
                            Delete Channel
                        </Button>
                    </div>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    )
}