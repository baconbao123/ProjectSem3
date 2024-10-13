import React, {useEffect, useState} from 'react';
import './App.scss';
import {RouterProvider} from "react-router-dom";
import router from "./Router";
import 'bootstrap/dist/css/bootstrap.min.css';
import $axios, {authorization} from "./axios";
import {useDispatch, useSelector} from 'react-redux';
// @ts-ignore
import Cookies from "js-cookie";
import {setDefaultColor, setLoading, setShowMenu, setTheme} from "@src/Store/Slinces/appSlice.ts";


const Toast = React.lazy(() => import("./components/Toast"))
const Loading = React.lazy(() => import("./components/Loading"))

const App = () => {
    const theme = useSelector((state: any) => state.app.theme)
    const defaultColor = useSelector((state: any) => state.app.defaultColor)

    const dispatch = useDispatch();
    const initUserData = async () => {
        try {
            // Kiểm tra token
            const res = await $axios.get('/Auth');
            const userData = res.data;

            if (userData && userData.id) {
                // Lưu thông tin người dùng vào localStorage
                const { id, name, email, phone, avatar } = userData;
                localStorage.setItem("id", id);
                if (name) localStorage.setItem("name", name);
                if (email) localStorage.setItem("email", email);
                if (phone) localStorage.setItem("phone", phone);
                if (avatar) localStorage.setItem("avatar", avatar);

                // Lấy quyền của người dùng
                const permissionRes = await $axios.get(`/Auth/getPermision/${id}`);
                const permissions = permissionRes.data.data;

                    // Lưu quyền vào localStorage
                localStorage.setItem("permission", JSON.stringify(permissions));
                if (!localStorage.getItem('init')) {
                    location.reload()
                    localStorage.setItem('init', 'init')
                }
                else {
                    dispatch(setLoading(false))
                }
            }
        } catch (error) {
            console.error('Error during user data initialization:', error);
        }
    }
    useEffect( () => {
        if(window.location.pathname  !== '/login') {
            initUserData()
        }
        if (localStorage.getItem('theme')) {
            dispatch(setTheme(localStorage.getItem('theme')))
        }
        if (localStorage.getItem('default-color')) {
            dispatch(setDefaultColor(localStorage.getItem('default-color')))
        }
        if (localStorage.getItem('showMenu')) {
            dispatch(setShowMenu(localStorage.getItem('showMenu') == 1 ? true : false))
        }
    }, []);
    useEffect(() => {
        document.documentElement.style.setProperty('--default-color', defaultColor);

    }, [defaultColor]);
    return (
        <div className="theme-layout">
            <link
                id="theme-link"
                rel="stylesheet"
                href={`https://cdn.jsdelivr.net/npm/primereact/resources/themes/${theme}/theme.css`}
            />
            <RouterProvider router={router}/>
            <Toast/>
            <Loading/>
        </div>
    );
}

export default App;