import { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Breadcrumb from '../../Components/Breadcrumb/Breadcrumb'
import Product from '../../Interfaces/Product'
import { CardProduct } from '../../Components/CardProduct/Home/CardProduct'
import { Link } from 'react-router-dom'
import './AllCD.scss'
import Loading from '../../Components/Loading/Loading'
import { $axios } from '../../axios'

const items = [
  {
    label: 'CD',
    url: '/all-cds',
    page: true
  }
]
const home = { icon: 'pi pi-home', url: '/home' }

function AllCD() {
  const [loading, setLoading] = useState<boolean>(true)
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await $axios.get('CategoriesFE')
        setProducts(res.data.data)
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
        <img src='/images/bannerCD.png' className='img-all-books' />
        <div className='mt-5'></div>

        {loading ? (
          <Loading />
        ) : (
          <>
            <div className='container-all-books-content'>
              <Container className='all-products' style={{ marginTop: '10px' }}>
                <Row>
                  {products?.map((category: any, index: any) => (
                    <div key={index}>
                      {/* Render each category (Book, Stationery, etc.) */}
                      {category.Level === 0 && (
                        <>
                          {category.Name === 'CD' && (
                            <>
                              {products
                                .filter(
                                  (subCategory: any) => subCategory.Level === 1 && subCategory.ParentId === category.Id
                                )
                                .map((subCategory: any, subIndex: any) => (
                                  <div key={subIndex} className='block'>
                                    <Container>
                                      <div className='heading heading-flex mt-4'>
                                        <div className='heading-left' style={{ zIndex: '1' }}>
                                          <h2 className='title'>{subCategory.Name}</h2>
                                        </div>
                                        <div className='heading-right' style={{ zIndex: '1' }}>
                                          <Link to={`${subCategory.Name}`} className='title-link'>
                                            View more Products <i className='icon-long-arrow-right' />
                                          </Link>
                                        </div>
                                      </div>
                                      {/* Render the products for each subcategory */}
                                      <Row>
                                        {subCategory.Products?.slice(0, 6).map((product: any, productIndex: any) => (
                                          <Col lg={2} key={productIndex}>
                                            <CardProduct product={product} />
                                          </Col>
                                        ))}
                                      </Row>
                                    </Container>
                                  </div>
                                ))}
                            </>
                          )}
                        </>
                      )}
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

export default AllCD
