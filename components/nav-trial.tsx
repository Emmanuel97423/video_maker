"use client"

import {
    SidebarGroup
} from "@/components/ui/sidebar"
import { useUser } from "@/hooks/useUser"
import { useUserQuota } from "@/hooks/useUserQuota"
import Link from "next/link"

export function NavTrial() {
    const { user } = useUser();
    const { quota, loading } = useUserQuota(user?.id || '');

    if (loading || !quota) {
        return null;
    }

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <div className="rounded-lg border border-gray-200 p-3 mx-2">
                <h3 className="text-sm font-medium mb-2">Forfait {quota.plan}</h3>
                <div className="space-y-1 mb-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Vidéos générées</span>
                        <span className="text-gray-600">{quota.video_count}/{quota.max_videos}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                        Renouvellement le {new Date(quota.reset_date).toLocaleDateString()}
                    </div>
                </div>
                <Link href="/pricing">
                    <button 
                        disabled={true} 
                        className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500 text-white rounded-md py-2 px-4 text-sm font-medium flex items-center justify-center"
                    >
                        Mettre à jour
                    </button>
                </Link>
            </div>
        </SidebarGroup>
    )
} 