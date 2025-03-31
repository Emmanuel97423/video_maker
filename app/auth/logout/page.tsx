'use client';
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createClientForServer } from "@/utils/supabase/server";

const LogoutPage = () => {
    const router = useRouter();

    useEffect(() => {
        const handleLogout = async () => {
            try {
                const supabase = await createClientForServer();
                await supabase.auth.signOut();
                router.replace("/auth/login");
            } catch (error) {
                console.error("Erreur lors de la déconnexion:", error);
                router.replace("/error");
            }
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

// Désactiver la génération statique pour cette page
export const dynamic = 'force-dynamic';

export default LogoutPage;