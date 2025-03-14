'use client';
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

const LogoutPage = () => {
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const handleLogout = async () => {
            await supabase.auth.signOut();
            setTimeout(() => router.push("/auth/login"), 1000);
        };
        handleLogout();
    }, []);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <h1 className="mb-4 text-2xl font-semibold">Déconnexion en cours...</h1>
                <p className="text-gray-600">Vous allez être redirigé dans un instant.</p>
            </div>
        </div>
    );
};

export default LogoutPage;