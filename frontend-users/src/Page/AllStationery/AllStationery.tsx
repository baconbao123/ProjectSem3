import { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import axios from 'axios'
import Breadcrumb from '../../Components/Breadcrumb/Breadcrumb'
import Product from '../../Interfaces/Product'
import { CardProduct } from '../../Components/CardProduct/Home/CardProduct'
import { Link } from 'react-router-dom'
import './AllStationery.scss'
import Loading from '../../Components/Loading/Loading'

const items = [
  {
    label: 'Books',
    url: '/all-books',
    page: true
  }
]
const home = { icon: 'pi pi-home', url: '/home' }

function AllStationery() {
  const [loading, setLoading] = useState<boolean>(true)
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('https://bookstore123.free.mockoapp.net/all-products')
        setProducts(res.data)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <>
      <Breadcrumb items={items} home={home} />
      <div className='container-all-books'>
        <img src='/images/banner-stationery.png' className='img-all-books' />
        <div className='mt-5'></div>

        {loading ? (
          <Loading />
        ) : (
          <>
            <div className='container-all-books-content'>
              <Container className='all-products' style={{ marginTop: '10px' }}>
                <Row>
                  {products.map((category: any, index: any) => (
                    <div key={index}>
                      {/* Render each category (Book, Stationery, etc.) */}
                      {Object.keys(category).map((categoryName, i) => (
                        <div key={i}>
                          {/* Category Books */}
                          {categoryName === 'Stationery' && (
                            <>
                              {category.Stationery.map((stationeryCategory: any, j: any) => (
                                <div key={j} className='block'>
                                  <Container>
                                    <div className='heading heading-flex mt-4'>
                                      <div className='heading-left' style={{ zIndex: '1' }}>
                                        <h2 className='title'>{stationeryCategory.CategoryName}</h2>
                                      </div>
                                      <div className='heading-right' style={{ zIndex: '1' }}>
                                        <Link to={`${stationeryCategory.CategoryName}`} className='title-link'>
                                          View more Products <i className='icon-long-arrow-right' />
                                        </Link>
                                      </div>
                                    </div>
                                    {/* Product */}
                                    <Row style={{ paddingBottom: '20px' }}>
                                      {stationeryCategory.Products.slice(0, 6).map((product: any, k: any) => (
                                        <Col lg={2} key={k}>
                                          <CardProduct product={product} />
                                        </Col>
                                      ))}
                                    </Row>
                                  </Container>
                                </div>
                              ))}
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </Row>
              </Container>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default AllStationery
