import React from 'react'
import { Container, Row } from 'react-bootstrap'
import OrderActions from './OrderActions/OrderActions'
import CardProductOrder from '../CardProduct/Order/CardProductOrder'
import './CardOrder.scss'

export interface CardOrderProps {
  order: {
    id: number
    user_id: number
    user_name: string
    base_price: string
    total_price: string
    order_code?: string
    code: string
    status: number
    products: {
      product_code: string
      product_id: number
      product_name: string
      product_image: string
      base_price: string
      sell_price: string
      quantity: number
    }[]
  }
}
const CardOrder: React.FC<CardOrderProps> = ({ order }) => {
  console.log('order', order)

  return (
    <>
      <div className='container-card'>
        <div className='heading-orders'>
          <span className='orderId'>ORDER CODE: {order.order_code}</span> &nbsp; | &nbsp;
          <span className='status'>
            {order.status === 1
              ? 'ORDERED'
              : order.status === 2
                ? 'PROCESSING'
                : order.status === 3
                  ? 'COMPLETED'
                  : 'RETURNED'}
          </span>
        </div>
        <div className='conatiner-items-order'>
          <Container>
            {order.products &&
              order.products.length > 0 &&
              order.products.map((p: any, index: any) => (
                <Row key={index}>
                  <CardProductOrder product={p} />
                </Row>
              ))}
          </Container>
        </div>
      </div>
      <div className='container-orderActions'>
        <Row>
          <OrderActions order={order} />
        </Row>
      </div>
    </>
  )
}

export default CardOrder
