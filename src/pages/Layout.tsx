import { Outlet } from "react-router-dom";
import SideBarComponent from "./SidebarComponent";
import { Toaster } from "sonner";
export default function Layout () {
    return (
        <>
            <SideBarComponent>
                <Outlet />
                <Toaster />
            </SideBarComponent>
        </>
    )
}