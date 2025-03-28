"use client"

import * as React from "react"
import {BookOpen, Bot, FolderDot, GalleryVerticalEnd, Settings2, SquareTerminal,} from "lucide-react"
import { useUser } from "@/hooks/useUser"

import {NavMain} from "@/components/nav-main"
import {NavProjects} from "@/components/nav-projects"
import {NavUser} from "@/components/nav-user"
import {TeamSwitcher} from "@/components/team-switcher"
import {Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail,} from "@/components/ui/sidebar"
import {NavFooter} from "@/components/nav-footer"
import {NavTrial} from "@/components/nav-trial"

// This is sample data.
const data = {
    teams: [
        {
            name: "Mon entreprise",
            logo: GalleryVerticalEnd,
            plan: "Entreprise",
        },
        // {
        //     name: "Acme Corp.",
        //     logo: AudioWaveform,
        //     plan: "Startup",
        // },
        // {
        //     name: "Evil Corp.",
        //     logo: Command,
        //     plan: "Free",
        // },
    ],
    navMain: [
        {
            title: "Playground",
            url: "#",
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: "History",
                    url: "#",
                },
                {
                    title: "Starred",
                    url: "#",
                },
                {
                    title: "Settings",
                    url: "#",
                },
            ],
        },
        {
            title: "Models",
            url: "#",
            icon: Bot,
            items: [
                {
                    title: "Genesis",
                    url: "#",
                },
                {
                    title: "Explorer",
                    url: "#",
                },
                {
                    title: "Quantum",
                    url: "#",
                },
            ],
        },
        {
            title: "Documentation",
            url: "#",
            icon: BookOpen,
            items: [
                {
                    title: "Introduction",
                    url: "#",
                },
                {
                    title: "Get Started",
                    url: "#",
                },
                {
                    title: "Tutorials",
                    url: "#",
                },
                {
                    title: "Changelog",
                    url: "#",
                },
            ],
        },
        {
            title: "Settings",
            url: "#",
            icon: Settings2,
            items: [
                {
                    title: "General",
                    url: "#",
                },
                {
                    title: "Team",
                    url: "#",
                },
                {
                    title: "Billing",
                    url: "#",
                },
                {
                    title: "Limits",
                    url: "#",
                },
            ],
        },
    ],
    navFooter:[
        {
            name: "T4 Saint-Denis",
            url: "#",
            icon: FolderDot,
        },

    ],
    projects: [
        {
            name: "T4 Saint-Denis",
            url: "#",
            icon: FolderDot,
        },
        {
            name: "Villa F7 Saint-Paul",
            url: "#",
            icon: FolderDot,
        },
        {
            name: "Terrain 120m2 Saint-Paul",
            url: "#",
            icon: FolderDot,
        },
    ],
}

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    const { user, loading } = useUser();

    const userData = user ? {
        name: user.name || "Utilisateur",
        email: user.email,
        avatar: "/avatars/default.jpg",
    } : {
        name: loading ? "Chargement..." : "Non connecté",
        email: "",
        avatar: "/avatars/default.jpg",
    };

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                {/* <TeamSwitcher teams={data.teams}/> */}
            </SidebarHeader>
            <SidebarContent>
                {/* <NavProjects projects={data.projects}/> */}
                {/*<NavMain items={data.navMain} />*/}
            </SidebarContent>
            <SidebarFooter>
                {/* <NavFooter items={data.navFooter}/> */}
                <NavTrial />
                <NavUser user={userData}/>
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    )
}
