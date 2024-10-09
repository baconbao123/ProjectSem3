import { Menu } from './Menu/Menu'
import { Navigate } from './Navigate/Navigate'
import './Header.scss'

export const Header = () => {
  return (
    <div className='header-master'>
      <Navigate />
      <Menu />
    </div>
  )
}
