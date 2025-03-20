import { AppSidebar } from "@/components/ui/app-sidebar"
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

import { useLocation } from "react-router-dom";
import Dashboard from "./Dashboard";

export default function SideBarComponent() {
    const location = useLocation(); // Detecta la URL actual
    const url = location.pathname; // Guarda la URL actual en una variable
    const urlArray = url.split("/"); // Divide la URL en un array
    const currentUrl = (urlArray[urlArray.length - 1]).charAt(0).toUpperCase() + urlArray[urlArray.length - 1].slice(1); // Obtiene la última parte de la URL

    return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  Demo Erp Contructions
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{currentUrl}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
      <Dashboard></Dashboard>
      </SidebarInset>
    </SidebarProvider>
  )
}
