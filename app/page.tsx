'use client'
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { UploadModal } from "@/components/upload-modal"
import { Bell } from "lucide-react"
import { useState } from "react"
import { VideoList } from "@/components/video-list"

export default function HomePage() {
    const [uploadModalOpen, setUploadModalOpen] = useState(false)

    return (
        <SidebarProvider>
            <AppSidebar/>
            <SidebarInset>
                  
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium">What's new?</span>
              <div className="h-2 w-2 rounded-full bg-red-500"></div>
            </div>
            <Avatar>
              <AvatarImage src="/avatar.png" alt="User" />
              <AvatarFallback>UN</AvatarFallback>
            </Avatar>
          </div>
                <header
                    className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[data-collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1"/>
                        <Separator orientation="vertical" className="mr-2 h-4"/>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="#">
                                        Building Your Application
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block"/>
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
              <main className="max-w-7xl mx-auto px-6 py-8">
        {/* New Project Section */}
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-semibold">Nouveau projet</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Generate Captions Card */}
            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 cursor-pointer" onClick={() => setUploadModalOpen(true)}>
              <div>
                <h3 className="font-medium">Genéré une vidéo depuis une photo</h3>
                {/* <p className="text-sm text-gray-500">Ajoutez des sous-titres et des b-rolls</p> */}
              </div>
              <div className="h-16 w-16 rounded-lg bg-gray-100"></div>
            </div>

            {/* Magic Clips Card */}
            {/* <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">Magic clips</h3>
                  <span className="rounded bg-red-500 px-2 py-0.5 text-xs text-white">New</span>
                </div>
                <p className="text-sm text-gray-500">Get clips from long video</p>
              </div>
              <div className="relative h-16 w-16 rounded-lg bg-gray-100">
                <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white">
                  43:56
                </span>
              </div>
            </div> */}
          </div>
        </section>

        {/* All Projects Section */}
        <section>
          <h2 className="mb-4 text-xl font-semibold">Tous les projets</h2>
          {/* <div className="mb-8 flex flex-wrap gap-4">
            <select className="rounded-md border border-gray-200 px-3 py-1.5 text-sm">
              <option>Type: Tous</option>
            </select>
            <select className="rounded-md border border-gray-200 px-3 py-1.5 text-sm">
              <option>Status: Tous</option>
            </select>
            <select className="rounded-md border border-gray-200 px-3 py-1.5 text-sm">
              <option>Filter by: Active</option>
            </select>
            <select className="rounded-md border border-gray-200 px-3 py-1.5 text-sm">
              <option>Sort by: Newest</option>
            </select>
          </div> */}

          {/* Liste des vidéos avec état vide conditionnel */}
          <VideoList />

          {/* Empty State - sera affiché seulement si VideoList ne retourne rien */}
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 py-12 empty-state">
            <p className="mb-4 text-gray-500">Aucun projet dans ce dossier</p>
            <Button 
                variant="outline" 
                onClick={() => setUploadModalOpen(true)}
            >
                Importer une photo
            </Button>
          </div>

          <style jsx>{`
            .empty-state {
                display: none;
            }
            :empty + .empty-state {
                display: flex;
            }
          `}</style>
        </section>
      </main>

            </SidebarInset>

            <UploadModal 
                open={uploadModalOpen} 
                onOpenChange={setUploadModalOpen}
            />
        </SidebarProvider>
    )
}
