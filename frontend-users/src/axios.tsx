import axios from "axios";
import Cookies from "js-cookie"

export const $axios = axios.create({
    baseURL: import.meta.env.VITE_API_BACKEND,
    headers: {
        'Authorization': 'Bearer ' + Cookies.get('token') ? Cookies.get('tooken') : ''
    }
})

export const authorization = (token: any) => {
    return { Authorization: "Bearer " + token }
}