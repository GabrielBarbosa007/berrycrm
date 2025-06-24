"use client"

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
import React from "react"
import Tarefas from "@/components/feature/tarefas/Tarefas"
import Relatorios from "@/components/feature/relatorios/Relatorios"
import Usuarios from "@/components/feature/usuarios/Usuarios"
import { TarefasProvider } from "@/context/TarefasContext"

export default function Page() {
  const [screen, setScreen] = React.useState("dashboard")

  return (
    <SidebarProvider>
      <TarefasProvider>
        <AppSidebar onScreenChange={setScreen} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">
                      Building Your Application
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      {screen === "dashboard" && "Dashboard"}
                      {screen === "tarefas" && "Tarefas"}
                      {screen === "relatorios" && "Relatórios"}
                      {screen === "usuarios" && "Usuários"}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          
            {screen === "tarefas" && <Tarefas />}
            {screen === "relatorios" && <Relatorios />}
            {screen === "usuarios" && <Usuarios />}
          </div>
        </SidebarInset>
      </TarefasProvider>
    </SidebarProvider>
  )
}
