import { Button } from 'primereact/button'
import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import './OrderActions.scss'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { calculateTotalOrderPrice } from '../../../utils'
import { useDispatch } from 'react-redux'
import { addProductsToCart } from '../../../Store/cartSlice'
import { $axios } from '../../../axios'

export interface CardOrderProps {
  order: {
    id: number
    user_id: number
    user_name: string
    base_price: string
    total_price: string
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
const OrderActions: React.FC<CardOrderProps> = ({ order }) => {
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleBuyAgain = async () => {
    if (order.products && order.products.length > 0) {
      try {
        const productIds = order.products.map((product) => product.product_id)

        const productPromises = productIds.map((id) => $axios.get(`ProductFE/${id}`))
        const productResponses = await Promise.all(productPromises)

        const products = productResponses.map((response) => {
          const productData = response.data.data[0]
          if (productData) {
            return productData
          } else {
            throw new Error('Invalid product data response')
          }
        })

        dispatch(addProductsToCart(products))
        navigate('/checkout/cart')
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    } else {
      console.warn('No products found in order to buy again.')
    }
  }

  const totalOrderPrice =
    order.products && order.products.length > 0 ? calculateTotalOrderPrice(order.products).toFixed(2) : '0.00'

  return (
    <Container>
      <Row>
        <Col lg={4} className='col-orderAction'>
          {/* COMPLETED */}
          <Button label='Buy Again' className='btn-action' onClick={handleBuyAgain} /> &nbsp;
          {/* More */}
          {location.pathname !== `/orders/details/${order.id}` && (
            <Link to={`/orders/details/${order.id}`} className='btn-action-more'>
              More
            </Link>
          )}
        </Col>
        <Col lg={5}></Col>
        <Col lg={3} className='total-order'>
          Total Order Price: &nbsp;
          <span style={{ fontWeight: '600' }}>$ {totalOrderPrice}</span>
        </Col>
      </Row>
    </Container>
  )
}

export default OrderActions
