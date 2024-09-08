
import {createBrowserRouter} from "react-router-dom"
import Base1 from './components/Base1'
import LayOutAdmin from '@components/LayOutAdmin.tsx'
import Login from '@pages/common/Login.tsx'
import ErrorPage from '@pages/common/ErrorPage.tsx'
import HomePageAdmin from '@pages/admin/HomePage.tsx'
import AboutAdmin from '@pages/admin/About.tsx'
import HomePageUser from '@pages/user/HomePage.tsx'

export  default  createBrowserRouter([
    {
        path: 'base1',
        element: (<Base1 />)
    },
    {
        path: '/login',
        element: (<Login />),
        errorElement: (<ErrorPage error="'Error page"/>),
    },
    {
        path: '/admin',
        element: (<LayOutAdmin/>),
        errorElement: (<ErrorPage error="'Error page"/>),
        children: [
            {
                index: true,  // Đây sẽ là route mặc định khi path là "/"
                element: (<HomePageAdmin />)
            },
            {
                path: 'about',
                element: (<AboutAdmin />)
            },
        ]
    },
    {
        path: '/',
        element: (<HomePageUser/>),
        errorElement: (<ErrorPage error="'Error page"/>),

    },
    {
        path: '/*',
        element:  (<ErrorPage  error="'Not Found"/>),
    }
])