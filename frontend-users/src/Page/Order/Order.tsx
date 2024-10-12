import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import './Order.scss'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../Store/store'
import RequiredLogin from '../../Components/RequiredLogin/RequiredLogin'

const Order: React.FC = () => {
  const location = useLocation()
  const userId = useSelector((state: RootState) => state.auth.userId)

  return (
    <div className='container-order'>
      {userId ? (
        <Container>
          <div className='heading-order'>
            <Row className='row-heading'>
              <Col lg={2}>
                <Link to='/orders' className={`url ${location.pathname === '/orders' ? 'active' : ''}`}>
                  <div className='heading-title'>All Orders</div>
                </Link>
              </Col>
              <Col lg={2}>
                <Link to='/orders/ordered' className={`url ${location.pathname === '/orders/ordered' ? 'active' : ''}`}>
                  <div className='heading-title3'>Ordered</div>
                </Link>
              </Col>
              <Col lg={2}>
                <Link
                  to='/orders/processing'
                  className={`url ${location.pathname === '/orders/processing' ? 'active' : ''}`}
                >
                  <div className='heading-title3'>Processing</div>
                </Link>
              </Col>
              <Col lg={2}>
                <Link
                  to='/orders/completed'
                  className={`url ${location.pathname === '/orders/completed' ? 'active' : ''}`}
                >
                  <div className='heading-title'>Completed</div>
                </Link>
              </Col>
              <Col lg={2}>
                <Link
                  to='/orders/returned'
                  className={`url ${location.pathname === '/orders/returned' ? 'active' : ''}`}
                >
                  <div className='heading-title'>Returned</div>
                </Link>
              </Col>
              <Col lg={2}>
                <Link
                  to='/orders/canceled'
                  className={`url ${location.pathname === '/orders/canceled' ? 'active' : ''}`}
                >
                  <div className='heading-title'>Canceled</div>
                </Link>
              </Col>
            </Row>
          </div>

          <div className='container-outlet'>
            <Outlet></Outlet>
          </div>
        </Container>
      ) : (
        <RequiredLogin />
      )}
    </div>
  )
}

export default Order
