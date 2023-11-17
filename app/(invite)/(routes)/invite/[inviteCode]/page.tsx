import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { userInfo } from "os";

interface InviteCodePageProps {
    params: {
        inviteCode: string;
    };
};

const InviteCodePage = async ({
    params
}: InviteCodePageProps) => {
    const profile = await currentProfile();

    if (!profile) {
        return redirectToSignIn();
    }

    if (!params.inviteCode) {
        return redirect("/");
    }

    // Check if user is already a member of the server
    const existingServer = await db.server.findFirst({
        where: {
            inviteCode: params.inviteCode,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    // If user is already a member, redirect the user to the server page
    if (existingServer) {
        return redirect(`/servers/${existingServer.id}`);
    }

    // If user is not a member of the server, add them and redirect
    const server = await db.server.update({
        where: {
            inviteCode: params.inviteCode
        },
        data: {
            members: {
                create: {
                    profileId: profile.id,
                }
            }
        }
    });

    if (server) {
        return redirect(`/servers/${server.id}`);
    }

    return null;
}

export default InviteCodePage