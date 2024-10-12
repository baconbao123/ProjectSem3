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
import {useDispatch, useSelector} from "react-redux";
import {setDefaultColor, setShowModal, setShowModal3, setTheme, setToast} from "@src/Store/Slinces/appSlice.ts";
import Modal3 from "@pages/common/Modal3.tsx";
import UserForgot from "@pages/user/UserForgot.tsx";

const TopBar : React.FC = () => {
    const [showRightInfo, setShowRightInfo] = useState(false);
    const navigate = useNavigate();
    const  refInfo = useRef(null);
    const refAvatar = useRef(null);
    const [active, setActive] = useState<string>('');
    const [avatarImg, setAvatarImg] = useState(defaultImage);
    const name = localStorage.getItem("name")
    const dispatch = useDispatch()
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
    const handleUserForgot = () => {
        return (
            <UserForgot loadDataTable={() => { dispatch(setShowModal3(false))}} id={localStorage.getItem("id")} />
        )
    }
    const dataColor = [
        {theme: 'lara-light-cyan', color: '#06b6d4'},
        {theme: 'lara-light-blue', color: '#3b82f6'},
        {theme: 'lara-light-teal', color: '#14b8a6'},
        {theme: 'lara-light-indigo', color: '#6366f1'},
    ]
    const setChangeTheme = (item) => {
        dispatch(setTheme(item.theme))
        dispatch(setDefaultColor(item.color))
        localStorage.setItem("theme", item.theme)
        localStorage.setItem("default-color", item.color)
        dispatch(setToast({status: 'success', message: 'Success', data: 'Change theme successful'}))
    }

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
                  <div className='d-flex justify-content-evenly' style={{gap: '10px'}}>
                      {dataColor.map((item: any) => {
                          return (
                              <div onClick={() => setChangeTheme(item)} style={{height: '40px', width: '40px', borderRadius: '10px', cursor: 'pointer', backgroundColor: item.color}}>

                              </div>
                          )
                      })}
                  </div>
                  <div className={'d-flex align-items-center justify-content-center mt-3'}>
                      <button onClick={() => dispatch(setShowModal3(true))} className='btn btn-general ps-3 pe-3'>Change password</button>
                  </div>
              </div>

              <hr/>
              <div className=' footer d-flex justify-content-center align-items-center '>
                  <button onClick={() => logout()} className='btn btn-general ps-3 pe-3'>
                      LOG OUT
                  </button>
              </div>
              <div className="text-center fs-6">
                  <i>
                  Copyright &#169; Nguyen
                  </i>
              </div>
          </div>
          <Modal3
          content={handleUserForgot}
          title={'Change password'}
          />


      </div>
    )
}

export default TopBar