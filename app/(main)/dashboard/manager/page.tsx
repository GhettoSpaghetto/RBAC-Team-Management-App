import { checkUserPermission, getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/db";
import { Role } from "@/lib/types";
import { redirect } from "next/navigation";

const ManagerPage = async() => {

    const user = await getCurrentUser();
    if(!user || !checkUserPermission(user, Role.ADMIN)){
        redirect("/unauthorized")
    }

    // Fetch manager's own team members
    const prismaMyTeamMembers = user.teamId ?
        prisma.user.findMany({

            where: {
                teamId: user.teamId,
                role: {not: Role.ADMIN}
            },
            include: {
                team: true,
            },

        }): [];

        //Fetch all team members(cross-team view - exclude sensitive fields)

     const prismaAllTeamMembers = prisma.user.findMany({
        where: {
            role: {not: Role.ADMIN},
        },
        include: {
            team: {
                select: {
                    id: true,
                    name: true,
                    code: true,
                    description: true
                }
            },
        },
        orderBy: {
            teamId: "desc",
        },
        
    });
    
        

return (
    <ManagerDashboad 
        myTeamMemberes ={prismaMyTeamMembers} 
        allTeamMembers = {prismaAllTeamMembers} 
        currentUser = {user}
    />
 )

};


export default ManagerPage