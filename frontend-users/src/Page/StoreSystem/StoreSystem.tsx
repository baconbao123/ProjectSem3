import { Col, Container, Row } from 'react-bootstrap'
import './StoreSystem.scss'

interface StoreSystem {
  storeName: string
  phoneNumber: string
  address: string
}

export const StoreSystem = () => {
  const email = 'anh450460@gmail.com'
  return (
    <Container style={{ paddingBottom: '50px', paddingTop: '30px' }}>
      <h1>Store System</h1>
      <Row>
        <Col lg={6}>
          <iframe
            src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.060333256608!2d106.71161967544687!3d10.806691158633901!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529ed00409f09%3A0x11f7708a5c77d777!2zQXB0ZWNoIENvbXB1dGVyIEVkdWNhdGlvbiAtIEjhu4cgVGjhu5FuZyDEkMOgbyB04bqhbyBM4bqtcCBUcsOsbmggVmnDqm4gUXXhu5FjIHThur8gQXB0ZWNo!5e0!3m2!1sen!2s!4v1726478281384!5m2!1sen!2s'
            width='100%'
            height={450}
            style={{ border: 0 }}
            allowFullScreen
            loading='lazy'
            referrerPolicy='no-referrer-when-downgrade'
          />
        </Col>
        <Col lg={6}>
          <div className='store-content'>
            <h1>Shradha Bookstores</h1>
            <h3>35/6 Đường D5, Phường 25, Bình Thạnh, Hồ Chí Minh</h3>
            <h3>Tel: 098765432</h3>
            <h3>
              Mail: &nbsp;
              <a href={`mailto:${email}`} className='link-email'>
                {email}
              </a>
            </h3>
          </div>
        </Col>
      </Row>
    </Container>
  )
}
