import { checkUserPermission, getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/db";
import { Role } from "@/lib/types";
import { redirect } from "next/navigation";

const AdminPage = async() => {

    const user = await getCurrentUser();
    if(!user || !checkUserPermission(user, Role.ADMIN)){
        redirect("/unauthorized")
    }

    // Fetch data for admin dashboard
    const [prismaUsers, prismaTeams] = await Promise.all([
        prisma.user.findMany({
            include: {
                team: true,
            },
            orderBy: {createdAt: "desc"}
        }),
        prisma.team.findMany({
            include: {
                members: {
                    select: {
                        id: true,
                        name: true,
                        role: true,
                        email: true
                    },
                },
            },
        }),
    ]);

return (
    <AdminDashboard 
        users ={prismaUsers} 
        teams = {prismaTeams} 
        currentUser = {user}
    />
 )

};


export default AdminPage