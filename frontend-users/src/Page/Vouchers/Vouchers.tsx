import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import CardVoucher, { CardVoucherProps } from '../../Components/CardVoucher/CardVoucher'
import './Voucher.scss'
import axios from 'axios'
import Breadcrumb from '../../Components/Breadcrumb/Breadcrumb'

const Vouchers: React.FC = () => {
  const [vouchers, setVouchers] = useState<CardVoucherProps[]>([])
  const items = [{ label: 'Vouchers', url: '/vouchers', page: true }]
  const home = { icon: 'pi pi-home', url: '/home' }

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
    <>
      <Breadcrumb items={items} home={home} />

      <div className='voucher-container'>
        {/* Image */}
        <img src='images/vouchers.jpg' className='img-voucher' />

        {/* Content */}
        {/* Title */}
        <div className='container-heading'>
          <Container>
            <Row className='row-heading'>
              <h1 className='heading'>Voucher Warehouse</h1>
            </Row>
          </Container>
        </div>

        {/* Show Voucher */}
        {/* Freeship */}
        <div className='voucher-content-f'>
          <Container>
            <Row>
              <h1 className='title-type'>FREE SHIPPING VOUCHERS</h1>
            </Row>
            <Row>
              {vouchers
                .filter((v) => v.type === 'Freeship')
                .map((voucher, index) => (
                  <Col lg={4} key={index} className={index >= 3 ? 'mt-3' : ''}>
                    <CardVoucher {...voucher} />
                  </Col>
                ))}
            </Row>
          </Container>
        </div>
        {/* End Freeship */}

        {/* Voucher by Order */}
        <div className='voucher-content-o'>
          <Container>
            <Row>
              <h1 className='title-type'>ORDER-BASED VOUCHERS</h1>
            </Row>
            <Row>
              {vouchers
                .filter((v) => v.type === 'discountByOrder')
                .map((voucher, index) => (
                  <Col lg={4} key={index} className={index >= 3 ? 'mt-3' : ''}>
                    <CardVoucher {...voucher} />
                  </Col>
                ))}
            </Row>
          </Container>
        </div>
        {/* End Voucher by Order */}

        {/* Voucher by Category */}
        <div className='voucher-content-c'>
          <Container>
            <Row>
              <h1 className='title-type'>CATEGORY-BASED VOUCHERS</h1>
            </Row>
            <Row>
              {vouchers
                .filter((v) => v.type === 'discountByCategory')
                .map((voucher, index) => (
                  <Col lg={4} key={index} className={index >= 3 ? 'mt-3' : ''}>
                    <CardVoucher {...voucher} />
                  </Col>
                ))}
            </Row>
          </Container>
        </div>

        {/* End Voucher by Category */}
      </div>
    </>
  )
}

export default Vouchers
