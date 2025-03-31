import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "@/app/globals.css";
import Header from "@/components/ui/header";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Kaniko",
    description: "Kaniko est un outil qui vous aide à créer des vidéos à partir d'images.",
};
export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            {/* <Header/> */}
            <header className="h-16 border-b border-gray-100"></header>
            {children}
        </div>
    );
}
