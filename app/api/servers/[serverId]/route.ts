import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// Define the DELETE route handler function
export async function DELETE(
    req: Request,
    { params }: { params: { serverId: string } }
) {
    try {
        // Retrieve the current user's profile
        const profile = await currentProfile();

        // Check if the user is authorized (authenticated)
        if (!profile) {
            // If not authorized, return a 401 Unauthorized response
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Delete the server data from the database and make sure the user is an Admin
        const server = await db.server.delete({
            where: {
                id: params.serverId,
                profileId: profile.id
            }
        });

        // Return a JSON response containing the updated server data
        return NextResponse.json(server);

    } catch (error) {
        // Handle errors that occur during the execution of the route handler
        console.log("[SERVER_ID_DELETE]", error);

        // Return a 500 Internal Server Error response in case of an error
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// Define the PATCH route handler function
export async function PATCH(
    req: Request,
    { params }: { params: { serverId: string } }
) {
    try {
        // Retrieve the current user's profile
        const profile = await currentProfile();

        // Destructure the 'name' and 'imageUrl' from the JSON request body
        const { name, imageUrl } = await req.json();

        // Check if the user is authorized (authenticated)
        if (!profile) {
            // If not authorized, return a 401 Unauthorized response
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Update the server data in the database
        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: profile.id
            },
            data: {
                name,
                imageUrl
            }
        });

        // Return a JSON response containing the updated server data
        return NextResponse.json(server);

    } catch (error) {
        // Handle errors that occur during the execution of the route handler
        console.log("[SERVER_ID_PATCH]", error);

        // Return a 500 Internal Server Error response in case of an error
        return new NextResponse("Internal Error", { status: 500 });
    }
}