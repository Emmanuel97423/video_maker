"use server";

import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";

import {createClientForServer} from "@/utils/supabase/server";

export async function login(formData: FormData) {
    const supabase = await createClientForServer();

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };

    const {error} = await supabase.auth.signInWithPassword(data);

    if (error) {
        redirect("/error");
    }

    revalidatePath("/", "layout");
    redirect("/");
}

export async function signup(formData: FormData) {
    const supabase = await createClientForServer();

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const firstName = formData.get("first-name") as string;
    const lastName = formData.get("last-name") as string;
    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        options: {
            data: {
                full_name: `${firstName + " " + lastName}`,
                email: formData.get("email") as string,
            },
        },
    };

    const {error} = await supabase.auth.signUp(data);

    if (error) {
        redirect("/error");
    }

    revalidatePath("/", "layout");
    redirect("/");
}

export async function signout() {
    const supabase = await createClientForServer();
    const {error} = await supabase.auth.signOut();
    if (error) {
        console.log(error);
        redirect("/error");
    }
    await supabase.auth.refreshSession();

    redirect("/auth/login");
}

export async function signInWithGoogle() {
    const supabase = await createClientForServer();
    const auth_callback_url = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`;
    const {data, error} = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            queryParams: {
                redirectTo: auth_callback_url
            },
        },
    });

    if (error) {
        console.log(error);
        redirect("/error");
    }

    await supabase.auth.refreshSession();

    redirect(<string>data?.url || "/");
}
