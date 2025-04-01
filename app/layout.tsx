import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
    variable: "--font-jetbrains-mono",
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
        <html lang="en">
            <body
                className={`${geistSans.variable} ${jetbrainsMono.variable} antialiased`}
            >
                        {children}
                        <Toaster position="top-center" />
            </body>
        </html>
    );
}
