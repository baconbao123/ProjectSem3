import React, {useEffect} from 'react';
import './App.scss';
import {RouterProvider} from "react-router-dom";
import router from "./Router";
import 'bootstrap/dist/css/bootstrap.min.css';
import $axios, {authorization} from "./axios";
import { useDispatch} from 'react-redux';
// @ts-ignore
import Cookies from "js-cookie";
import {setLoading, setShowModal} from "@src/Store/Slinces/appSlice.ts";
import "primereact/resources/themes/lara-light-cyan/theme.css";
const Toast = React.lazy(() => import("./components/Toast"))
const Loading = React.lazy(() => import("./components/Loading"))

const App = () => {

    return (
        <div className="theme-layout">
                <RouterProvider  router={router} />
                <Toast />
                <Loading />
        </div>
    );
}

export  default App;