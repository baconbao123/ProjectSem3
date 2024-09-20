import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import './Order.scss'
import { Outlet } from 'react-router-dom'

const Order: React.FC = () => {
  return (
    <div className='container-order'>
      <Container>
        <div className='heading'>
          <Row className='row-heading'>
            <Col lg={4}>
              <div className='heading-title'>All Orders</div>
            </Col>
            <Col lg={4}>
              <div className='heading-title'>Completed</div>
            </Col>
            <Col lg={4}>
              <div className='heading-title3'>Cancel</div>
            </Col>
          </Row>
        </div>

        <div className='container-outlet'>
          <Outlet></Outlet>
        </div>
      </Container>
    </div>
  )
}

export default Order
