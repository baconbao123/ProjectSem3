import axios from "axios"
//  @ts-ignore
import Cookies from "js-cookie"
const $axios = axios.create({
    baseURL: import.meta.env.VITE_REACT_APP_BACK_END_LINK,
    headers: {
        'Authorization': "Bearer "+ Cookies.get("token") ? Cookies.get("token") : "",
    }
})

const authorization = (token: any) => {
    return {Authorization: "Bearer " + token}

}
export {
    authorization
}
export default $axios