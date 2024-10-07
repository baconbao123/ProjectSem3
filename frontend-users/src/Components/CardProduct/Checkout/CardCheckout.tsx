import React from 'react'
import { Col, Row } from 'react-bootstrap'
import './CardCheckout.scss'

interface CardCheckoutProps {
  product: any
}

const CardCheckout: React.FC<CardCheckoutProps> = ({ product }) => {
  return (
    <Row className='row-card-checkout'>
      <Col lg={1}>
        {/* <img alt='Card' src={product.ProductImage[0]} className='img-card' /> */}
        <img alt='Card' src='https://itbook.store/img/books/9781617291609.png' className='img-card' />
      </Col>
      <Col lg={5} className='name-card-checkout'>
        {product.Name}
      </Col>
      <Col lg={2} className='price-card-checkout' style={{ textAlign: 'center' }}>
        ${product.SellPrice}
      </Col>
      <Col lg={2} className='quantity-card-checkout' style={{ textAlign: 'center' }}>
        {product.quantity}
      </Col>
      <Col lg={2} className='totalPrice-card-checkout' style={{ textAlign: 'center' }}>
        ${parseFloat(product.SellPrice) * (product.quantity)}
      </Col>
    </Row>
  )
}

export default CardCheckout
