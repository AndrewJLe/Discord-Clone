"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation"
import { cn } from "@/lib/utils";
import { ActionTooltip } from "@/components/action-tooptip";

interface NavigationItemProps {
    id: string;
    imageUrl: string
    name: string
};

export const NavigationItem = ({
    id,
    imageUrl,
    name
}: NavigationItemProps) => {
    const params = useParams();
    const router = useRouter();

    const onClick = () => {
        router.push(`/servers/${id}`); // Navigates to the server's page when the button is clicked.
    }

    return (
        <ActionTooltip
            label={name}
            side="right"
            align="center"
        >
            <button
                onClick={onClick}
                className="group relative flex items-center"
            >
                <div className={cn(
                    "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
                    params?.serverId !== id && "group-hover:h-[15px]", // if hovering a server that's not rendered on the page, expand highlight (white line)
                    params?.serverId === id ? "h-[36px]" : "h-[8px]" //  selected server highlight height, unselected server highlight height
                )} />

                <div className={cn(
                    "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden", // server images will be circular by default
                    params?.serverId === id && "bg-primary/10 text-primary rounded-[16px]" // selected server's image will be squared
                )}>
                    <Image
                        fill
                        src={imageUrl} // Server image
                        alt="Channel"
                    />
                </div>
            </button>
        </ActionTooltip>
    )
}