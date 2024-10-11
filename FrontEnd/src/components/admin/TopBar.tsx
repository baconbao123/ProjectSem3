import React, { useEffect, useRef, useState} from "react";
import { Avatar} from "@mui/material";
// @ts-ignore
import { MenuTopBar } from "@components/admin/Nav.ts"
import {Link, useNavigate} from "react-router-dom";
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import defaultImage from "@src/images/default.png";
// @ts-ignore
import logo from '@src/images/logo.png'
// @ts-ignore
import Cookies from "js-cookie"
import {useSelector} from "react-redux";

const TopBar : React.FC = () => {
    const [showRightInfo, setShowRightInfo] = useState(false);
    const navigate = useNavigate();
    const  refInfo = useRef(null);
    const refAvatar = useRef(null);
    const [active, setActive] = useState<string>('');
    const [avatarImg, setAvatarImg] = useState(defaultImage);
    const name = localStorage.getItem("name")
    const logout = () => {
        try {
            Cookies.remove("token");
            Cookies.remove("refreshToken");
            localStorage.clear()
            location.reload()


        }
        catch (e) {
            console.log(e);
        }

    }
    const handleClickOutSideInfo = (e: any) => {
        // @ts-ignore
        if (refInfo.current && !refInfo.current.contains(e.target) && refAvatar.current && !refAvatar.current.contains(e.target)) {
           setShowRightInfo(false)
        }
    }
    useEffect(() => {
        setActive('admin')
        document.addEventListener('mousedown', handleClickOutSideInfo);
        return () => {
            document.removeEventListener('mousedown', handleClickOutSideInfo);
        };
    }, []);
    return (
      <div className="top-bar-admin container-fluid " >
          <div className="row top-bar-contanier ">
              <div className="col-2 top-bar-item justify-content-center">
                  <img src={logo}  className='logo-img' />
              </div>
              <div className="col-8 top-bar-item menu">
                  {/*{*/}
                  {/*    MenuTopBar.map(item => {*/}
                  {/*        const IconComponent = item.icon;*/}
                  {/*        return (*/}
                  {/*            <div onClick={() => setActive(item.code)} className={active === item.code ? 'active item-nav': 'item-nav'} key={item.code}>*/}
                  {/*                <Link  to={item.link} style={{ textDecoration: 'none', color: 'inherit' }} key={item.code}>*/}
                  {/*                    <IconComponent />*/}
                  {/*                </Link>*/}
                  {/*            </div>*/}
                  {/*        )*/}
                  {/*    })*/}
                  {/*}*/}
              </div>
              <div className="col-2 justify-content-end top-bar-item">
                  <div  ref={refAvatar} className='d-flex align-items-center gap-2 top-bar-item-info' onClick={() => setShowRightInfo(!showRightInfo)}>
                      {name ?  name: ''}
                    <Avatar  src={import.meta.env.VITE_BASE_URL_LOCALHOST + 'images/' + localStorage.getItem('avatar')}  ></Avatar>
                  </div>
              </div>
          </div>
          <div ref={refInfo} className={'top-bar-content-left  ' + (showRightInfo ? 'show' : '')}>
              <div className="header">
                  <div className=' mt-2 d-flex justify-content-center '>
                      <Avatar  src={import.meta.env.VITE_BASE_URL_LOCALHOST + 'images/' + localStorage.getItem('avatar')} sx={{width: 100, height: 100}}></Avatar>
                  </div>
                  <div className=' mt-2 d-flex justify-content-center'>
                      <div>  {name ?  name: ''}</div>
                  </div>
              </div>

                  <div className="body">
                      <hr/>
                  </div>

                <hr/>
              <div className=' footer d-flex justify-content-center align-items-center '>
                  <Button onClick={() => logout()} variant="outlined"  color="warning" size="large" endIcon={<LogoutIcon />}>
                      LOG OUT
                  </Button>
              </div>
              <div className="text-center fs-6">
                  <i>
                  Copyright &#169; Nguyen
                  </i>
              </div>
          </div>
      </div>
    )
}

export default TopBar