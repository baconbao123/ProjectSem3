import { Col, Container, Row } from 'react-bootstrap'
import 'primeicons/primeicons.css'
import './Navigate.scss'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../../Store/store'
import { Badge } from 'primereact/badge'

export const Navigate = () => {
  const userId = useSelector((state: RootState) => state.auth.userId)
  const cartItem = useSelector((state: RootState) => state.cart.itemCount)

  return (
    <>
      <Container>
        <Row className='row-navigate'>
          {/* Logo */}
          <Col lg={2} md={3} sm={3}>
            <Link to='/home'>
              <img src='/images/Logo.png' style={{ width: '190px', height: '44px' }} />
            </Link>
          </Col>

          {/* Save banner */}
          <Col lg={8} md={3} sm={3}></Col>

          <Col lg={2} md={4} sm={4} className='navi-right'>
            <div className='navi'>
              <Link to='/store' className='url'>
                <div className='storesystem'>
                  <i className='pi pi-shop' style={{ fontSize: '1.7rem' }}></i>
                  <span className='span-text-navi'>Store</span>
                </div>
              </Link>
              <Link to='/orders' className='url'>
                <div className='orders'>
                  <i className='pi pi-box icon' style={{ fontSize: '1.7rem' }}></i>
                  <span className='span-text-navi'>Orders</span>
                </div>
              </Link>
              <Link to='/checkout/cart' className='url'>
                <div className='cart' style={{ position: 'relative' }}>
                  <i className='pi pi-shopping-cart icon' style={{ fontSize: '1.7rem' }}></i>
                  <span className='span-text-navi'>Cart</span>
                  <Badge
                    value={cartItem}
                    severity='success'
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-3px',
                      fontSize: '12px'
                    }}
                  ></Badge>
                </div>
              </Link>

              {userId ? (
                <Link to='/account' className='url'>
                  <div className='account'>
                    <i className='pi pi-user icon' style={{ fontSize: '1.7rem' }}></i>
                    <span className='span-text-navi'>Account</span>
                  </div>
                </Link>
              ) : (
                <Link to='/login' className='url'>
                  <div className='account'>
                    <i className='pi pi-user icon' style={{ fontSize: '1.7rem' }}></i>
                    <span className='span-text-navi'>Login</span>
                  </div>
                </Link>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  )
}