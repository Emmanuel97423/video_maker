"use client";

import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {SignInWithGoogleButton} from "@/app/auth/login/components/SignInWithGoogleButton";
import {createClient} from "@/utils/supabase/client";
import {useEffect} from "react";
import {useRouter} from "next/navigation";

// Forcer le rendu dynamique
export const dynamic = 'force-dynamic';

export default function LoginPage() {
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const {data: {user}} = await supabase.auth.getUser();
            if (user) {
                router.replace("/");
            }
        };
        
        checkAuth();
    }, []);

    return (
        <div className="mx-auto mb-32 flex w-96 flex-col items-center px-6">
            <h1 className="mb-6 mt-20">Se connecter</h1>
            <SignInWithGoogleButton/>
            <div className="my-3 flex w-full items-center">
                <hr className="grow border-gray-300"/>
                <span className="mx-3 text-sm text-gray-400">OU</span>
                <hr className="grow border-gray-300"/>
            </div>
            <div className="w-full">
                <div className="flex mb-1 w-full">
                    <div className="relative w-full">
                        <Input
                            className="block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 p-2.5 text-sm rounded-lg"
                            disabled={true}
                            required
                            placeholder="Email"
                            id="email"
                            type="email"
                            value=""
                            name="email"
                        />
                    </div>
                </div>
                <div className="mb-2 flex w-full flex-col">
                    <div className="flex mb-1 w-full">
                        <div className="relative w-full">
                            <Input
                                className="block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 p-2.5 text-sm rounded-lg"
                                disabled={true}
                                required
                                placeholder="Password"
                                id="password"
                                type="password"
                                value=""
                                name="password"
                            />
                        </div>
                    </div>
                    <div className="text-right">
                        <a className="pointer-events-none text-sm text-gray-500 hover:underline"
                           href="/reset-password">Mot de passe oublié ?
                        </a>
                    </div>
                </div>
                <Button
                    type="submit"
                    disabled
                    className="group cursor-pointer flex h-min items-center justify-center p-0.5 text-center font-medium relative focus:z-10 focus:outline-none text-gray-900 border border-gray-300 enabled:hover:bg-gray-100 focus:ring-cyan-300 :bg-gray-600 dark:text-white dark:border-gray-600 dark:enabled:hover:bg-gray-700 dark:enabled:hover:border-gray-700 dark:focus:ring-gray-700 rounded-lg focus:ring-2 mt-4 w-full"
                >
                    <span className="flex items-stretch transition-all duration-200 rounded-md text-sm px-3 py-1.5">
                        Se connecter avec un Email
                    </span>
                </Button>
            </div>
            <div className="mt-3 flex justify-between text-sm text-gray-500">
                <a className="hover:underline pointer-events-none"
                   href="/signup">Vous n'avez pas de compte?
                    <span className="text-blue-500"> S'enregistrer</span>
                </a>
            </div>
        </div>
    )
}