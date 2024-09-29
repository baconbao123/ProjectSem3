import { Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import './Head.scss'
import { useSelector } from 'react-redux'
import { RootState } from '../../../Store/store'
import Cookies from 'js-cookie'
import Swal from 'sweetalert2'

export const Head = () => {
  const userId = useSelector((state: RootState) => state.auth.userId)

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

          window.location.reload()
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
        {userId ? (
          <>
            <Col lg={8} md={5} sm={3} xs={3}></Col>
            <Col lg={1} md={4} sm={5} xs={4}>
              <div className='content'>
                <Link to='/faq' className='url'>
                  <span className='signIn'>FAQ</span>
                </Link>
                <span className='signIn' onClick={handleLogout}>
                  LOGOUT
                </span>
              </div>
            </Col>
          </>
        ) : (
          <>
            <Col lg={7} md={5} sm={3} xs={3}></Col>
            <Col lg={2} md={4} sm={5} xs={4}>
              <div className='content'>
                <Link to='/faq' className='url'>
                  <span className='signIn'>FAQ</span>
                </Link>
                <Link to='/login' className='url'>
                  <span className='signIn'>SIGN IN / SIGN UP</span>
                </Link>
              </div>
            </Col>
          </>
        )}
      </Row>
    </Container>
  )
}
