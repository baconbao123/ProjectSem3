import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from './Components/Login/Login'
import Home from './Page/Home/Home'
import { MainLayouts } from './Page/MainLayouts'
import NotFound from './Page/NotFound/NotFound'
import { StoreSystem } from './Page/StoreSystem/StoreSystem'
import AllProduct from './Page/AllProduct/AllProduct'

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to='/home' />} />
        <Route
          path='/home'
          element={
            <MainLayouts>
              <Home />{' '}
            </MainLayouts>
          }
        />
        <Route path='/login' element={<Login />} />
        <Route path='*' element={<MainLayouts><NotFound /></MainLayouts>} />
        <Route path='/store' element={<MainLayouts><StoreSystem /></MainLayouts>} />
        <Route path='/all-products' element={<MainLayouts><AllProduct /></MainLayouts>} />



      </Routes>
    </BrowserRouter>
  )
}
