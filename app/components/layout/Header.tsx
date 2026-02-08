"use client"

import {User} from "@/lib/types"
import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderProps {
  user: User | null;
}
const Header = ({user}: HeaderProps ) => {
  const pathName = usePathname();
  const user1 = false
  const navigation = [
    {name: "Home", href:"/", show: true},
    {name: "Dashboard", href: "/dashboard", show: true},
  ].filter((item) => item.show);

  const getNavItemClass = (href: string) =>{
    let isActive = false;
    if(href === "/"){
      isActive = pathName === "/";

    } else if (href === "/dashboard"){
      isActive = pathName.startsWith(href);
    }

    return `px-3 py-2 rounded text-sm font-medium transition-colors ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`
  
  }

  return (
    <header className="bg-slate-900 border-b border-slate-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* LOGO */}
          <Link href="/" className="font-bold text-xl text-white">
            Team Access          
          </Link>



          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href} className={getNavItemClass(item.href)}>{item.name}</Link>
            ))}



          </nav>
          {/* User Info */}
          <div className="flex item-center space-x-4">
            {user1 ? <div>
              <span className="text-sm text-slate-300">Samarth Kaushal</span>
              <button type="button" 
                      // onClick={} 
                      className="px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-700 transition-colors"
                      >
                      Logout
                
              </button>
              </div>

            : (
              <>
                <Link 
                  href = "/login" 
                  className= " px-3 py-2 text-slate-300 text-sm  hover:bg-slate-800 hover:text-white rounded transition-colors">
                  Login
                </Link>

                <Link 
                  href = "/register" 
                  className= "px-3 py-2  bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                  Register
                </Link>
              </>
            ) }
          </ div>
        </div>
      </div>
    </header>
  )
}

export default Header