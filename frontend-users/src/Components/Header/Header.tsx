import { Menu } from './Menu/Menu'
import { Navigate } from './Navigate/Navigate'
import './Header.scss'
import { useEffect, useState } from 'react'

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)

  const handleScroll = () => {
    if (window.scrollY > 100) {
      setIsScrolled(true)
    } else {
      setIsScrolled(false)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className={`header-master ${isScrolled ? 'scrolled' : ''}`}>
      <Navigate />
      <Menu />
    </div>
  )
}