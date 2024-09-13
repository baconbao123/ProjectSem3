import { Head } from './Head/Head'
import { Menu } from './Menu/Menu'
import { Navigate } from './Navigate/Navigate'

export const Header = () => {
  return (
    <>
      <Head />
      <Navigate />
      <Menu />
    </>
  )
}
