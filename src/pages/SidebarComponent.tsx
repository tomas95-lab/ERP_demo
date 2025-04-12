import { AppSidebar } from "@/components/ui/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useNavigate, useLocation } from "react-router-dom"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"


export default function SideBarComponent({ children }: { children: React.ReactNode }) {
  const location = useLocation() 
  const url = location.pathname 
  const urlArray = url.split("/") 
  const urlParts = urlArray.slice(1) 
  const urlPartsArray = urlParts.map((part) => part.charAt(0).toUpperCase() + part.slice(1)) 

  const navigate = useNavigate()

  const LogOut = () => {
    localStorage.setItem("isAuthenticated", "false")
    navigate("/")
  }
  if (localStorage.getItem("isAuthenticated") == "false") {
    navigate("/")
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex w-full h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center justify-between w-full">
            <Breadcrumb>
              <BreadcrumbList>
                
                {urlParts[0] !== 'dashboard' ? <><BreadcrumbItem> <BreadcrumbLink href="/">Home</BreadcrumbLink> </BreadcrumbItem> <BreadcrumbSeparator /> </>  : "" }

                {urlPartsArray.map((path, index) => {
                  return (
                    <>
                      <BreadcrumbItem>
                        <BreadcrumbLink href="/" key={index}>{path == 'Dashboard' ? 'Home' : path}</BreadcrumbLink>
                      </BreadcrumbItem>
                      {index !== urlPartsArray.length - 1 ? <BreadcrumbSeparator /> : ""}
                    </>
                  )
                })}
              </BreadcrumbList>
            </Breadcrumb>
            <div className="flex">
              <DropdownMenu>
                <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" className="cursor-pointer" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {/* <DropdownMenuSeparator /> */}
                  {/* <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">Change Password</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">Notifications</DropdownMenuItem> */}
                  {/* <DropdownMenuItem className="cursor-pointer">Settings</DropdownMenuItem> */}
                  {/* <DropdownMenuSeparator /> */}
                  <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={LogOut}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
