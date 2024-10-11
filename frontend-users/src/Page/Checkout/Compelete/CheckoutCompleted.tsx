import React from 'react'
import './CheckoutCompleted.scss'
import { Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../../Store/store'
import RequiredLogin from '../../../Components/RequiredLogin/RequiredLogin'

const CheckoutCompleted: React.FC = () => {
  const userId = useSelector((state: RootState) => state.auth.userId)

  return (
    <>
      {userId ? (
        <div className='checkout-completed'>
          <Container>
            <h1>Order Confirmation Successful</h1>
            <Link to='/orders' className='btn-view-order'>
              View Order Details
            </Link>
          </Container>
        </div>
      ) : (
        <RequiredLogin />
      )}
    </>
  )
}

export default CheckoutCompleted
