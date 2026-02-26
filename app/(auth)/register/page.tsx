"use client"

import { apiClient } from "@/lib/apiClient";
import Link from "next/link";
import { useActionState } from "react";

export type RegsiterState = {
    error?: string;
    success?: boolean;
};

const RegisterPage = () => {
    const [state, registerAction, isPending] = useActionState(
        
        async(
            prevState: RegsiterState,
            formData: FormData
        ): Promise<RegsiterState> => {
            const name =formData.get("name") as string;
            const email =formData.get("email") as string;
            const password =formData.get("password") as string;
            const teamCode =formData.get("teamCode") as string;

            try {
                await apiClient.register({
                    name, 
                    email, 
                    password, 
                    teamCode: teamCode || undefined
                });

                window.location.href ="/dashboard";
                return {success: true}


            } catch (error) {
                
                return {
                    error: error instanceof Error ? error.message: "Registration failed"
                };

            }
        },
        {error: undefined, success: undefined}
    );

    return(
        <div className="bg-slate-800 p-8 rounded-lg border border-slate-700 w-full max-w-md">

            <form action={registerAction}>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white">Create new Account</h2>
                    <p className="mt-2 text-sm text-slate-400">
                        Or{" "}
                        <Link href="/login" className="font-medium text-blue-400 hover:text-blue-300">Sign in to existing account</Link>
                    </p>
                </div>
                {state?.error &&(
                    <div className="bg-red-900/50 border border-red-700, text-red-300 px-4 py-3 rounded mb-4">
                        {state.error}
                    </div>
                )}

                <div className="space-y-4">
                    <div className="">
                        <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">
                            Full name
                        </label>

                        <input 
                            id = "name" 
                            type="text" 
                            name= "name" 
                            autoComplete="name" 
                            required 
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                            placeholder="Enter your full name"
                        />

                    </div>

                    <div className="">
                        <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
                            Email
                        </label>

                        <input 
                            id = "email" 
                            type="text" 
                            name= "email" 
                            autoComplete="email" 
                            required 
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                            placeholder="Enter your email"
                        />

                    </div>

                    <div className="">
                        <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
                            Password
                        </label>

                        <input 
                            id = "password" 
                            type="text" 
                            name= "password" 
                            autoComplete="new-password" 
                            required 
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                            placeholder="Create your password"
                        />

                    </div>

                    <div className="">
                        <label htmlFor="teamCode" className="block text-sm font-medium text-slate-300 mb-1">
                            Team Code (optional)
                        </label>

                        <input 
                            id = "teamCode" 
                            type="text" 
                            name= "teamCode" 
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                            placeholder="Enter team code if you have one"
                        />

                        <p className="text-xs text-slate-500 mt-1   ">Ignore if you do not have a team yet</p>
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled= {isPending} 
                    className="w-full mt-6 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        {isPending? "Creating account... ": "Create account"}
                </button>
            </form>
        </div>
    )
}

export default RegisterPage;