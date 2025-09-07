import NavBarComponent from "@/Component/Navbar";
import React from "react";

function UserLayout({ children }){
    return(
        <div>
            <NavBarComponent />
            {children}
        </div>
    )
}

export default UserLayout;