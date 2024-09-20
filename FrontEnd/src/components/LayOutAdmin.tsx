import React, {useEffect} from "react";
import { Outlet } from 'react-router-dom'
import TopBar from "@components/admin/TopBar.tsx";
import MenuSide from "@components/admin/MenuSide.tsx";
const LayOutAdmin : React.FC = () => {
    useEffect(() => {
        // checkToken()
    }, []);

    return (
        <>
        <div className="layout-admin">

            <TopBar/>
            <div className='default-layout'>
                <MenuSide/>
                <div className='container-fluid'>
                    <Outlet />
                </div>
            </div>
        </div>
        </>
    )
}

export default LayOutAdmin