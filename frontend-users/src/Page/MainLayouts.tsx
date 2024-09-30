import React from 'react'
import { Header } from '../Components/Header/Header'
import { Footer } from '../Components/Footer/Footer'
import { Outlet } from 'react-router-dom'

// interface MainLayoutProps {
//   children: ReactNode
// }

export const MainLayouts: React.FC = () => {
  return (
    <>
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
    </>
  )
}
