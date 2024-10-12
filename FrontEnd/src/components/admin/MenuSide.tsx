import React, { useEffect} from "react";
import {MenuSideBar} from '@components/admin/Nav.ts'
import {Link, useLocation} from "react-router-dom";
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import MenuOpenOutlinedIcon from '@mui/icons-material/MenuOpenOutlined';
import {useDispatch, useSelector} from "react-redux";
import {setShowMenu} from "@src/Store/Slinces/appSlice.ts";
import {Tooltip} from "@mui/material";
import {checkPermission} from "@src/Service/common.ts";

const MenuSide : React.FC = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const showMenu = useSelector((state: any) => state.app.showMenu);
    useEffect(() => {
        console.log("check location", location)
    }, []);
    return (
      <div className={showMenu ? 'menu-side-admin show-menu' : 'menu-side-admin'}>
          <div className="menu-container">
              {MenuSideBar.map(item => {
                  const IconComponent = item.icon;
                  if (!item.hide && checkPermission(item.code,'read')) {
                      return (
                        <Link   to={item.link} style={{ textDecoration: 'none', color: 'inherit' }} key={item.code}>
                            <Tooltip title={item.title}   placement="right" disableHoverListener={showMenu}>
                              <div className={(location.pathname == item.link) ? 'menu-item active': 'menu-item'}>
                                <IconComponent className="menu-icon"/>
                                <div className="menu-title"> {item.title}</div>
                              </div>
                            </Tooltip>
                        </Link>
                      )
                  }
              })}
          </div>
          <div className='bottom-menu' onClick={() =>  {
              dispatch(setShowMenu(!showMenu))
              localStorage.setItem('showMenu', showMenu ? 0 : 1)
          }}>
              <MenuOutlinedIcon className={showMenu ? 'd-none' : ''}/>
              <MenuOpenOutlinedIcon className={!showMenu ? 'd-none' : ''} />
          </div>
      </div>
    )
}

export default MenuSide