import { Col, Container, Row } from 'react-bootstrap'
import { CardProduct } from '../../Components/CardProduct/CardProduct'
import { Header } from '../../Components/Header/Header'
import './Home.scss'
import { Footer } from '../../Components/Footer/Footer'

const products = [
  {
    id: 1,
    title: 'Practical MongoDB',
    image: 'https://itbook.store/img/books/9781484206485.png',
    special: '10%',
    author: 'Author 1',
    price: '32.75',
    priceSale: '10'
  },
  {
    id: 2,
    title: 'Java',
    image: 'https://itbook.store/img/books/9781484206485.png',
    special: '',
    author: 'Author 1',
    price: '3.1',
    priceSale: ''
  },
  {
    id: 3,
    title: 'Angular',
    image: 'https://itbook.store/img/books/9781484206485.png',
    special: '',
    author: 'Author 1',
    price: '19',
    priceSale: ''
  },
  {
    id: 3,
    title: 'Angular',
    image: 'https://itbook.store/img/books/9781484206485.png',
    special: '20%',
    author: 'Author 1',
    price: '19',
    priceSale: '10'
  }
]

const Home = () => {
  return (
    <>
      <div className='page-wrapper'>
        <Header />
        {/* End .header */}
        <main className='main'>
          <div className='intro-section pt-lg-2'>
            {/* Banner */}
            <div className='container'>
              <div className='row'>
                <div className='col-md-12 col-lg-9'>
                  <div className='banner banner-big banner-overlay'>
                    <a href='#'>
                      <img src='assets/images/demos/demo-20/banners/banner-1.jpg' alt='Banner'  style={{ height: '350px' }}/>
                    </a>
                    <div className='banner-content'>
                      <h4 className='banner-subtitle text-white'>
                        <a href='#'>Your Guide To The World</a>
                      </h4>
                      {/* End .banner-subtitle */}
                      <h2 className='banner-title text-white'>
                        <a href='#'>
                          Must-Read <br />
                          Travel Books
                        </a>
                      </h2>
                      {/* End .banner-title */}
                      <a href='#' className='btn btn-outline-white-3 banner-link'>
                        Find out more
                        <i className='icon-long-arrow-right' />
                      </a>
                    </div>
                    {/* End .banner-content */}
                  </div>
                  {/* End .banner */}
                </div>
                {/* End .col-lg-6 */}
                
                <div className='col-sm-6 col-lg-3'>
                  <div className='banner banner-small banner-overlay'>
                    <a href='#'>
                      <img src='assets/images/demos/demo-20/banners/banner-3.jpg' alt='Banner' />
                    </a>
                    <div className='banner-content'>
                      <h4 className='banner-subtitle text-white d-lg-none d-xl-block'>
                        <a href='#'>Deal Of The Day</a>
                      </h4>
                      {/* End .banner-subtitle */}
                      <h3 className='banner-title text-white'>
                        <a href='#'>
                          20% Off Use <br />
                          Code: <span>mybook</span>
                        </a>
                      </h3>
                      {/* End .banner-title */}
                      <a href='#' className='btn btn-outline-white-3 banner-link'>
                        Shop Now
                        <i className='icon-long-arrow-right' />
                      </a>
                    </div>
                    {/* End .banner-content */}
                  </div>
                  {/* End .banner */}
                  <div className='banner banner-small banner-overlay'>
                    <a href='#'>
                      <img src='images/member-benefit.jpg' alt='Banner' style={{ height: '165px' }}/>
                    </a>
                    <div className='banner-content'>
                      {/* <h4 className='banner-subtitle text-white d-lg-none d-xl-block'>
                        <a href='#'>Member Benefits</a>
                      </h4> */}
                      {/* End .banner-subtitle */}
                      {/* <h3 className='banner-title text-white'>
                        <a href='#' style={{color: 'red'}}>
                          10% off orders &gt; $10.
                        </a>
                      </h3> */}
                      {/* End .banner-title */}
                      <a href='#' className='btn btn-outline-white-3 banner-link'>
                        Discover Now
                        <i className='icon-long-arrow-right' />
                      </a>
                    </div>
                    {/* End .banner-content */}
                  </div>
                  {/* End .banner */}
                </div>
                {/* End .col-lg-3 */}
              </div>
              {/* End .row */}
            </div>
            {/* End .container */}
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
                        {/* End .icon-box-title */}
                        <p>Free shipping for orders within 3KM</p>
                      </div>
                      {/* End .icon-box-content */}
                    </div>
                    {/* End .icon-box */}
                  </div>
                  {/* End .col-sm-6 col-lg-3 */}
                  <div className='col-sm-6 col-lg-3'>
                    <div className='icon-box icon-box-side'>
                      <span className='icon-box-icon'>
                        <i className='icon-rotate-left' />
                      </span>
                      <div className='icon-box-content'>
                        <h3 className='icon-box-title'>Return &amp; Refund</h3>
                        {/* End .icon-box-title */}
                        <p>Free 100% money back guarantee</p>
                      </div>
                      {/* End .icon-box-content */}
                    </div>
                    {/* End .icon-box */}
                  </div>
                  {/* End .col-sm-6 col-lg-3 */}
                  <div className='col-sm-6 col-lg-3'>
                    <div className='icon-box icon-box-side'>
                      <span className='icon-box-icon'>
                        <i className='icon-life-ring' />
                      </span>
                      <div className='icon-box-content'>
                        <h3 className='icon-box-title'>Quality</h3>
                        {/* End .icon-box-title */}
                        <p>Always prioritize customer benefits.</p>
                      </div>
                      {/* End .icon-box-content */}
                    </div>
                    {/* End .icon-box */}
                  </div>
                  {/* End .col-sm-6 col-lg-3 */}
                  <div className='col-sm-6 col-lg-3'>
                    <div className='icon-box icon-box-side'>
                      <span className='icon-box-icon'>
                        <i className='icon-envelope' />
                      </span>
                      <div className='icon-box-content'>
                        <h3 className='icon-box-title'>Member Benefits</h3>
                        {/* End .icon-box-title */}
                        <p>Join now to receive a range of exclusive vouchers</p>
                      </div>
                      {/* End .icon-box-content */}
                    </div>
                    {/* End .icon-box */}
                  </div>
                  {/* End .col-sm-6 col-lg-3 */}
                </div>
                {/* End .row */}
              </div>
              {/* End .container */}
            </div>
            {/* End .icon-boxes-container */}
          </div>
          {/* End .intro-section */}
          <div className='bg-light pt-3 pb-3 mb-3'>
            {/* Best seller */}
            <Container>
              <div className='container'>
                <div className='heading heading-flex'>
                  <div className='heading-left'>
                    <h2 className='title'>Best Sellers</h2>
                  </div>
                  <div className='heading-right'>
                    <a href='category.html' className='title-link'>
                      View more Products <i className='icon-long-arrow-right' />
                    </a>
                  </div>
                </div>

                <Row>
                  {products.map((product) => (
                    <Col lg={3}>
                      <CardProduct {...product} />
                    </Col>
                  ))}
                </Row>
              </div>
            </Container>
          </div>
          {/* End .bg-light pt-4 pb-4 */}

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
              <Col lg={4}>
                <img src='images/banner-new-release.png' alt='' />
              </Col>
              <Col lg={8}>
                <Row>
                  {products.map((product) => (
                    <Col lg={3}>
                      <CardProduct {...product} />
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
          </div>

          {/* End New Releases */}

          {/* Banner book */}
          <Container className='container-banner-books'>
            <Row>
              <img src='images/banner-books.png' className='img-books' />
            </Row>
          </Container>

          {/* End .container */}
          <div className='mb-5' />
          {/* End .mb-3 */}
          <div className='banner-group mb-2'>
            <div className='container'>
              <div className='row justify-content-center'>
                <div className='col-md-6 col-lg-4'>
                  <div className='banner banner-overlay'>
                    <a href='#'>
                      <img src='images/banner-books-children.png' style={{ height: '200px' }} />
                    </a>
                    <div className='banner-content'>
                      <h4 className='banner-subtitle text-white'>
                        <a href='#'>A Perfect Choice For Your Children</a>
                      </h4>
                      {/* End .banner-subtitle */}
                      <h3 className='banner-title text-white'>
                        <a href='#'>
                          Children's <br />
                          Bestselling Books
                        </a>
                      </h3>
                      {/* End .banner-title */}
                      <a href='#' className='btn btn-outline-white-3 banner-link'>
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
                    <a href='#'>
                      <img src='images/banner-books-selfhelp.png' alt='Banner' style={{ height: '200px' }} />
                    </a>
                    <div className='banner-content'>
                      <h4 className='banner-subtitle text-white'>
                        <a href='#'>Mental Health Awareness Week</a>
                      </h4>
                      {/* End .banner-subtitle */}
                      <h3 className='banner-title text-white'>
                        <a href='#'>
                          Self-Help For <br />
                          Your Future.
                        </a>
                      </h3>
                      {/* End .banner-title */}
                      <a href='#' className='btn btn-outline-white-3 banner-link'>
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
                    <a href='#'>
                      <img src='assets/images/demos/demo-20/banners/banner-8.jpg' alt='Banner' />
                    </a>
                    <div className='banner-content'>
                      <h4 className='banner-subtitle text-white'>
                        <a href='#'>New York Times Bestsellers</a>
                      </h4>
                      {/* End .banner-subtitle */}
                      <h3 className='banner-title text-white'>
                        <a href='#'>
                          Bestselling Food <br />
                          and Drink Books.
                        </a>
                      </h3>
                      {/* End .banner-title */}
                      <a href='#' className='btn btn-outline-white-3 banner-link'>
                        Discover Now
                        <i className='icon-long-arrow-right' />
                      </a>
                    </div>
                    {/* End .banner-content */}
                  </div>
                  {/* End .banner */}
                </div>
                {/* End .col-lg-4 */}
              </div>
              {/* End .row */}
            </div>
            {/* End .container */}
          </div>
          {/* End .banner-group */}

          {/* Category Feature */}
          <div className='block'>
            <div className='block-wrapper '>
              <div className='container'>
                {/* Heading */}
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
                  {products.map((product) => (
                    <Col lg={2}>
                      <CardProduct {...product} />
                    </Col>
                  ))}
                </Row>
              </div>
            </div>
          </div>
        </main>
        {/* End .main */}

        {/* Footer */}
        <Footer />
        {/* End Footer */}
      </div>
      {/* End .page-wrapper */}

      <button id='scroll-top' title='Back to Top'>
        <i className='icon-arrow-up' />
      </button>
    </>
  )
}

export default Home