import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { ChannelType, MemberRole } from "@prisma/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { redirect } from "next/navigation";
import { ServerHeader } from "./server-header";
import { ServerSearch } from "./server-search";
import { ServerSection } from "./server-section";
import { ServerChannel } from "./server-channel";
import { ServerMember } from "./server-member";
import {
    Hash,
    LucideCrown,
    LucideUser2,
    Mic,
    ShieldCheck,
    Video
} from "lucide-react";

const channelIconMap = {
    [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
    [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
    [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />
};

const roleIconMap = {
    [MemberRole.GUEST]: <LucideUser2 className="mr-2 h-4 w-4" />,
    [MemberRole.MODERATOR]: <ShieldCheck className="mr-2 h-4 w-4" color="lime" strokeWidth={2} />,
    [MemberRole.ADMIN]: <LucideCrown className="mr-2 h-4 w-4" color="gold" fill="gold" strokeWidth={2} />
}

interface ServerSidebarProps {
    serverId: string;
}

export const ServerSidebar = async ({
    serverId
}: ServerSidebarProps) => {

    const profile = await currentProfile();

    if (!profile) {
        return redirect("/");
    }

    const server = await db.server.findUnique({
        where: {
            id: serverId,
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: "asc", // ascending order
                },
            },
            members: {
                include: {
                    profile: true,
                },
                orderBy: {
                    role: "asc",
                }
            }
        }
    });

    const textChannels = server?.channels.filter((channel) => channel.type === ChannelType.TEXT)
    const audioChannels = server?.channels.filter((channel) => channel.type === ChannelType.AUDIO)
    const videoChannels = server?.channels.filter((channel) => channel.type === ChannelType.VIDEO)
    const members = server?.members

    if (!server) {
        return redirect("/");
    }

    const role = server.members.find((member) => member.profileId === profile.id)?.role; // find the user's role in the server's list of members

    return (
        <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
            <ServerHeader
                server={server}
                role={role}
            />

            <ScrollArea className="flex-1 px-3">
                <div className="mt-2">
                    <ServerSearch
                        data={[
                            {
                                label: "Text Channels",
                                type: "channel",
                                data: textChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: channelIconMap[channel.type]
                                }))
                            },
                            {
                                label: "Voice Channels",
                                type: "channel",
                                data: audioChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: channelIconMap[channel.type]
                                }))
                            },
                            {
                                label: "Video Channels",
                                type: "channel",
                                data: videoChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: channelIconMap[channel.type]
                                }))
                            },
                            {
                                label: "Members",
                                type: "member",
                                data: members?.map((member) => ({
                                    id: member.id,
                                    name: member.profile.name,
                                    icon: roleIconMap[member.role]
                                }))
                            }
                        ]}
                    />
                </div>
                <Separator className="bg-zinc-200 dark:bg-zinc-600 rounded-md my-2 " />
                {/* Render if TEXT CHANNELS */}
                {!!textChannels?.length && (
                    <div className="mb-2">
                        <ServerSection
                            label="Text Channels"
                            role={role}
                            sectionType="channels"
                            channelType={ChannelType.TEXT}
                        />
                        {textChannels.map((channel) => (
                            <ServerChannel
                                key={channel.id}
                                channel={channel}
                                server={server}
                                role={role}
                            />
                        ))}
                    </div>
                )}
                {/* Render if AUDIO CHANNELS */}
                {!!audioChannels?.length && (
                    <div className="mb-2">
                        <ServerSection
                            label="Audio Channels"
                            role={role}
                            sectionType="channels"
                            channelType={ChannelType.AUDIO}
                        />
                        {audioChannels.map((channel) => (
                            <ServerChannel
                                key={channel.id}
                                channel={channel}
                                server={server}
                                role={role}
                            />
                        ))}
                    </div>
                )}
                {/* Render if VIDEO CHANNELS */}
                {!!videoChannels?.length && (
                    <div className="mb-2">
                        <ServerSection
                            label="Video Channels"
                            role={role}
                            sectionType="channels"
                            channelType={ChannelType.VIDEO}
                        />
                        {videoChannels.map((channel) => (
                            <ServerChannel
                                key={channel.id}
                                channel={channel}
                                server={server}
                                role={role}
                            />
                        ))}
                    </div>
                )}
                {/* Render MEMBERS */}
                {!!members?.length && (
                    <div className="mb-2">
                        <ServerSection
                            label="Members"
                            role={role}
                            sectionType="members"
                            server={server}
                        />
                        {members.map((member) => (
                            <ServerMember
                                key={member.id}
                                member={member}
                                server={server}
                            />
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
    )
}