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

function Dashboard() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-white shadow rounded-xl p-6 flex flex-col items-start">
          <span className="text-sm text-muted-foreground">Usuários</span>
          <span className="text-2xl font-bold mt-2">1.245</span>
        </div>
        <div className="bg-white shadow rounded-xl p-6 flex flex-col items-start">
          <span className="text-sm text-muted-foreground">Vendas</span>
          <span className="text-2xl font-bold mt-2">R$ 18.400</span>
        </div>
        <div className="bg-white shadow rounded-xl p-6 flex flex-col items-start">
          <span className="text-sm text-muted-foreground">Atendimentos</span>
          <span className="text-2xl font-bold mt-2">320</span>
        </div>
      </div>
      <div className="bg-white shadow rounded-xl p-6 flex-1 min-h-[300px] mt-4">
        <span className="text-lg font-semibold">Resumo Geral</span>
        <div className="mt-2 text-muted-foreground">Gráficos ou informações adicionais podem ser exibidos aqui.</div>
      </div>
    </div>
  )
}

export default function Page() {
  const [screen, setScreen] = React.useState("dashboard")

  return (
    <SidebarProvider>
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
          {screen === "dashboard" && <Dashboard />}
          {screen === "tarefas" && <Tarefas />}
          {screen === "relatorios" && <Relatorios />}
          {screen === "usuarios" && <Usuarios />}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
