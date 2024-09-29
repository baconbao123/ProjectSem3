import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { calculateTotalPrice, sliceText } from '../../../utils'
import './CardProductOrder.scss'
import Product from '../../../Interfaces/Product'

interface CardProductOrderProps {
  product: Product
}

const CardProductOrder: React.FC<CardProductOrderProps> = ({ product }) => {
  return (
    <Row className='row-order-card mt-3'>
      <Col lg={1}>
        <img src={product.ProductImage[0]} alt='' className='img-order' />
      </Col>
      <Col lg={8} className='title'>
        <span>{sliceText(product.Name, 110)}</span>
        {product.SellPrice ? (
          <div>
            <span className='sellPrice'>$ {product.SellPrice}</span> &nbsp;
            <span className='basePrice'>$ {product.BasePrice}</span>
          </div>
        ) : (
          <span className='basePrice1'>$ {product.BasePrice}</span>
        )}
        <span>Quantity: {product.Quantity}</span>
      </Col>
      <Col lg={3} className='total'>
        Total Price: &nbsp;
        {product.SellPrice ? (
          <span style={{ fontWeight: '600' }}>$ {calculateTotalPrice(product.SellPrice, product.Quantity)} </span>
        ) : (
          <span style={{ fontWeight: '600' }}>$ {calculateTotalPrice(product.BasePrice, product.Quantity)} </span>
        )}
      </Col>
    </Row>
  )
}

export default CardProductOrder
