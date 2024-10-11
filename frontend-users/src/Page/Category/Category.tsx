import { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import './Category.scss'
import { CardProduct } from '../../Components/CardProduct/Home/CardProduct'
import { Link, useParams } from 'react-router-dom'
import Loading from '../../Components/Loading/Loading'
import { $axios } from '../../axios'
import BannerCategory from './Banner/BannerCategory'

function Category() {
  const [loading, setLoading] = useState<boolean>(true)
  const [categories, setCategories] = useState<any[]>([])
  const { category } = useParams<{ category: string }>()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await $axios.get('CategoriesFE')
        const allCategories = res.data.data
        const parentCategory = allCategories.find((cate: any) => cate.Name.toLowerCase() === category?.toLowerCase())

        if (parentCategory) {
          const childCategories = allCategories.filter((cate: any) => cate.ParentId === parentCategory.Id)
          setCategories([parentCategory, ...childCategories])
        }
      } catch (err) {
        console.log(err)
      }
      setLoading(false)
    }

    fetchProducts()
  }, [category])

  return (
    <>
      <div className='container-all-books'>
        <BannerCategory />
        <div className='mt-3'></div>

        {loading ? (
          <Loading />
        ) : (
          <div className='container-all-books-content'>
            <Container className='all-products' style={{ marginTop: '10px' }}>
              <Row>
                {categories?.map((category: any, index: any) => (
                  <div key={index}>
                    {category.Level === 0 && (
                      <>
                        {categories
                          .filter(
                            (subCategory: any) =>
                              subCategory.Level === 1 &&
                              subCategory.ParentId === category.Id &&
                              subCategory.Products.length > 0
                          )
                          .map((subCategory: any, subIndex: any) => (
                            <div key={subIndex} className='block'>
                              <div className='block-wrapper'>
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
                            </div>
                          ))}
                      </>
                    )}
                  </div>
                ))}
              </Row>
            </Container>
          </div>
        )}
      </div>
    </>
  )
}

export default Category
