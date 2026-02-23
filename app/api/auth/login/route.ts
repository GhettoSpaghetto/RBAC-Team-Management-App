export const dynamic = "force-dynamic";


import { generateToken, hashPassword, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const {email, password} = await request.json();

        // Validate required fields
        if(!email || !password) {
            return NextResponse.json(
                { error: "Email & password are required or invalid" },
                { status: 400 }  // ✅ Status as second parameter
            );
        }

        // Find Existing user
        const userFromDb = await prisma.user.findUnique({
            where: {email},
            include: {team: true}
        });

        if(!userFromDb) {
            return NextResponse.json(
                { error: "Invalid credentials" }, 
                { status: 401 }
            );
        }

        const isValidPassword = await verifyPassword(password, userFromDb.password);

        if(!isValidPassword){
            return NextResponse.json(
                { error: "Invalid password" },
                { status: 401 }
            );
        }

        const token = generateToken(userFromDb.id);

        // Create Response
        const response = NextResponse.json(
            {
                user: {
                    id: userFromDb.id,
                    email: userFromDb.email,
                    name: userFromDb.name,
                    role: userFromDb.role,
                    teamId: userFromDb.teamId,
                    team: userFromDb.team,
                },
            },
            { status: 200 }  
        );

        // Set cookie
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", 
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,  // 7 days
            path: "/"
        });

        return response;

    } catch (error) {
        console.error("Login failed:", error);
        return NextResponse.json(
            { error: "Internal server error, something went wrong!" },
            { status: 500 }
        );
    }
}