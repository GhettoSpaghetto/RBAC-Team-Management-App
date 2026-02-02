import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/db";
import { Role } from "@/lib/types";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server"

export const GET = async (request: NextRequest) => {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: "You are not authorized to access user information" },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const teamIdParam = searchParams.get("teamId")
    const roleParam = searchParams.get("role");

    // Build base where clause based on user role FIRST
    let where: Prisma.UserWhereInput = {};

    if (user.role === Role.ADMIN) {
      // Admin sees everyone - no restrictions
    } 
    else if (user.role === Role.MANAGER) {
      // Manager sees: their team members OR users from other teams (but not other managers/admins)
      where.OR = [
        { teamId: user.teamId },           // Everyone in my team
        { role: Role.USER }                 // Users from any team
      ];
      // Exclude: Admins and other Managers not in my team
      where.NOT = {
        AND: [
          { role: { in: [Role.ADMIN, Role.MANAGER] } },
          { teamId: { not: user.teamId } }
        ]
      };
    } 
    else {
      // Regular user: only their team, no admins
      where.teamId = user.teamId;
      where.role = { not: Role.ADMIN };
    }

    // Apply query filters ONLY if they don't violate role restrictions
    if (teamIdParam) {
      if (user.role === Role.ADMIN) {
        where.teamId = teamIdParam; // Admin can filter by any team
      } 
      else if (user.role === Role.MANAGER) {
        // Manager can only filter their own team
        if (teamIdParam === user.teamId) {
          where.teamId = teamIdParam;
          delete where.OR; // Remove the OR since we're specific now
          delete where.NOT;
        }
        // If trying to filter other teams, ignore param (keep base restrictions)
      }
      // Regular users: ignore team filter (already restricted to their team)
    }

    if (roleParam) {
      if (user.role === Role.ADMIN) {
        where.role = roleParam; // Admin can filter by any role
      }
      else if (user.role === Role.MANAGER) {
        // Manager can filter by USER role only
        if (roleParam === Role.USER) {
          where.role = roleParam;
        }
        // If trying to filter ADMIN/MANAGER, ignore param
      }
      else {
        // Regular users: already excluded ADMIN, respect other role filters
        if (roleParam !== Role.ADMIN) {
          where.role = roleParam;
        }
      }
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        team: {
          select: {
            id: true,
            name: true
          },
        },
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ users });

  } catch (error) {
    console.error("Get users error: ", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}