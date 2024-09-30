import { Button } from 'primereact/button'
import React, { useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { Dialog } from 'primereact/dialog'
import { Rating, RatingChangeEvent } from 'primereact/rating'
import { Order } from '../../../Interfaces/Order'
import CardProductOrder from '../../CardProduct/Order/CardProductOrder'
import './OrderActions.scss'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { calculateTotalOrderPrice } from '../../../utils'
import { useDispatch } from 'react-redux'
import { addProductsToCart } from '../../../Store/cartSlice'

export interface CardOrderProps {
  order: Order
}

const OrderActions: React.FC<CardOrderProps> = ({ order }) => {
  const [rateVisible, setRateVisible] = useState<boolean>(false)
  const [rating, setRating] = useState<number | undefined>(0)
  const [isRated, setIsRated] = useState<boolean>(false)

  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleBuyAgain = () => {
    if (order.Products && order.Products.length > 0) {
      dispatch(addProductsToCart(order.Products))
      navigate('/checkout/cart')
    }
  }

  const handleConfirmRate = () => {
    setRateVisible(false)
    setIsRated(true)
  }

  const footerContent = (
    <div>
      <Button className='bntReturn' label='Return' onClick={() => setRateVisible(false)} /> &nbsp;
      <Button label='Confirm' onClick={handleConfirmRate} />
    </div>
  )

  const handleRating = (e: RatingChangeEvent) => {
    setRating(e.value !== null ? e.value : undefined)
  }

  return (
    <Container>
      <Row>
        <Col lg={4} className='col-orderAction'>
          {/* COMPLETED */}
          {order.status === 'COMPLETED' ? (
            <>
              {/* Btn Rate */}
              <Button
                label='Rate'
                className='btn-action-rate'
                onClick={() => setRateVisible(!rateVisible)}
                disabled={isRated}
              />{' '}
              &nbsp;
              {rateVisible && (
                <Dialog
                  header={`ORDERED ID: ${order.idOrder}`}
                  visible={rateVisible}
                  style={{ width: '50vw' }}
                  onHide={() => {
                    if (!rateVisible) return
                    setRateVisible(false)
                  }}
                  footer={footerContent}
                >
                  <div className='h1Rating'>RATING</div>
                  <Rating className='large-rating' value={rating} onChange={handleRating} cancel={false} />
                  {order.Products.map((p) => (
                    <CardProductOrder product={p} />
                  ))}
                </Dialog>
              )}
              {/* Btn Buy Again */}
              <Button label='Buy Again' className='btn-action' onClick={handleBuyAgain} /> &nbsp;
              {/* More */}
              {location.pathname !== `/orders/details/${order.idOrder}` && (
                <Link to={`/orders/details/${order.idOrder}`} className='btn-action-more'>
                  More
                </Link>
              )}
            </>
          ) : order.status === 'CANCELED' ? (
            <>
              {/* CANCELED */}
              {/* Btn Buy Again */}
              <Button label='Buy Again' className='btn-action' onClick={handleBuyAgain} /> &nbsp;
              {/* More */}
              {location.pathname !== `/orders/details/${order.idOrder}` && (
                <Link to={`/orders/canceled/${order.idOrder}`} className='btn-action-more'>
                  More
                </Link>
              )}
            </>
          ) : (
            <>
              {/* UNCOMPLETED */}
              {/* Btn Rate */}
              <Button label='Rate' className='btn-action-rate' disabled /> &nbsp;
              {/* Btn Buy Again */}
              <Button label='Buy Again' className='btn-action' onClick={handleBuyAgain} /> &nbsp;
              {/* More */}
              {location.pathname !== `/orders/details/${order.idOrder}` && (
                <Link to={`/orders/details/${order.idOrder}`} className='btn-action-more'>
                  More
                </Link>
              )}
            </>
          )}
        </Col>
        <Col lg={6}></Col>
        <Col lg={2} className='total-order'>
          Total Order Price: &nbsp;
          <span style={{ fontWeight: '600' }}>$ {calculateTotalOrderPrice(order.Products).toFixed(2)}</span>
        </Col>
      </Row>
    </Container>
  )
}

export default OrderActions
