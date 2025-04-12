import { Outlet } from "react-router-dom";
import SideBarComponent from "./SidebarComponent";
import { Toaster } from "sonner";
import BotComponent from "@/components/BotComponents";
import { ScreenProvider } from "@/components/ScreenContext";
import { ReactNode } from "react";

interface LayoutProps {
  children?: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <ScreenProvider>
      <SideBarComponent>
        <Outlet />
        <Toaster />
      </SideBarComponent>
      <BotComponent />
      {children}
    </ScreenProvider>
  );
}
