
import { checkDatabasConnection } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    const isConnected = await checkDatabasConnection();
    if(!isConnected){
        return NextResponse.json(
            {
                status: "error",
                message: "Database connection failed",
            },
            { status: 503}
        );

    } 
    return NextResponse.json(
        {
            status: "ok",
            message: "Database connection successfully",
        },
        { status: 200}
    );
    
    }
