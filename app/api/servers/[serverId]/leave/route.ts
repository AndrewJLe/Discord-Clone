import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { serverId: string } }
) {
    try {
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!params.serverId) {
            return new NextResponse("Server Id missing", { status: 400 });
        }

        // Update server to remove user that is leaving
        const server = await db.server.update({
            where: {
                id: params.serverId,
                // Admin should not be able to leave the server
                profileId: {
                    not: profile.id
                },
                // Only members should be able to leave the server
                members: {
                    some: {
                        profileId: profile.id
                    }
                }
            },
            // Delete member
            data: {
                members: {
                    deleteMany: {
                        profileId: profile.id
                    }
                }
            }
        });

        return NextResponse.json(server);
    }
    catch (error) {
        console.log("[SERVER__ID_LEAVE]", error);
        return new NextResponse("Internal Error", { status: 500 });

    }
}
