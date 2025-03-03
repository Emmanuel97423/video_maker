"use client"

import {ChevronRight, Feather, LucideIcon,} from "lucide-react"
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from "@/components/ui/sidebar"
import {CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {Button} from "@/components/ui/button";

export function NavFooter({
                              items,
                          }: {
    items: {
        title: string
        url: string
        icon?: LucideIcon
        isActive?: boolean
    }[]
}) {
    const {isMobile} = useSidebar()

    return (
        <SidebarGroup>
            <SidebarMenuButton asChild  >
                <a href='#'>
                    <Feather/>
                    <span>Demande fonctionnalité</span>
                </a>
                </SidebarMenuButton>
        </SidebarGroup>
    )
}
