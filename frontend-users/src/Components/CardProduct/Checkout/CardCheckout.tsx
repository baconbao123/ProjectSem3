import React from 'react'
import { Col, Row } from 'react-bootstrap'
import './CardCheckout.scss'

const CardCheckout: React.FC = () => {
  return (
    <Row className='row-card-checkout'>
      <Col lg={1}>Avatar</Col>
      <Col lg={5} className='name-card-checkout'>
        Name
      </Col>
      <Col lg={2} className='price-card-checkout' style={{ textAlign: 'center' }}>
        $40
      </Col>
      <Col lg={2} className='quantity-card-checkout' style={{ textAlign: 'center' }}>
        1
      </Col>
      <Col lg={2} className='totalPrice-card-checkout' style={{ textAlign: 'center' }}>
        $40
      </Col>
    </Row>
  )
}

export default CardCheckout
