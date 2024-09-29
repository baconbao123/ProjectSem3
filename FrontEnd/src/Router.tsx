
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

export  default  createBrowserRouter([
    {
        path: '/login',
        element: (<Login />),
        errorElement: (<ErrorPage error="'Error page"/>),
    },
    {
        path: '/*',
        element: (<LayOutAdmin/>),
        children: [
            {
                index: true,  // Đây sẽ là route mặc định khi path là "/"
                element: (<HomePageAdmin />),
                errorElement: (<ErrorPage error="'Error page"/>),
            },
            {
                path: 'resource',
                element: (<ResourceList />),
                errorElement: (<ErrorPage error="'Error page"/>),
            },
            {
                path: 'user',
                element: (<UserList />),
                errorElement: (<ErrorPage error="'Error page"/>),
            },
            {
                path: 'role',
                element: (<RoleList />),
                errorElement: (<ErrorPage error="'Error page"/>),
            },
            {
                path: 'permission',
                element: (<PermissionList />),
                errorElement: (<ErrorPage error="'Error page"/>),
            },
            {
                path: 'category',
                element: (<CategoryList />),
                errorElement: (<ErrorPage error="'Error page"/>),
            },
            {
                path: 'author',
                element: (<AuthorList/>),
                errorElement: (<ErrorPage error="'Error page"/>),
            },
            {
                path: 'company',
                element: (<CompanyList/>),
                errorElement: (<ErrorPage error="'Error page"/>),
            },
            {
                path: 'product',
                element: (<ProductList/>),
                errorElement: (<ErrorPage error="'Error page"/>),
            },
            {
                path: 'about',
                element: (<AboutAdmin />),
                errorElement: (<ErrorPage error="'Error page"/>),
            },
            {
                path: '*',
                element: (<ErrorPage error="404 Not Found"/>),
            },
        ]
    },
])