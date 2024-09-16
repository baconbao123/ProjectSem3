import React, { ReactNode } from 'react'
import { Header } from '../Components/Header/Header'
import { Footer } from '../Components/Footer/Footer'

interface MainLayoutProps {
  children: ReactNode
}

export const MainLayouts: React.FC<MainLayoutProps> = ({children}) => {
  return (
    <>
        <Header />
        {children}
        <Footer />
    </>
  )
}
