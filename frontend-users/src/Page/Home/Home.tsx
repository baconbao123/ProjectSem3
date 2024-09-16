import { Col, Container, Row } from 'react-bootstrap'
import { CardProduct } from '../../Components/CardProduct/CardProduct'
import './Home.scss'

const products = [
  {
    id: 1,
    title: 'Practical MongoDB Part 1',
    image: 'https://itbook.store/img/books/9781484206485.png',
    special: '10%',
    author: 'Author 1',
    price: '32.75',
    priceSale: '10'
  },
  {
    id: 2,
    title: 'Java',
    image: 'https://itbook.store/img/books/9781491954249.png',
    special: '',
    author: 'Author 1',
    price: '3.1',
    priceSale: ''
  },
  {
    id: 3,
    title: 'Angular',
    image: 'https://itbook.store/img/books/9781491985571.png',
    special: '',
    author: 'Author 1',
    price: '19',
    priceSale: ''
  },
  {
    id: 4,
    title: 'Angular',
    image: 'https://itbook.store/img/books/9781491999226.png',
    special: '20%',
    author: 'Author 1',
    price: '19',
    priceSale: '10'
  },
  {
    id: 5,
    title: 'JWT',
    image: 'https://itbook.store/img/books/9781617294136.png',
    special: '',
    author: 'Author 1',
    price: '19',
    priceSale: ''
  },
  {
    id: 6,
    title: 'Figma',
    image: 'https://itbook.store/img/books/9781484211830.png',
    special: '',
    author: 'Author 1',
    price: '19',
    priceSale: ''
  },
  {
    id: 7,
    title: 'Ruby',
    image: 'https://itbook.store/img/books/9781484206485.png',
    special: '',
    author: 'Author 1',
    price: '19',
    priceSale: ''
  }
]

const Home = () => {
  return (
    <>
      <div className='page-wrapper'>
        <main className='main'>
          <div className='intro-section pt-lg-2'>
            {/* Banner */}
            <Container>
              <Row>
                <Col xl={9} md={6} sm={6}>
                  <div className='banner banner-big banner-overlay'>
                    <a>
                      <img src='images/banner-1.jpg' alt='Banner' style={{ height: '350px' }} />
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
                      <img src='images/banner-3.jpg' alt='Banner' />
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

                  <div className='banner banner-small banner-overlay '>
                    <a>
                      <img src='images/member-benefit.jpg' alt='Banner' style={{ height: '165px' }} />
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
              <div className='container'>
                <div className='row'>
                  <div className='col-sm-6 col-lg-3'>
                    <div className='icon-box icon-box-side'>
                      <span className='icon-box-icon'>
                        <i className='icon-truck' />
                      </span>
                      <div className='icon-box-content'>
                        <h3 className='icon-box-title'>Payment &amp; Delivery</h3>
                        <p>Free shipping for orders within 3KM</p>
                      </div>
                    </div>
                  </div>
                  <div className='col-sm-6 col-lg-3'>
                    <div className='icon-box icon-box-side'>
                      <span className='icon-box-icon'>
                        <i className='icon-rotate-left' />
                      </span>
                      <div className='icon-box-content'>
                        <h3 className='icon-box-title'>Return &amp; Refund</h3>
                        <p>Free 100% money back guarantee</p>
                      </div>
                    </div>
                  </div>
                  <div className='col-sm-6 col-lg-3'>
                    <div className='icon-box icon-box-side'>
                      <span className='icon-box-icon'>
                        <i className='icon-life-ring' />
                      </span>
                      <div className='icon-box-content'>
                        <h3 className='icon-box-title'>Quality</h3>
                        <p>Always prioritize customer benefits.</p>
                      </div>
                    </div>
                  </div>
                  <div className='col-sm-6 col-lg-3'>
                    <div className='icon-box icon-box-side'>
                      <span className='icon-box-icon'>
                        <i className='icon-envelope' />
                      </span>
                      <div className='icon-box-content'>
                        <h3 className='icon-box-title'>Member Benefits</h3>
                        <p>Join now to receive a range of exclusive vouchers</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='bg-light pt-3 pb-3 mb-3'>
            <Container>
              <Row>
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
                    <a href='category.html' className='title-link'>
                      View more Products <i className='icon-long-arrow-right' />
                    </a>
                  </div>
                </Col>
              </Row>

              <Row>
                {products.slice(0, 6).map((product) => (
                  <Col lg={2} md={3}>
                    <CardProduct {...product} />
                  </Col>
                ))}
              </Row>
            </Container>
          </div>

          {/* New Releases */}
          {/* Heading */}
          <div className='container'>
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
                <img src='images/new-release.png' alt='' />
              </Col>
              <Col lg={8}>
                <Row>
                  {products.slice(0, 4).map((product) => (
                    <Col lg={3} key={product.id}>
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
              <img src='images/banner-books.png' className='img-books' style={{ height: '400px', width: '100%' }} />
            </Row>
          </Container>

          <div className='mb-5' />
          <div className='banner-group mb-2'>
            <div className='container'>
              <div className='row justify-content-center'>
                <div className='col-md-6 col-lg-4'>
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
                </div>
                <div className='col-md-6 col-lg-4'>
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
                  {/* End .banner */}
                </div>
                {/* End .col-lg-4 */}
                <div className='col-md-6 col-lg-4'>
                  <div className='banner banner-overlay'>
                    <a>
                      <img src='images/banner-8.jpg' alt='Banner' />
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
                </div>
              </div>
            </div>
          </div>

          <div className='block'>
            <div className='block-wrapper '>
              <div className='container'>
                <div className='heading heading-flex'>
                  <div className='heading-left'>
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
                    <Col lg={2}>
                      <CardProduct {...product} />
                    </Col>
                  ))}
                </Row>
              </div>
            </div>
          </div>

          <div className='block mt-3'>
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
                    <Col lg={2}>
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
          <Container className='container-banner-stationery mt-5'>
            <Row>
              <img src='images/stationery.jpg' className='img-stationery' style={{ height: '400px', width: '100%' }} />
            </Row>
          </Container>
          {/* End Category stationery */}
        </main>

        {/* End .main */}
      </div>

      <button id='scroll-top' title='Back to Top'>
        <i className='icon-arrow-up' />
      </button>
    </>
  )
}

export default Home
