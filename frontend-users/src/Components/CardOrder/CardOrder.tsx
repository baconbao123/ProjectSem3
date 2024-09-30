import React from 'react'
import { Container, Row } from 'react-bootstrap'
import OrderActions from './OrderActions/OrderActions'
import { Order } from '../../Interfaces/Order'
import './CardOrder.scss'
import CardProductOrder from '../CardProduct/Order/CardProductOrder'

export interface CardOrderProps {
  order: Order
}

const CardOrder: React.FC<CardOrderProps> = ({ order }) => {
  
  return (
    <>
      <div className='container-card'>
        <div className='heading-orders'>
          <span className='orderId'>ORDER ID: {order.idOrder}</span> &nbsp; | &nbsp;
          <span className='status'>{order.status}</span>
        </div>
        <div className='conatiner-items-order'>
          <Container>
            {order.Products.slice(0, 1).map((p, index) => (
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
