"use client"

import * as React from "react"
import {BookOpen, Bot, FolderDot, GalleryVerticalEnd, Settings2, SquareTerminal,} from "lucide-react"

import {NavMain} from "@/components/nav-main"
import {NavProjects} from "@/components/nav-projects"
import {NavUser} from "@/components/nav-user"
import {TeamSwitcher} from "@/components/team-switcher.tsx"
import {Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail,} from "@/components/ui/sidebar"
import {NavFooter} from "@/components/nav-footer";

// This is sample data.
const data = {
    user: {
        name: "Manu",
        email: "emmanuel.narcisse97460@gmail.com",
        avatar: "/avatars/shadcn.jpg",
    },
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
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={data.teams}/>
            </SidebarHeader>
            <SidebarContent>
                <NavProjects projects={data.projects}/>
                {/*<NavMain items={data.navMain} />*/}
            </SidebarContent>
            <SidebarFooter>
                <NavFooter items={data.navFooter}/>
                <NavUser user={data.user}/>
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    )
}
