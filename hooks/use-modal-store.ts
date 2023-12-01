// Importing the create function from Zustand for creating a store
import { Channel, ChannelType, Server } from "@prisma/client";
import { create } from "zustand";

// Defining possible types for modals
export type ModalType = "createServer" | "invite" | "editServer" | "members" | "createChannel" | "leaveServer" | "deleteServer" | "deleteChannel";

interface ModalData {
    server?: Server;
    channel?: Channel;
    channelType?: ChannelType;
}

// Interface representing the state of the modal store
interface ModalStore {
    type: ModalType | null;  // Type of the currently open modal or null if no modal is open
    data: ModalData;
    isOpen: boolean;         // Whether the modal is open or closed
    onOpen: (type: ModalType, data?: ModalData) => void;  // Function to open a modal of a specific type
    onClose: () => void;      // Function to close the currently open modal
}

// Creating the modal store using Zustand
export const useModal = create<ModalStore>((set) => ({
    type: null,               // Initially, no modal is open
    data: {},
    isOpen: false,            // Initially, the modal is closed
    onOpen: (type, data = {}) => set({ isOpen: true, type, data }),  // Opens the modal of a specific type
    onClose: () => set({ type: null, isOpen: false })  // Closes the currently open modal
}));