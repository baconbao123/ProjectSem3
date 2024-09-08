import React, {useEffect} from 'react';
import './App.scss';
import {RouterProvider} from "react-router-dom";
import router from "./Router";
import 'bootstrap/dist/css/bootstrap.min.css';
import $axios, {authorization} from "./axios";
import { useDispatch} from 'react-redux';
// @ts-ignore
import Cookies from "js-cookie";
import {setLoading} from "@src/Store/Slinces/appSlice.ts";
const Toast = React.lazy(() => import("./components/Toast"))
const Loading = React.lazy(() => import("./components/Loading"))

const App = () => {
    const dispatch = useDispatch();
    const currentPath = window.location.pathname;

    const checkToken = () => {
        dispatch(setLoading(true))
        if (Cookies.get("token") || Cookies.get("refreshToken")) {
            const token = Cookies.get("token")
            $axios.get('/Auth',{headers: authorization(token)} ).then((res) => {
                console.log('Check res ', res)
                if (res.status !== 200 && res.status !== 401) {
                        window.location.href = '/login'
                }
                else {
                    if (currentPath === '/login') {
                        window.location.href = '/'
                    }
                }
            })
                .catch((err) => {
                    if ( err.response.status === 401){
                     refreshToken()
                    }
                    console.log("Error ", err)
                }).then(() => {
            })
            dispatch(setLoading(false))

        }
        else  {
            if (currentPath !== '/login') {
                window.location.href = '/login'

            }
        }
        dispatch(setLoading(false))

    }

    const refreshToken = () => {
        if (Cookies.get("refreshToken")) {
            $axios.post('/Auth/refreshToken', {
                refreshToken: Cookies.get("refreshToken"),
                publicKey: "mynameisnguyen"
            } )
                .then((res) => {
                    Cookies.set("token", res.data.token, {expires: 0.1});
                    Cookies.set('refreshToken', res.data.refreshToken, { expires: 7 });
                    return true
                })
                .catch((err) => {
                    if (currentPath !== '/login') {
                        window.location.href = '/login'
                    }
                    console.log("Error ", err)
                    return false
                })
        }
        return false
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