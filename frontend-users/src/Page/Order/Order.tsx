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
              <Col lg={3}>
                <Link to='/orders' className={`url ${location.pathname === '/orders' ? 'active' : ''}`}>
                  <div className='heading-title'>All Orders</div>
                </Link>
              </Col>
              <Col lg={3}>
                <Link
                  to='/orders/uncompleted'
                  className={`url ${location.pathname === '/orders/uncompleted' ? 'active' : ''}`}
                >
                  <div className='heading-title3'>Uncompleted</div>
                </Link>
              </Col>
              <Col lg={3}>
                <Link
                  to='/orders/completed'
                  className={`url ${location.pathname === '/orders/completed' ? 'active' : ''}`}
                >
                  <div className='heading-title'>Completed</div>
                </Link>
              </Col>
              <Col lg={3}>
                <Link
                  to='/orders/canceled'
                  className={`url ${location.pathname === '/orders/canceled' ? 'active' : ''}`}
                >
                  <div className='heading-title'>Cancel</div>
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
