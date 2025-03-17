"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavTrial() {
    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <div className="rounded-lg border border-gray-200 p-3 mx-2">
                <h3 className="text-sm font-medium mb-2">Plan d'essai</h3>
                <div className="space-y-1 mb-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Vidéo générés</span>
                        <span className="text-gray-600">0/3</span>
                    </div>
                </div>
                <Link href="/pricing">
                    <button className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-md py-2 px-4 text-sm font-medium flex items-center justify-center">
                        Upgrade plan
                    </button>
                </Link>
            </div>
        </SidebarGroup>
    )
} 