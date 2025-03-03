"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { signout } from "@/lib/auth-actions";

const LoginButton = () => {
    const [user, setUser] = useState<any>(null);
    const router = useRouter();
    const supabase = createClient();
    useEffect(() => {
        const fetchUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            setUser(user);
        };
        fetchUser();
    }, []);
    if (user) {
        return (
            <Button
                onClick={() => {
                    signout();
                    setUser(null);
                }}
            >
                Se déconnecter
            </Button>
        );
    }
    return (
        <Button
            variant="outline"
            onClick={() => {
                router.push("/auth/login");
            }}
        >
            Se connecter
        </Button>
    );
};

export default LoginButton;
