import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { $axios } from '../../axios'
import { CardProduct } from '../../Components/CardProduct/Home/CardProduct'
import './BestSeller.scss'

const BestSeller: React.FC = () => {
  const [categories, setCategories] = useState<any[] | []>([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await $axios.get('CategoriesFE')
        const sortedCategories = res.data.data.map((category: any) => ({
          ...category,
          Products: category.Products.filter((product: any) => product.SellPrice !== null).sort((a: any, b: any) => {
            const dateDiff = new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime()
            if (dateDiff === 0) {
              return b.SellPrice - a.SellPrice
            }
            return dateDiff
          })
        }))
        setCategories(sortedCategories)
        // setCategories(res.data.data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className='container-newrelease-content-master'>
      <img src='/images/best-seller.png' className='img-release' alt='New Release' />

      <div className='container-newrelease-content'>
        <Container className='all-products'>
          {categories.map(
            (category, index) =>
              category.Level === 0 && (
                <div key={index} className={`all-products-block ${index > 0 ? 'mt-5' : ''}`}>
                  <div className='category-name-container'>
                    <span className='category-name'>{category.Name}</span>
                  </div>

                  <Row className='row-products'>
                    {category.Products.slice(0, 18).map((product: any, productIndex: number) => (
                      <Col key={productIndex} lg={2} md={4} sm={6} xs={12} className='mb-4'>
                        <CardProduct product={product} />
                      </Col>
                    ))}
                  </Row>
                </div>
              )
          )}
        </Container>
      </div>
    </div>
  )
}

export default BestSeller
