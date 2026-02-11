import { getCurrentUser } from "@/lib/auth";
import { Role } from "@/lib/types";
import { redirect } from "next/navigation";

const DashboardLayout = async() => {

    const user = await getCurrentUser();
    if(!user) {
        redirect("/login");
    }

    //Register based user role
    switch(user.role){
        case Role.ADMIN:
            redirect("/dashboard/admin");
            break;
        case Role.MANAGER:
            redirect("/dashboard/manager");
            break;
        case Role.USER:
            redirect("/dashboard/user");
            break;

        default:
            redirect("/dashboard/user");
            
    }
};

export default DashboardLayout;