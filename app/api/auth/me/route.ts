import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export const GET = async (request: NextRequest) => {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: "You are not authenticated" },
                { status: 401 }
            );
        }

        return NextResponse.json(user);

    } catch (error) {
        console.error("error:", error);

        return NextResponse.json(
            { error: "Internal server error, Something went wrong" },
            { status: 500 }
        );
    }
};
