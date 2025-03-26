'use client'

import {Button} from "@/components/ui/button";
import Image from "next/image";
import {createClient} from "@/utils/supabase/client";

export function SignInWithGoogleButton() {
    const supabase = createClient();

    const handleSignIn = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
                redirectTo: `${window.location.origin}/auth/callback`
            }
        });

        if (error) {
            console.error('Erreur de connexion:', error.message);
        }
    };

    return (
        <Button
            onClick={handleSignIn}
            type="button"
            className="group cursor-pointer flex h-min items-center justify-center p-0.5 text-center font-medium relative focus:z-10 focus:outline-none text-gray-900 bg-white hover:bg-gray-100 border border-gray-300 enabled:hover:bg-gray-200 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:enabled:hover:bg-gray-600 dark:focus:ring-blue-800 rounded-lg focus:ring-2 mx-auto w-full">
            <span className="flex items-stretch transition-all duration-200 rounded-md text-sm px-4 py-2">
                <Image
                    alt="Google Logo" 
                    loading="lazy" 
                    width="18" 
                    height="24" 
                    decoding="async" 
                    data-nimg="1"
                    className="-mt-0.5 mr-2 inline-block h-6" 
                    src="/img/google_icon.svg" 
                    style={{ color: 'transparent' }}
                />
                Se connecter avec Google
            </span>
        </Button>
    )
}