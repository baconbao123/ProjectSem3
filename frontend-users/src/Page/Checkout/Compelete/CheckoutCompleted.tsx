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
    <div className='checkout-completed-master' style={{ height: '100vh' }}>
      {userId ? (
        <div className='checkout-completed'>
          <Container style={{ display: 'flex', justifyContent: 'center' }}>
            <img src='/images/comfirm-checkout.png' style={{ height: '400px', width: '400px' }} />
            <div className='content-checkout-completed'>
              <h1>Order Confirmation Successful</h1>
              <Link to='/orders' className='btn-view-order'>
                View Order Details
              </Link>
            </div>
          </Container>
        </div>
      ) : (
        <RequiredLogin />
      )}
    </div>
  )
}

export default CheckoutCompleted
