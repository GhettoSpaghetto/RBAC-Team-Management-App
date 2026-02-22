import { checkUserPermission, getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/db";
import { Role } from "@/lib/types";
import { transformTeams, transformUsers } from "@/lib/util";
import { User } from "@/lib/types";
import { redirect } from "next/navigation";
import ManagerDashboad from "@/app/components/Dashboard/ManagerDashboard";

const ManagerPage = async() => {

    const user = await getCurrentUser();
    if(!user || !checkUserPermission(user, Role.MANAGER)){
        redirect("/unauthorized")
    }

    // Fetch manager's own team members
    const prismaMyTeamMembers = user.teamId ?
         await prisma.user.findMany({

            where: {
                teamId: user.teamId,
                role: {not: Role.ADMIN}
            },
            include: {
                team: true,
            },

        }): [];

        //Fetch all team members(cross-team view - exclude sensitive fields)

     const prismaAllTeamMembers = await prisma.user.findMany({
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
    
    const myTeamMembers = transformUsers(prismaMyTeamMembers);
    const allTeamMembers = transformUsers(prismaAllTeamMembers)

return (
    <ManagerDashboad
        myTeamMembers ={myTeamMembers as User[]} 
        allTeamMembers = {allTeamMembers as User[]}  
        currentUser = {user}/>
 )

};


export default ManagerPage