
import {createBrowserRouter} from "react-router-dom"
import LayOutAdmin from '@components/LayOutAdmin.tsx'
import Login from '@pages/common/Login.tsx'
import ErrorPage from '@pages/common/ErrorPage.tsx'
import HomePageAdmin from '@pages/admin/HomePage.tsx'
import AboutAdmin from '@pages/admin/About.tsx'
import ResourceList from "@pages/resource/ResourceList.tsx";
import RoleList from "@pages/role/RoleList.tsx";
import PermissionList from "@pages/permission/PermissionList.tsx";
import CategoryList from "@pages/category/CategoryList"
import AuthorList from "@pages/author/AuthorList"
import UserList from "@pages/user/UserList.tsx";
import CompanyList from "@pages/companyparent/ComanyPartnerList"
import ProductList from "@pages/product/ProductList"
import SaleList from "@pages/sale/SaleList"
// import FAQList from "@pages/FAQ/FAQList"

export  default  createBrowserRouter([
    {
        path: '/login',
        element: (<Login />),
        errorElement: (<ErrorPage error="'other"/>),
    },
    {
        path: '/*',
        element: (<LayOutAdmin/>),
        children: [
            {
                index: true,  // Đây sẽ là route mặc định khi path là "/"
                element: (<HomePageAdmin />),
                errorElement: (<ErrorPage error="other"/>),
            },
            {
                path: 'resource',
                element: (<ResourceList />),
                errorElement: (<ErrorPage error="other"/>),
            },
            {
                path: 'user',
                element: (<UserList />),
                errorElement: (<ErrorPage error="other"/>),
            },
            {
                path: 'role',
                element: (<RoleList />),
                errorElement: (<ErrorPage error="other"/>),
            },
            {
                path: 'permission',
                element: (<PermissionList />),
                errorElement: (<ErrorPage error="other"/>),
            },
            {
                path: 'category',
                element: (<CategoryList />),
                errorElement: (<ErrorPage error="other"/>),
            },
            {
                path: 'author',
                element: (<AuthorList/>),
                errorElement: (<ErrorPage error="other"/>),
            },
            {
                path: 'company',
                element: (<CompanyList/>),
                errorElement: (<ErrorPage error="other"/>),
            },
            {
                path: 'discount',
                element: (<SaleList/>),
                errorElement: (<ErrorPage error="other"/>),
            },
            {
                path: 'product',
                element: (<ProductList/>),
                errorElement: (<ErrorPage error="other"/>),
            },
            {
                path: 'about',
                element: (<AboutAdmin />),
                errorElement: (<ErrorPage error="other"/>),
            },
            {
                path: '403',
                element: (<ErrorPage error="403"/>),
            },
            // {
            //     path: 'faq',
            //     element: (<FAQList />),
            //     errorElement: (<ErrorPage error="'Error page"/>),
            // },
            {
                path: '*',
                element: (<ErrorPage error="404"/>),
            },
            {
                path: '500',
                element: (<ErrorPage error="500"/>),
            },
            {
                path: '400',
                element: (<ErrorPage error="400"/>),
            },
        ]
    },
    {
        path: 'error',
        element: (<ErrorPage error="other"/>),
    },
])