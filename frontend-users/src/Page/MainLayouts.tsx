import React from 'react'
import { Header } from '../Components/Header/Header'
import { Footer } from '../Components/Footer/Footer'
import { Outlet } from 'react-router-dom'

export const MainLayouts: React.FC = () => {
  return (
    <>
        <Header />
        <main style={{ marginTop: '97px'}}>
          <Outlet />
        </main>
        <Footer />
    </>
  )
}
