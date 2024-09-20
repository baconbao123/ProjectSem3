import { Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import './Head.scss'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../Store/store'
import Cookies from 'js-cookie'
import { logout } from '../../../Store/authSlice'
import Swal from 'sweetalert2'

export const Head = () => {
  const userId = useSelector((state: RootState) => state.auth.userId)
  const dispatch = useDispatch()

  const handleLogout = async (): Promise<void> => {
    Swal.fire({
      title: 'Confirm logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          Cookies.remove('token')
          Cookies.remove('refreshToken')
          dispatch(logout())
        } catch (error) {
          console.error('Logout failed:', error)
        }
      }
    })
  }

  return (
    <Container>
      <Row className='row-head'>
        <Col lg={3} md={3} sm={4} xs={5}>
          <div className='header-left'>
            <span className='phone'>
              <i className='icon-phone' />
              <span>Call: +0123 456 789</span>
            </span>
          </div>
        </Col>
        <Col lg={7} md={5} sm={3} xs={3}></Col>
        <Col lg={2} md={4} sm={5} xs={4}>
          {userId ? (
            <div className='url'>
              <span className='signIn' onClick={handleLogout}>
                Logout
              </span>
            </div>
          ) : (
            <div>
              <Link to='/login' className='url'>
                <span className='signIn'>Sign in / Sign up</span>
              </Link>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  )
}
