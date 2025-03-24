import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
    versions: ["1.0.0", "1.1.0", "2.0.0-beta"],
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        isActive: true,
        items: [
          {
            title: "Dashboard",
            url: "/dashboard",
            isActive: false,
          }
        ],
      },
      {
        title: "Projects",
        url: "/projects",
        isActive: false,
        items: [
          {
            title: "All Projects",
            url: "/projects/all",
            isActive: false,
          },
        ],
      },
      {
        title: "Financials",
        url: "/financials",
        isActive: false,
        items: [
          {
            title: "Expense Tracking",
            url: "/financials/expenses",
            isActive: false,
          },
          {
            title: "Invoices & Payments",
            url: "/financials/invoices",
            isActive: false,
          },
        ],
      },
      {
        title: "Suppliers",
        url: "/suppliers",
        isActive: false,
        items: [
          {
            title: "All Suppliers",
            url: "/suppliers/all",
            isActive: false,
          },
          {
            title: "Purchase Orders",
            url: "/suppliers/orders",
            isActive: false,
          },
        ],
      },
      {
        title: "Settings",
        url: "/settings",
        isActive: false,
        items: [
          {
            title: "General Configuration",
            url: "/settings/general",
            isActive: false,
          },
          {
            title: "User Management",
            url: "/settings/users",
            isActive: false,
          },
        ],
      },
    ],
  };
  
  

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <a href={item.url}>{item.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
