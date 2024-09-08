import ValueContext from "../DataSave/ValueContext.ts";
import React, {useContext, useEffect} from "react";
import { Outlet } from 'react-router-dom'
import TopBar from "@components/admin/TopBar.tsx";
import MenuSide from "@components/admin/MenuSide.tsx";
const LayOutAdmin : React.FC = () => {
    useEffect(() => {
        // checkToken()
    }, []);

    return (
        <div>
            <TopBar/>
            <div className="container-content container-fluid">
                    <div className="row">
                    <div className="col-1 menu-part">
                        <MenuSide/>
                    </div>
                    <div className="col-11 content-part">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LayOutAdmin