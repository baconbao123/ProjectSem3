import { Link } from 'react-router-dom'
import './Footer.scss'
import { Container, Row } from 'react-bootstrap'

export const Footer = () => {
  return (
    <footer className='footer footer-2 footer-container'>
      <div className='mt-4'></div>
      <Container>
        <Row>
          <div className='col-sm-12 col-lg-6 col-xl-5'>
            <img src='/images/Logo.png' className='footer-logo' alt='Footer Logo' width={240} height={300} />
            <div className='widget-about-info'>
              <Row>
                <div className='col-sm-6 col-md-6'>
                  <span className='widget-about-title'>Got Question? Call us 24/7</span>
                  <a href='tel:123456789'>+0123 456 789</a>
                </div>
                {/* End .col-sm-6 */}
                <div className='col-sm-6 col-md-6'>
                  <span className='widget-about-title'>Payment Method</span>
                  <figure className='footer-payments'>
                    <img src='/images/f-payment.png' alt='Payment methods' width={70} height={30} />
                  </figure>
                </div>
              </Row>
            </div>
          </div>
          <div className='col-lg-6 col-xl-7' style={{ height: '70px !impotant' }}>
            <Row>
              <div className='col-sm-4'>
                <div className='widget'>
                  <h4 className='widget-title'>Information</h4>
                  <ul className='widget-list'>
                    <li>
                      <Link to='/faq' className='url'>
                        FAQ
                      </Link>
                    </li>
                    <li>
                      <Link to='/store' className='url'>
                        Contact us
                      </Link>
                    </li>
                    <li>
                      <Link to='/login' className='url'>
                        Log in
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              <div className='col-sm-4' style={{ height: '70px !impotant' }}>
                <div className='widget'>
                  <h4 className='widget-title'>My Account</h4>
                  <ul className='widget-list'>
                    <li>
                      <Link to='/checkout/cart' className='url'>
                        View Cart
                      </Link>
                    </li>
                    <li>
                      <Link to='/orders' className='url'>
                        Track My Order
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </Row>
          </div>
        </Row>
      </Container>
      <div className='mb-4'></div>

    </footer>
  )
}
