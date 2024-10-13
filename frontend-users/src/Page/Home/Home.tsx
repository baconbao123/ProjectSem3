import { Col, Container, Row } from 'react-bootstrap'
import { CardProduct } from '../../Components/CardProduct/Home/CardProduct'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CategoryCarousel from './CategoryCarousel/CategoryCarousel'
import { $axios } from '../../axios'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../Store/store'
import { setLoaded, setLoading } from '../../Store/loadingSlice'
import { Skeleton } from 'primereact/skeleton'
import { Button } from 'primereact/button'
import { boxService } from '../../Data/HomeData'
import './Home.scss'

const Home = () => {
  const [products, setProducts] = useState<any | []>([])
  const [productsData, setProductsData] = useState<any | []>([])
  const isLoading = useSelector((state: RootState) => state.loading.isLoading)
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await $axios.get('CategoriesFE')
        setProducts(res.data.data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await $axios.get('ProductFE')
        const allCategories = res.data.data
        setProductsData(allCategories)
      } catch (err) {
        console.log(err)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    dispatch(setLoading())

    const timeout = setTimeout(() => {
      dispatch(setLoaded())
    }, 1000)

    return () => clearTimeout(timeout)
  }, [dispatch])

  const handleLoaded = () => {
    dispatch(setLoaded())
  }

  return (
    <>
      <div className='main'>
        <div className='intro-section pt-lg-2'>
          <Container style={{ paddingTop: '10px' }}>
            <Row>
              <Col xl={9} md={6} sm={6}>
                {/* Banner */}
                <div className='banner banner-big banner-overlay'>
                  <div>
                    {isLoading ? (
                      <Skeleton width='100%' height='353px' />
                    ) : (
                      <img src='/images/banner-1.jpg' alt='Banner' style={{ height: '353px' }} onLoad={handleLoaded} />
                    )}
                  </div>
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
                  {isLoading ? (
                    <Skeleton width='100%' height='170px' />
                  ) : (
                    <img src='/images/banner-3.jpg' alt='Banner' style={{ height: '170px' }} onLoad={handleLoaded} />
                  )}
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
                    <Link
                      to='/all-products'
                      style={{ textDecoration: 'none' }}
                      className='btn btn-outline-white-3 banner-link'
                    >
                      Shop Now
                      <i className='icon-long-arrow-right' />
                    </Link>
                  </div>
                </div>
                <div className='mt-3'></div>
                <div className='banner banner-small banner-overlay '>
                  {isLoading ? (
                    <Skeleton width='100%' height='170px' />
                  ) : (
                    <img
                      src='/images/member-benefit.png'
                      alt='Banner'
                      style={{ height: '173px' }}
                      onLoad={handleLoaded}
                    />
                  )}
                  <div className='banner-content member'>
                    <Link to='/member-benefits' className='btn btn-outline-white-3 banner-link'>
                      Discover Now
                      <i className='icon-long-arrow-right' />
                    </Link>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
          <div className='icon-boxes-container bg-transparent'>
            <Container>
              <Row>
                {boxService.map((b, index) => (
                  <Col lg={3} sm={6} key={index}>
                    <div className='icon-box icon-box-side'>
                      <span className='icon-box-icon'>
                        <i className={b.icon} />
                      </span>
                      <div className='icon-box-content'>
                        <h3 className='icon-box-title'>{b.title}</h3>
                        <p>{b.subTitle}</p>
                      </div>
                    </div>
                  </Col>
                ))}
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
                  <Link to='/best-seller' className='title-link'>
                    View More Products <i className='icon-long-arrow-right' />
                  </Link>
                </div>
              </Col>
            </Row>

            <Row style={{ paddingBottom: '15px' }}>
              {productsData
                .slice(0, 6)
                .sort((a: any, b: any) => b.SellPrice - a.SellPrice)
                .map((product: any) => (
                  <Col lg={2} md={3} key={product.Id}>
                    <CardProduct product={product} />
                  </Col>
                ))}
            </Row>
          </Container>
        </div>

        {/* New Releases */}
        <div className='container' style={{ marginTop: '30px' }}>
          <div className='heading heading-flex'>
            <div className='heading-left'>
              <h2 className='title'>New Releases</h2>
            </div>
            <div className='heading-right'>
              <Link to='/new-releases' className='title-link'>
                View more Products <i className='icon-long-arrow-right' />
              </Link>
            </div>
          </div>

          <Row>
            <Col lg={12}>
              <Row>
                {productsData
                  .slice(0, 4)
                  .sort((a: any, b: any) => {
                    const dateA = new Date(a.CreatedAt.split('/').reverse().join('-'))
                    const dateB = new Date(b.CreatedAt.split('/').reverse().join('-'))
                    if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
                      return 0
                    }
                    return dateB.getTime() - dateA.getTime()
                  })
                  .map((product: any) => (
                    <Col lg={2} key={product.Id}>
                      <CardProduct product={product} />
                    </Col>
                  ))}
              </Row>
            </Col>
          </Row>
        </div>
        {/* End New Releases */}

        {/* Start Categories */}
        {products?.map((category: any, index: any) => (
          <div key={index}>
            {category.Level === 0 && (
              <>
                <div className='mb-6' />
                <div className='banner-group mb-2'>
                  <Container style={{ height: '200px' }}>
                    <Row>
                      <CategoryCarousel
                        categoryParent={category.Name}
                        categories={products.filter(
                          (subCategory: any) => subCategory.ParentId === category.Id && subCategory.Products.length > 0
                        )}
                      />
                    </Row>
                  </Container>
                </div>
                <div className='product-container-card'>
                  <Container>
                    <div className='title'>{category.Name}</div>
                    {products
                      .filter(
                        (subCategory: any) =>
                          subCategory.Level === 1 &&
                          subCategory.ParentId === category.Id &&
                          subCategory.Products.length > 0
                      )
                      .map((subCategory: any, subIndex: any) => (
                        <div key={subIndex} className='block'>
                          <div className='block-wrapper'>
                            <div className='heading heading-flex mt-4'>
                              <div className='heading-left' style={{ zIndex: '1' }}>
                                <div className='titleSmall'>{subCategory.Name}</div>
                              </div>
                              <div className='heading-right' style={{ zIndex: '1' }}>
                                <Link to={`/${category.Name}/${subCategory.Name}`} className='title-link'>
                                  View more Products <i className='icon-long-arrow-right' />
                                </Link>
                              </div>
                            </div>
                            <Row>
                              {subCategory.Products?.slice(0, 6).map((product: any, productIndex: any) => (
                                <Col lg={2} key={productIndex}>
                                  <CardProduct product={product} />
                                </Col>
                              ))}
                            </Row>
                          </div>
                        </div>
                      ))}

                    <Row className='row-btn-see-more'>
                      <Link to={`/${category.Name}`} className='url-see-more'>
                        <Button label='View More' outlined className='btn-see-more' />
                      </Link>
                    </Row>
                  </Container>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <button id='scroll-top' title='Back to Top'>
        <i className='icon-arrow-up' />
      </button>
    </>
  )
}

export default Home
