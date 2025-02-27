"use client";

import Image from "next/image";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

export default function LoginPage() {
    return (
        <div className="mx-auto mb-32 flex w-96 flex-col items-center px-6">
            <h1 className="mb-6 mt-20">Se connecter</h1>
            <Button type="button"
                    className="group cursor-pointer flex h-min items-center justify-center p-0.5 text-center font-medium relative focus:z-10 focus:outline-none text-gray-900 bg-white hover:bg-gray-100 border border-gray-300 enabled:hover:bg-gray-200 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:enabled:hover:bg-gray-600 dark:focus:ring-blue-800 rounded-lg focus:ring-2 mx-auto w-full">
                <span className="flex items-stretch transition-all duration-200 rounded-md text-sm px-4 py-2"><Image
                    alt="Google Logo" loading="lazy" width="18" height="24" decoding="async" data-nimg="1"
                    className="-mt-0.5 mr-2 inline-block h-6" src="/img/google_icon.svg" style="color: transparent;"/>Se connecter avec Google</span>
            </Button>
            <div className="my-3 flex w-full items-center">
                <hr className="grow border-gray-300"/>
                <span className="mx-3 text-sm text-gray-400">OU BIEN</span>
                <hr className="grow border-gray-300"/>
            </div>
            <form className="w-full">
                <div className="flex mb-1 w-full">
                    <div className="relative w-full">
                        <Input className="block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 p-2.5 text-sm rounded-lg"
                        required="" placeholder="Email" id="email" type="email" value="" name="email"/>
                    </div>
                </div>
                <div className="mb-2 flex w-full flex-col">
                    <div className="flex mb-1 w-full">
                        <div className="relative w-full"><input
                            className="block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 p-2.5 text-sm rounded-lg"
                            required="" placeholder="Password" id="password" type="password" value="" name="password"/>
                        </div>
                    </div>
                    <div className="text-right"><a className="text-sm text-gray-500 hover:underline"
                                                   href="/reset-password">Mot de passe oublié ?</a></div>
                </div>
                <Button type="submit"
                        className="group cursor-pointer flex h-min items-center justify-center p-0.5 text-center font-medium relative focus:z-10 focus:outline-none text-gray-900 border border-gray-300 enabled:hover:bg-gray-100 focus:ring-cyan-300 :bg-gray-600 dark:text-white dark:border-gray-600 dark:enabled:hover:bg-gray-700 dark:enabled:hover:border-gray-700 dark:focus:ring-gray-700 rounded-lg focus:ring-2 mt-4 w-full">
                    <span className="flex items-stretch transition-all duration-200 rounded-md text-sm px-3 py-1.5">Se connecter avec un Email</span>
                </Button>
            </form>
            <div className="mt-3 flex justify-between text-sm text-gray-500"><a className="hover:underline"
                                                                                href="/signup">Vous n'avez pas de
                compte?
                <span className="text-blue-500"> S'enregistrer</span></a></div>
        </div>
    )
}