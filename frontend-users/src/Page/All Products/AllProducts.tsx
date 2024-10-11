import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { $axios } from '../../axios'
import BannerAllProducts from './Banner/BannerAllProducts'
import { Link } from 'react-router-dom'
import { CardProduct } from '../../Components/CardProduct/Home/CardProduct'
import './AllProducts.scss'

const AllProducts: React.FC = () => {
  const [categories, setCategories] = useState<any[] | []>([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await $axios.get('CategoriesFE')
        setCategories(res.data.data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchProducts()
  }, [])

  return (
    <>
      <BannerAllProducts />
      <div className='container-all-books-content'>
        <Container className='all-products'>
          <Row>
            {categories.map((category, index: any) => (
              <div key={index}>
                {category.Level === 0 && (
                  <div className='content-category-product'>
                    <div className='category-name-container'>
                      <span className='category-name'>{category.Name}</span>
                    </div>
                    {categories
                      .filter((subCategory) => subCategory.Level === 1 && subCategory.ParentId === category.Id)
                      .map((subCategory) => (
                        <div key={subCategory.Id} className='block'>
                          <div className='block-wrapper'>
                            <Container>
                              <div className='heading heading-flex mt-4'>
                                <div className='heading-left' style={{ zIndex: '1' }}>
                                  <h2 className='title'>{subCategory.Name}</h2>
                                </div>
                                <div className='heading-right' style={{ zIndex: '1' }}>
                                  <Link to={`/${category.Name}/${subCategory.Name}`} className='title-link'>
                                    View more Products <i className='icon-long-arrow-right' />
                                  </Link>
                                </div>
                              </div>
                              <Row>
                                {subCategory.Products?.slice(0, 6).map((product: any, productIndex: number) => (
                                  <Col lg={2} key={product.Id || productIndex}>
                                    <CardProduct product={product} />
                                  </Col>
                                ))}
                              </Row>
                            </Container>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </Row>
        </Container>
      </div>
    </>
  )
}

export default AllProducts
