import React, {useEffect} from "react";
import { Outlet } from 'react-router-dom'
import TopBar from "@components/admin/TopBar.tsx";
import MenuSide from "@components/admin/MenuSide.tsx";
import {useDispatch, useSelector} from "react-redux";
import {setIsInit} from "@src/Store/Slinces/appSlice.ts";


const LayOutAdmin : React.FC = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setIsInit(false))
    }, []);
    const init = useSelector((state: any) => state.app.isInit);
    const content = () => {
        return (
            <div className="layout-admin">

                <TopBar/>
                <div className='default-layout'>
                    <MenuSide/>
                    <div className='container-fluid'>
                        <Outlet/>
                    </div>
                </div>
            </div>
        )
    }
    const sekeleton = () => {
        return (
            <div className="layout-admin">

               <h1>This is sekelenton</h1>
            </div>
        )
    }

    return (
        <>
            {!init ? content() :sekeleton() }
        </>
    )
}

export default LayOutAdmin