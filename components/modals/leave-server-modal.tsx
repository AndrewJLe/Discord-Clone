"use client";

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


export const LeaveServerModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const [isLoading, setIsLoading] = useState(false);
    const { server } = data;
    const isModalOpen = isOpen && type == "leaveServer";
    const router = useRouter();

    const onClick = async () => {
        try {
            setIsLoading(true);
            await axios.patch(`/api/servers/${server?.id}/leave`)
            onClose();
            router.refresh();
            router.push("/");
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
                        Leave '{server?.name}'?
                    </DialogTitle>
                    <DialogDescription

                        className="text-center"
                    >
                        Are you sure you want to leave <span className="font-semibold text-indigo-500">{server?.name}</span>? You won't be able to rejoin this server unless you are re-invited.
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
                            className="bg-rose-500 text-white hover:bg-rose-800"
                        >
                            Leave Server
                        </Button>

                    </div>

                </DialogFooter>

            </DialogContent>
        </Dialog>
    )
}