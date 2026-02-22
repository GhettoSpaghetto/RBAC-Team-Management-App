import UserDashboard from "@/app/components/Dashboard/UserDashboard";
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/db";
import { User } from "@/lib/types";
import { redirect } from "next/navigation";

const UserPage = async() => {

    const user = await getCurrentUser();
    if(!user){
        redirect("/unauthorized")
    }

    // Fetch user specific data
    const teamMembers = user.teamId ?
       await prisma.user.findMany({
            where: {
                teamId: user.teamId,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            },

        }): [];

        

return (
    <UserDashboard 
        teamMembers ={teamMembers as User[]} 
        currentUser = {user}
    />
 )

};


export default UserPage