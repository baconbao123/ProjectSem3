import React, { useState } from 'react'
import './Checkout.scss'
import { Col, Container, Row } from 'react-bootstrap'
import { IoLocationSharp } from 'react-icons/io5'
import CardCheckout from '../../Components/CardProduct/Checkout/CardCheckout'
import { BiSolidDiscount } from 'react-icons/bi'
import { Button } from 'primereact/button'
import { Link } from 'react-router-dom'

const Checkout: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState<string>('Paypal')

  return (
    <div className='conatiner-checkout-products'>
      <Container className='container-checkout-content'>
        <Row className='row-checkout'>
          <span>PAYMENT</span>
        </Row>

        <Row className='row-address'>
          <div className='row-address-1'>
            <div className='div-address-heading'>
              <IoLocationSharp className='icon' />
              <span>Delivery Address</span>
            </div>
            <div className='div-address-change'>
              <span>Change</span>
            </div>
          </div>
          <div className='row-address-content'>
            <Row>
              <Col lg={3}>
                <span className='name'>Phương Anh</span> &nbsp;
              </Col>
              <Col lg={2}>
                <span className='phone'>098765432112</span>
              </Col>
              <Col lg={7}>
                <span className='address'>474/2, Nguyễn Văn Công, Phường 3, Quận Gò Vấp, TP. Hồ Chí Minh</span>
              </Col>
            </Row>
          </div>
        </Row>

        <Row className='row-products'>
          <div className='row-heading'>
            <Row>
              <Col lg={6} className='product-title'>
                Products
              </Col>
              <Col lg={2} className='price'>
                Price
              </Col>
              <Col lg={2} className='quantity'>
                Quantity
              </Col>
              <Col lg={2} className='total'>
                Total
              </Col>
            </Row>
            <Row style={{ marginTop: '20px' }}>
              <CardCheckout />
            </Row>
          </div>
        </Row>

        <Row className='row-voucher'>
          <div className='heading-content'>
            <div className='row-heading-content'>
              <BiSolidDiscount className='icon' /> &nbsp;
              <span>Voucher</span>
            </div>
            <div className='row-heading-voucher'>Select Voucher</div>
          </div>
          <div style={{ padding: '10px 20px' }}>
            <Row>
              <Col lg={7}></Col>
              <Col lg={5}>Voucher</Col>
            </Row>
          </div>
        </Row>

        <Row className='row-payment-method'>
          <div className='payment-method-heading'>
            <span>Payment Method</span>
          </div>

          <div style={{ marginLeft: '20px' }}>
            <div className='div-cod'>
              <input
                type='radio'
                className='radio'
                name='paymentMethod'
                value='COD'
                onChange={(e: any) => setPaymentMethod(e.value)}
                checked
              />{' '}
              &nbsp; &nbsp; <span>Cash On Delivery</span>
            </div>

            <div className='div-paypal' style={{ marginTop: '10px' }}>
              <input
                type='radio'
                className='radio'
                name='paymentMethod'
                value='Paypal'
                onChange={(e: any) => setPaymentMethod(e.value)}
              />{' '}
              &nbsp; &nbsp;
              <span>Paypal</span>
            </div>
          </div>
        </Row>

        <Row className='row-bill'>
          <div className='heading-content'>
            <span>Payment</span>
          </div>
          <div className='row-bill-content'>
            <Row>
              <Col lg={6}></Col>
              <Col lg={6}>
                <div className='bill-content'>
                  <span>Total Order</span>
                  <span>$ 123</span>
                </div>
                <div className='bill-content-bottom'>
                  <span>Total Order</span>
                  <span>$ 123</span>
                </div>
                <div className='btn-payment'>
                  <Link to="/checkout/compeleted">
                    <Button label='Payment' className='btn-pay' />
                  </Link>
                </div>
              </Col>
            </Row>
          </div>
        </Row>
      </Container>
    </div>
  )
}

export default Checkout
