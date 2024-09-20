import { Col, Container, Row } from 'react-bootstrap'
import { CardProduct } from '../../Components/CardProduct/CardProduct'
import { useEffect, useState } from 'react'
import Product from '../../Interfaces/Product'
import axios from 'axios'
import './Home.scss'
import { Link } from 'react-router-dom'

const Home = () => {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('https://bookstore123.free.mockoapp.net/all-products')
        setProducts(res.data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchProducts()
  }, [])

  return (
    <>
      <div className='main'>
        <div className='intro-section pt-lg-2'>
          {/* Banner */}
          <Container style={{ paddingTop: '10px'}}>
            <Row>
              <Col xl={9} md={6} sm={6}>
                <div className='banner banner-big banner-overlay'>
                  <a>
                    <img src='images/banner-1.jpg' alt='Banner' style={{ height: '353px' }} />
                  </a>
                  <div className='banner-content'>
                    <h4 className='banner-subtitle text-white'>
                      <a>Your Guide To The World</a>
                    </h4>
                    <h2 className='banner-title text-white'>
                      <a>
                        Must-Read <br />
                        Travel Books
                      </a>
                    </h2>
                    <a className='btn btn-outline-white-3 banner-link'>
                      Find out more
                      <i className='icon-long-arrow-right' />
                    </a>
                  </div>
                </div>
              </Col>

              <Col lg={3} md={6} sm={6}>
                <div className='banner banner-small banner-overlay'>
                  <a>
                    <img src='images/banner-3.jpg' alt='Banner' style={{ height: '170px' }} />
                  </a>
                  <div className='banner-content'>
                    <h4 className='banner-subtitle text-white d-lg-none d-xl-block'>
                      <a>Deal Of The Day</a>
                    </h4>
                    <h3 className='banner-title text-white'>
                      <a>
                        20% Off Use <br />
                        Code: <span>mybook</span>
                      </a>
                    </h3>
                    <a className='btn btn-outline-white-3 banner-link'>
                      Shop Now
                      <i className='icon-long-arrow-right' />
                    </a>
                  </div>
                </div>
                <div className='mt-3'></div>
                <div className='banner banner-small banner-overlay '>
                  <a>
                    <img src='images/member-benefit.jpg' alt='Banner' style={{ height: '173px' }} />
                  </a>
                  <div className='banner-content'>
                    <a className='btn btn-outline-white-3 banner-link'>
                      Discover Now
                      <i className='icon-long-arrow-right' />
                    </a>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
          <div className='icon-boxes-container bg-transparent'>
            <Container>
              <Row>
                <Col lg={3} sm={6}>
                  <div className='icon-box icon-box-side'>
                    <span className='icon-box-icon'>
                      <i className='icon-truck' />
                    </span>
                    <div className='icon-box-content'>
                      <h3 className='icon-box-title'>Payment &amp; Delivery</h3>
                      <p>Free shipping for orders within 3KM</p>
                    </div>
                  </div>
                </Col>
                <Col lg={3} sm={6}>
                  <div className='icon-box icon-box-side'>
                    <span className='icon-box-icon'>
                      <i className='icon-rotate-left' />
                    </span>
                    <div className='icon-box-content'>
                      <h3 className='icon-box-title'>Return &amp; Refund</h3>
                      <p>Free 100% money back guarantee</p>
                    </div>
                  </div>
                </Col>
                <Col lg={3} sm={6}>
                  <div className='icon-box icon-box-side'>
                    <span className='icon-box-icon'>
                      <i className='icon-life-ring' />
                    </span>
                    <div className='icon-box-content'>
                      <h3 className='icon-box-title'>Quality</h3>
                      <p>Always prioritize customer benefits</p>
                    </div>
                  </div>
                </Col>
                <Col lg={3} sm={6}>
                  <div className='icon-box icon-box-side'>
                    <span className='icon-box-icon'>
                      <i className='icon-envelope' />
                    </span>
                    <div className='icon-box-content'>
                      <h3 className='icon-box-title'>Member Benefits</h3>
                      <p>Exclusive vouchers for members</p>
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
        <div className='bg-light pt-3 pb-3 mb-3'>
          <Container>
            <Row style={{ paddingTop: '10px' }}>
              <Col lg={4} md={2} sm={6} xs={3}>
                <div className='heading heading-flex'>
                  <div className='heading-left'>
                    <h2 className='title'>Best Sellers</h2>
                  </div>
                </div>
              </Col>
              <Col lg={6} md={7} sm={3} xs={6}></Col>
              <Col lg={2} md={3} sm={3} xs={3}>
                <div className='heading-right'>
                  <Link to='' className='title-link'>
                    View More Products <i className='icon-long-arrow-right' />
                  </Link>
                </div>
              </Col>
            </Row>

            <Row style={{ paddingBottom: '15px' }}>
              {products.slice(0, 6).map((product) => (
                <Col lg={2} md={3} key={product.Id}>
                  <CardProduct {...product} />
                </Col>
              ))}
            </Row>
          </Container>
        </div>

        {/* New Releases */}
        {/* Heading */}
        <div className='container' style={{ height: '446px', marginTop: '30px' }}>
          <div className='heading heading-flex'>
            <div className='heading-left'>
              <h2 className='title'>New Releases</h2>
            </div>
            <div className='heading-right'>
              <a href='category.html' className='title-link'>
                View more Products <i className='icon-long-arrow-right' />
              </a>
            </div>
          </div>

          <Row>
            <Col lg={4} md={4} sm={4} xs={4}>
              <img src='images/new-release.png' alt='banner' className='img-new-realse' />
            </Col>
            <Col lg={8}>
              <Row>
                {products.slice(0, 4).map((product) => (
                  <Col lg={3} key={product.Id}>
                    <CardProduct {...product} />
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </div>

        {/* End New Releases */}

        {/* Category Books */}
        {/* Banner book */}
        <Container className='container-banner-books'>
          <Row>
            <img src='images/banner-books.png' className='img-books' />
          </Row>
        </Container>

        <div className='mb-5' />
        <div className='banner-group mb-2'>
          <Container>
            <Row style={{ justifyContent: 'center' }}>
              <Col lg={4} md={6}>
                <div className='banner banner-overlay'>
                  <a>
                    <img src='images/books-children.png' style={{ height: '200px' }} />
                  </a>
                  <div className='banner-content'>
                    <h4 className='banner-subtitle text-white'>
                      <a>A Perfect Choice For Your Children</a>
                    </h4>
                    <h3 className='banner-title text-white'>
                      <a>
                        Children's <br />
                        Bestselling Books
                      </a>
                    </h3>
                    <a className='btn btn-outline-white-3 banner-link'>
                      Discover Now
                      <i className='icon-long-arrow-right' />
                    </a>
                  </div>
                </div>
              </Col>
              <Col lg={4} md={6}>
                <div className='banner banner-overlay'>
                  <a>
                    <img src='images/books-selfhelp.png' alt='Banner' style={{ height: '200px' }} />
                  </a>
                  <div className='banner-content'>
                    <h4 className='banner-subtitle text-white'>
                      <a>Mental Health Awareness Week</a>
                    </h4>
                    {/* End .banner-subtitle */}
                    <h3 className='banner-title text-white'>
                      <a>
                        Self-Help For <br />
                        Your Future.
                      </a>
                    </h3>
                    {/* End .banner-title */}
                    <a className='btn btn-outline-white-3 banner-link'>
                      Discover Now
                      <i className='icon-long-arrow-right' />
                    </a>
                  </div>
                  {/* End .banner-content */}
                </div>
              </Col>
              <Col lg={4} md={6}>
                <div className='banner banner-overlay'>
                  <a>
                    <img src='images/banner-8.jpg' alt='Banner' style={{ height: '200px' }} />
                  </a>
                  <div className='banner-content'>
                    <h4 className='banner-subtitle text-white'>
                      <a>New York Times Bestsellers</a>
                    </h4>
                    <h3 className='banner-title text-white'>
                      <a>
                        Bestselling Food <br />
                        and Drink Books.
                      </a>
                    </h3>
                    <a className='btn btn-outline-white-3 banner-link'>
                      Discover Now
                      <i className='icon-long-arrow-right' />
                    </a>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>

        <div className='block'>
          <div className='block-wrapper '>
            <Container>
              <div className='heading heading-flex mt-4'>
                <div className='heading-left '>
                  <h2 className='title'>Novel</h2>
                </div>
                <div className='heading-right'>
                  <a href='category.html' className='title-link'>
                    View more Products <i className='icon-long-arrow-right' />
                  </a>
                </div>
              </div>
              {/* Product */}
              <Row>
                {products.slice(0, 6).map((product) => (
                  <Col lg={2} key={product.Id}>
                    <CardProduct {...product} />
                  </Col>
                ))}
              </Row>
            </Container>
          </div>
        </div>

        <div className='block mt-4'>
          <div className='block-wrapper '>
            <div className='container'>
              <div className='heading heading-flex'>
                <div className='heading-left'>
                  <h2 className='title'>History</h2>
                </div>
                <div className='heading-right'>
                  <a href='category.html' className='title-link'>
                    View more Products <i className='icon-long-arrow-right' />
                  </a>
                </div>
              </div>
              {/* Product */}
              <Row>
                {products.slice(0, 6).map((product) => (
                  <Col lg={2} key={product.Id}>
                    <CardProduct {...product} />
                  </Col>
                ))}
              </Row>
            </div>
          </div>
        </div>
        {/* End Category Books */}

        {/* Category Books */}

        {/* Category stationery */}
        <Container className='container-banner-stationery mt-6'>
          <Row>
            <img src='images/stationery.jpg' className='img-stationery' style={{ height: '400px', width: '100%' }} />
          </Row>
        </Container>
        {/* End Category stationery */}
      </div>

      <button id='scroll-top' title='Back to Top'>
        <i className='icon-arrow-up' />
      </button>
    </>
  )
}

export default Home
