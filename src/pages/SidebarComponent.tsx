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
import { IndentIcon } from "lucide-react";

import { useLocation } from "react-router-dom";

export default function SideBarComponent({children}: {children: React.ReactNode}) {
    const location = useLocation(); // Detecta la URL actual
    const url = location.pathname; // Guarda la URL actual en una variable
    const urlArray = url.split("/"); // Divide la URL en un array    

    const urlParts = urlArray.slice(1); // Obtiene las partes de la URL
    const urlPartsArray = urlParts.map((part) => part.charAt(0).toUpperCase() + part.slice(1)); // Convierte las partes de la URL en un array 
    
    return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
          <BreadcrumbList>
            {urlPartsArray.map((path,index)=>{
              return (
                  <>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/" key={index}>{path}</BreadcrumbLink>
                    </BreadcrumbItem>
                  {index !== urlPartsArray.length - 1 ? <BreadcrumbSeparator /> : "" }
                  </>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>

        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
