import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from './Components/Login/Login'
import Home from './Page/Home/Home'
import { MainLayouts } from './Page/MainLayouts'
import NotFound from './Components/NotFound/NotFound'
import { StoreSystem } from './Page/StoreSystem/StoreSystem'
import Vouchers from './Page/Vouchers/Vouchers'
import Cart from './Page/Cart/Cart'
import Order from './Page/Order/Order'
import AllOders from './Page/Order/AllOders/AllOders'
import Completed from './Page/Order/Completed/Completed'
import Uncompleted from './Page/Order/Uncompleted/Uncompleted'
import OrderDetails from './Components/CardOrder/OrderActions/OrderDetails/OrderDetails'
import Canceled from './Page/Order/Canceled/Canceled'
import OrderCancel from './Components/CardOrder/OrderActions/OrderCancel/OrderCancel'
import Register from './Components/Register/Register'
import MemberBenefits from './Page/MemberBenefits/MemberBenefits'
import ProductDetail from './Page/ProductDetail/ProductDetail'
import Checkout from './Page/Checkout/Checkout'
import FAQ from './Page/FAQ/FAQ'
import CheckoutCompleted from './Page/Checkout/Compelete/CheckoutCompleted'
import { useSelector } from 'react-redux'
import { RootState } from './Store/store'
import Account from './Page/Accoount/Account'
import CategoryDetail from './Page/Category/CategoryDetail/CategoryDetail'
import Category from './Page/Category/Category'

export const AppRouter: React.FC = () => {
  const userId = useSelector((state: RootState) => state.auth.userId)

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

        {/* Main App */}
        <Route path='/' element={<MainLayouts />}>
          {/* Not found */}
          <Route path='*' element={<NotFound />} />

          {/* Pages */}
          <Route index element={<Navigate to='/home' />} />
          <Route path='home' element={<Home />} />
          <Route path='store' element={<StoreSystem />} />
          <Route path='/:category' element={<Category />} />
          <Route path='/:category/:genres' element={<CategoryDetail />} />
          <Route path='vouchers' element={<Vouchers />} />
          <Route path='member-benefits' element={<MemberBenefits />} />
          {userId && <Route path='account/:id' element={<Account />} />}
          <Route path='checkout/cart' element={<Cart />} />
          {userId && <Route path='checkout' element={<Checkout />} />}
          {userId && <Route path='checkout/compeleted' element={<CheckoutCompleted />} />}
          <Route path='faq' element={<FAQ />} />
          <Route path='products/details/:id' element={<ProductDetail />} />
          <Route path='orders' element={<Order />}>
            <Route index element={<AllOders />} />
            <Route path='completed' element={<Completed />} />
            <Route path='uncompleted' element={<Uncompleted />} />
            <Route path='canceled' element={<Canceled />} />
            <Route path='details/:id' element={<OrderDetails />} />
            <Route path='canceled/:id' element={<OrderCancel />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
