import React, { useEffect, useRef, useState} from "react";
import { Avatar} from "@mui/material";
import { MenuTopBar } from "@components/admin/Menu.ts"
import {Link, useNavigate} from "react-router-dom";
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
// @ts-ignore
import Cookies from "js-cookie"

const TopBar : React.FC = () => {
    const [showRightInfo, setShowRightInfo] = useState(false);
    const navigate = useNavigate();
    const  refInfo = useRef(null);
    const refAvatar = useRef(null);
    const logout = () => {
        try {
            Cookies.remove("token");
            Cookies.remove("refreshToken");
            navigate('/login')
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
        document.addEventListener('mousedown', handleClickOutSideInfo);

        return () => {
            document.removeEventListener('mousedown', handleClickOutSideInfo);
        };
    }, []);
    return (
      <div className="top-bar-admin container-fluid ">
          <div className="row top-bar-contanier ">
              <div className="col-2 top-bar-item justify-content-center">
                 <h1>LOGO</h1>
              </div>
              <div className="col-8 top-bar-item menu">
                  {
                      MenuTopBar.map(item => {
                          const IconComponent = item.icon;
                          return (
                              <Link to={item.link} style={{ textDecoration: 'none', color: 'inherit' }} key={item.link}>
                                  <IconComponent style={{ marginRight: '8px' }} />
                                  <div >
                                    {item.title}
                                  </div>
                              </Link>
                          )
                      })
                  }
              </div>
              <div className="col-2 justify-content-end top-bar-item">
                  <div  ref={refAvatar} className='d-flex align-items-center gap-2 top-bar-item-info' onClick={() => setShowRightInfo(!showRightInfo)}>
                      Truong Trung Nguyen
                    <Avatar>N</Avatar>
                  </div>
              </div>
          </div>
          <div ref={refInfo} className={'top-bar-content-left  ' + (showRightInfo ? 'show' : '')}>
              <div className="header">
                  <div className=' mt-2 d-flex justify-content-center '>
                      <Avatar sx={{width: 100, height: 100}}>N</Avatar>
                  </div>
                  <div className=' mt-2 d-flex justify-content-center'>
                      <div>Truong Trung Nguyen</div>
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