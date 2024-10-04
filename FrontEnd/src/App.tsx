import React, {useEffect} from 'react';
import './App.scss';
import {RouterProvider} from "react-router-dom";
import router from "./Router";
import 'bootstrap/dist/css/bootstrap.min.css';
import $axios, {authorization} from "./axios";
import {useDispatch, useSelector} from 'react-redux';
// @ts-ignore
import Cookies from "js-cookie";
import {
    setLoading, setPermission,
    setShowModal,
    setUserEmail,
    setUserId,
    setUserName,
    setUserPhone
} from "@src/Store/Slinces/appSlice.ts";
import "primereact/resources/themes/lara-light-cyan/theme.css";
const Toast = React.lazy(() => import("./components/Toast"))
const Loading = React.lazy(() => import("./components/Loading"))

const App = () => {
    const dispatch = useDispatch();
    const checkToken = () => {
        dispatch(setLoading(true))
        $axios.get('/Auth').then(res => {
            if (res.data && res.data.id) {
                dispatch(setUserId(res.data.id))
                localStorage.setItem("id", res.data.id)
            }
            if (res.data && res.data.name) {
                dispatch(setUserName(res.data.name))
                localStorage.setItem("name", res.data.name)
            }
            if (res.data && res.data.email) {
                dispatch(setUserEmail(res.data.email))
                localStorage.setItem("email", res.data.email)
            }
            if (res.data && res.data.phone) {
                dispatch(setUserPhone(res.data.phone))
                localStorage.setItem("phone", res.data.phone)
            }
            if (res.data && res.data.avatar) {
                localStorage.setItem("avatar", res.data.avatar)
            }
            dispatch(setLoading(false))
            getPermission()
        })
            .catch(err => {
                console.log(err)
                dispatch(setLoading(false))
            })

    }
    const getPermission = () => {
        dispatch(setLoading(true))
        const userId = localStorage.getItem('id')
        $axios.get(`Auth/getPermision/${userId}`).then(res => {
            dispatch(setPermission(res.data))
            localStorage.setItem("permission", JSON.stringify(res.data.data))
            dispatch(setLoading(false))
        })
            .catch(err => {
                console.log(err)
                dispatch(setLoading(false))
            })
    }
    useEffect(() => {
        checkToken()
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