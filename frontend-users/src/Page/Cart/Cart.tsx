import React, { useEffect, useState } from 'react'
import './Cart.scss'
import { Col, Container, Row } from 'react-bootstrap'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import CardVoucher, { CardVoucherProps } from '../../Components/CardVoucher/CardVoucher'
import axios from 'axios'
import CardVoucherCheckout from '../../Components/CardVoucherCheckout/CardVoucherCheckout'

const initProduct = [
  {
    image: 'https://itbook.store/img/books/9781484206485.png',
    name: 'Practical MongoDB Part 1 Practical MongoDB Part 1',
    basePrice: 12,
    sellPrice: 10
  },
  {
    image: 'https://itbook.store/img/books/9781484206485.png',
    name: 'Practical MongoDB Part 1 Practical MongoDB Part 1',
    basePrice: 12,
    sellPrice: 10
  },
  {
    image: 'https://itbook.store/img/books/9781484206485.png',
    name: 'Practical MongoDB Part 1 Practical MongoDB Part 1',
    basePrice: 12,
    sellPrice: 10
  },
  {
    image: 'https://itbook.store/img/books/9781484206485.png',
    name: 'Practical MongoDB Part 1 Practical MongoDB Part 1',
    basePrice: 12,
    sellPrice: 10
  },
  {
    image: 'https://itbook.store/img/books/9781484206485.png',
    name: 'Practical MongoDB Part 1 Practical MongoDB Part 1',
    basePrice: 12,
    sellPrice: 10
  },
  {
    image: 'https://itbook.store/img/books/9781484206485.png',
    name: 'Practical MongoDB Part 1 Practical MongoDB Part 1',
    basePrice: 12,
    sellPrice: 10
  }
]

function sliceText(text: string) {
  return text.length > 90 ? text.slice(0, 90) + '...' : text
}

const Cart: React.FC = () => {
  const [vouchers, setVouchers] = useState<CardVoucherProps[]>([])
  const [dialogVoucher, setDialogVoucher] = useState<boolean>(false)

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const res = await axios.get('https://bookstore123.free.mockoapp.net/vouchers')
        setVouchers(res.data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchVouchers()
  }, [])
  return (
    <div className='cart-container'>
      <Container>
        {/* Heading */}
        <Row className='row-heading'>
          <Col lg={4}>
            CART <span className='item'>(5 items)</span>
          </Col>
        </Row>

        {/* Content */}
        <Row>
          {/* Container Left */}
          <Col lg={8}>
            {/* Row select */}
            <Row className='row-select'>
              <Col lg={8} style={{ display: 'flex', alignItems: 'center' }}>
                <input type='checkbox' className='check-items' />
                <span className='span-select'>Select All (5 items)</span>
              </Col>
              <Col lg={2} style={{ display: 'flex', justifyContent: 'center' }}>
                <span className='span-amount'>Total Amount</span>
              </Col>
              <Col lg={1} style={{ display: 'flex', justifyContent: 'center' }}>
                <span className='span-total'>Price</span>
              </Col>
              <Col lg={1}></Col>
            </Row>

            {/* Container items */}
            <Row className='container-item'>
              {initProduct.map((p, index) => (
                <Row
                  key={index}
                  className='row-item'
                >
                  <Col lg={3}>
                    <div className='div-left'>
                      <input type='checkbox' className='check-items' />
                      <img src={p.image} className='img-card' />
                    </div>
                  </Col>
                  <Col lg={5} className='content-books'>
                    <span className='title'>{sliceText(p.name)}</span>
                    <div className='card-price'>
                      <span className='sell-price'>$ {p.sellPrice}</span>
                      <span className='base-price'>$ {p.basePrice}</span>
                    </div>
                  </Col>
                  <Col lg={2} className='container-amount'>
                    <div className='counter-amount'>
                      <span className='sign'>-</span>
                      <span>1</span>
                      <span className='sign'>+</span>
                    </div>
                  </Col>
                  <Col lg={1} className='container-price'>
                    <span className='span-price'>$ 123</span>
                  </Col>
                  <Col lg={1} className='container-trash'>
                    <i className='pi pi-trash' />
                  </Col>
                </Row>
              ))}
            </Row>
          </Col>

          {/* Container Right */}
          <Col lg={4}>
            <div className='container-right'>
              <Row className='row-voucher'>
                <div className='select-voucher'>
                  <span className='span-select'>Select Voucher</span>
                  <Button label='Select' className='btn-select' onClick={() => setDialogVoucher(!dialogVoucher)} />
                  <Dialog
                    header='Select Voucher'
                    visible={dialogVoucher}
                    onHide={() => {
                      if (!dialogVoucher) return
                      setDialogVoucher(false)
                    }}
                    style={{ width: '30vw' }}
                    breakpoints={{ '960px': '75vw', '641px': '100vw' }}
                  >
                    {vouchers.map((v) => (
                      <div className='mt-4'>
                        <CardVoucher {...v} />
                      </div>
                    ))}
                  </Dialog>
                </div>

                <div className='solid'></div>

                <div className='show-vouchers'>
                  {vouchers.slice(0, 4).map((voucher) => (
                    <div className='card-voucher'>
                      <CardVoucherCheckout {...voucher} />
                    </div>
                  ))}
                </div>
              </Row>

              <Row className='row-payment'>
                <div className='payment-heading'>
                  <span className='span-title'>Total</span>
                  <span className='span-total'>$ 123</span>
                </div>
                <div className='payment'>
                  <Button label='PAYMENT' className='btn-payment' />
                </div>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Cart
