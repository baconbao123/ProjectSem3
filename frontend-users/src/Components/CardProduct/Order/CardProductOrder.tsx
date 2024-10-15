import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { calculateTotalPrice, sliceText } from '../../../utils'
import './CardProductOrder.scss'

interface CardProductOrderProps {
  product: {
    product_name: string
    product_image: string
    base_price: number
    sell_price: number
    quantity: number
  }
}

const CardProductOrder: React.FC<CardProductOrderProps> = ({ product }) => {
  return (
    <Row className='row-order-card mt-3'>
      <Col lg={1}>
        <img src={import.meta.env.VITE_API_BACKEND_PATH + product.product_image} alt='' className='img-order' />
      </Col>
      <Col lg={8} className='title'>
        <span>{sliceText(product.product_name, 110)}</span>
        <span className='sellPrice'>$ {product.sell_price}</span> &nbsp;
        <span>Quantity: {product.quantity}</span>
      </Col>

      <Col lg={3} className='total'>
        Total Price: &nbsp;
        {product.sell_price ? (
          <span style={{ fontWeight: '600' }}>
            $ {calculateTotalPrice(product.sell_price.toString(), product.quantity.toString())}
          </span>
        ) : (
          <span style={{ fontWeight: '600' }}>
            $ {calculateTotalPrice(product.base_price.toString(), product.quantity.toString())}
          </span>
        )}
      </Col>
    </Row>
  )
}

export default CardProductOrder