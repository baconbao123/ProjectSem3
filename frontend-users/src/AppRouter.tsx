import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from './Components/Login/Login'
import Home from './Page/Home/Home'
import { MainLayouts } from './Page/MainLayouts'
import NotFound from './Page/NotFound/NotFound'
import { StoreSystem } from './Page/StoreSystem/StoreSystem'
import AllProduct from './Page/AllProduct/AllProduct'
import Vouchers from './Page/Vouchers/Vouchers'
import Cart from './Page/Cart/Cart'
import Order from './Page/Order/Order'

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />

        <Route path='/' element={<MainLayouts />}>
          <Route path='/' element={<Navigate to='/home' />} />
          <Route path='*' element={<NotFound />} />
          <Route path='/home' element={<Home />} />
          <Route path='/store' element={<StoreSystem />} />
          <Route path='/all-products' element={<AllProduct />} />
          <Route path='/vouchers' element={<Vouchers />} />
          <Route path='/checkout/cart' element={<Cart />}/>
          <Route path='/orders' element={<Order />}/>

        </Route>
      </Routes>
    </BrowserRouter>
  )
}
