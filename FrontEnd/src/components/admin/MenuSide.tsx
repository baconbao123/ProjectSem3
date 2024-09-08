import React, { useEffect, useRef, useState} from "react";
import { Avatar} from "@mui/material";
import { MenuTopBar } from "@components/admin/Menu.ts"
import {Link, useNavigate} from "react-router-dom";
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
// @ts-ignore
import Cookies from "js-cookie"

const MenuSide : React.FC = () => {
    const [showLeftMenu, setShowLeftMenu] = useState(false);
    const navigate = useNavigate();
    const  refInfo = useRef(null);
    const refAvatar = useRef(null);
    // const handleClickOutSideInfo = (e: any) => {
    //     // @ts-ignore
    //     if (refInfo.current && !refInfo.current.contains(e.target) && refAvatar.current && !refAvatar.current.contains(e.target)) {
    //        setShowLeftMenu(false)
    //     }
    // }
    // useEffect(() => {
    //     document.addEventListener('mousedown', handleClickOutSideInfo);
    //
    //     return () => {
    //         document.removeEventListener('mousedown', handleClickOutSideInfo);
    //     };
    // }, []);
    return (
      <div className="menu-side-admin">
          <h1>Hello this is menu side</h1>
      </div>
    )
}

export default MenuSide