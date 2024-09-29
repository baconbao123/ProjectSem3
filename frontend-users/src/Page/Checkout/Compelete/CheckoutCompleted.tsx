import React from 'react';
import './CheckoutCompleted.scss';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CheckoutCompleted: React.FC = () => {
  const orderNumber = '123456'; // Example order number

  return (
    <div className='checkout-completed'>
      <Container>
        <h1>Order Confirmation Successful</h1>
        <p className='order-number'>
          Order Number: <strong>{orderNumber}</strong>
        </p>
        <Link to='/orders' className='btn-view-order'>
          View Order Details
        </Link>
      </Container>
    </div>
  );
}

export default CheckoutCompleted;
