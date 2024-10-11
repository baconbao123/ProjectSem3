import React, {useEffect} from 'react';
import './App.scss';
import {RouterProvider} from "react-router-dom";
import router from "./Router";
import 'bootstrap/dist/css/bootstrap.min.css';
import $axios, {authorization} from "./axios";
import {useDispatch, useSelector} from 'react-redux';
// @ts-ignore
import Cookies from "js-cookie";

import "primereact/resources/themes/lara-light-cyan/theme.css";
const Toast = React.lazy(() => import("./components/Toast"))
const Loading = React.lazy(() => import("./components/Loading"))

const App = () => {
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

                if (permissions) {
                    // Lưu quyền vào localStorage
                    localStorage.setItem("permission", JSON.stringify(permissions));
                }
                location.reload()
            }
        } catch (error) {
            console.error('Error during user data initialization:', error);
        }
    }
    useEffect( () => {
        if(!localStorage.getItem('id')  && window.location.pathname  !== '/login') {
            initUserData()
        }
    }, []);
    return (
        <div className="theme-layout">
                <RouterProvider  router={router} />
                <Toast />
                <Loading />
        </div>
    );
}

export  default App;