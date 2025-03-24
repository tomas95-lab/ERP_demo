import { Outlet } from "react-router-dom";
import SideBarComponent from "./SidebarComponent";
export default function Layout () {
    return (
        <>
            <SideBarComponent>
                <Outlet />
            </SideBarComponent>
        </>
    )
}