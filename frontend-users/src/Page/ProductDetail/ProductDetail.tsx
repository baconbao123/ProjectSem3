import React, { useEffect, useState } from 'react'
import Breadcrumb from '../../Components/Breadcrumb/Breadcrumb'
import { Col, Container, Row } from 'react-bootstrap'
import './ProductDetail.scss'
import { Rating } from 'primereact/rating'
import { Button } from 'primereact/button'
import { BsCartPlus } from 'react-icons/bs'
import { SlPaypal } from 'react-icons/sl'
import { useNavigate, useParams } from 'react-router-dom'
import { Galleria, GalleriaResponsiveOptions } from 'primereact/galleria'
import CardRating from '../../Components/CardRating/CardRating'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../Store/store'
import Swal from 'sweetalert2'
import { addProductToCart, setUserId } from '../../Store/cartSlice'
import { $axios } from '../../axios'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'

const rating = [
  {
    Name: 'Phoebe',
    Value: '4.5',
    Desc: '123'
  }
]

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const home = { label: 'Home', url: '/home' }
  const items = [{ label: 'Detail', url: `/products/details/${id}`, page: false }]
  const [amount, setAmount] = useState<number>(1)

  const [product, setProduct] = useState<any | null>(null)
  const [images, setImages] = useState<any[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const userId = useSelector((state: RootState) => state.auth.userId)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await $axios.get(`ProductFE/${id}`)
        const productData = res.data.data[0]
        setProduct(productData)
        console.log(res.data)

        if (productData.ProductImages) {
          const formattedImages = productData.ProductImages.map((url: string) => {
            const fullUrl = import.meta.env.VITE_API_BACKEND_PATH + url
            console.log('Full Image URL:', fullUrl)
            return {
              itemImageSrc: fullUrl,
              thumbnailImageSrc: fullUrl,
              alt: 'Product Image'
            }
          })
          setImages(formattedImages)
        }
      } catch (e) {
        console.log(e)
      }
    }

    fetchProduct()
  }, [id])

  // Handle Images
  const responsiveOptions: GalleriaResponsiveOptions[] = [
    {
      breakpoint: '991px',
      numVisible: 4
    },
    {
      breakpoint: '767px',
      numVisible: 3
    },
    {
      breakpoint: '575px',
      numVisible: 1
    }
  ]

  const itemTemplate = (item: any) => {
    return <img src={item.itemImageSrc} alt={item.alt} style={{ width: '100%', display: 'block' }} />
  }

  const thumbnailTemplate = (item: any) => {
    return <img src={item.thumbnailImageSrc} alt={item.alt} style={{ display: 'block' }} />
  }

  // Handle Amount
  const handleDecreaseAmount = () => {
    if (amount > 1) {
      setAmount((prev) => prev - 1)
    }
  }

  const handleIncreaseAmount = () => {
    setAmount((prev) => prev + 1)
  }

  // Hanle Buy Product
  const handleAddToCart = () => {
    if (!userId) {
      Swal.fire('Sign up or log in to add products')
      return
    }

    dispatch(setUserId(userId))
    dispatch(addProductToCart(product))

    Swal.fire({
      icon: 'success',
      title: 'Product has been added to the cart',
      showConfirmButton: false,
      timer: 1200
    })
  }

  const handleBuyNow = () => {
    if (!userId) {
      Swal.fire('Sign up or log in to add products')
      return
    }

    navigate('/checkout')
  }

  const handlePrevImage = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
  }

  const handleNextImage = () => {
    setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
  }

  const footerContent = (
    <div className='galleria-nav-buttons'>
      <Button
        className='gallery-prev'
        onClick={handlePrevImage}
        style={{ pointerEvents: 'auto', opacity: 1, cursor: 'pointer' }}
      >
        <IoIosArrowBack />
      </Button>
      <Button
        className='gallery-next'
        onClick={handleNextImage}
        style={{ pointerEvents: 'auto', opacity: 1, cursor: 'pointer' }}
      >
        <IoIosArrowForward />
      </Button>
    </div>
  )

  return (
    <>
      <Breadcrumb home={home} items={items} />
      <div className='container-product-details'>
        {product && (
          <Container>
            <Row>
              <Col lg={3} className='col-img-galleria'>
                <div className='container-galleria'>
                  <Galleria
                    value={images}
                    activeIndex={activeIndex}
                    onItemChange={(e) => setActiveIndex(e.index)}
                    responsiveOptions={responsiveOptions}
                    numVisible={5}
                    item={itemTemplate}
                    thumbnail={thumbnailTemplate}
                    style={{ maxWidth: '640px' }}
                    header={footerContent}
                  />
                </div>
              </Col>
              <Col lg={9}>
                <div className='container-details-content'>
                  <Row>
                    <div className='details-title'>{product.Name} </div>
                    <br />
                    <div className='div-rating'>
                      <span className='rating-score'>4.9</span> &nbsp;&nbsp;{' '}
                      <Rating value={5} readOnly cancel={false} className='rating-img' />
                    </div>
                  </Row>
                  <Row className='row-2'>
                    <Col lg={6}>
                      Publisher: <span className='span-publishing'>{product.CompanyPartnerName}</span>
                    </Col>
                    <Col lg={6}>
                      Author: &nbsp;
                      {product.Authors.map((author: any, index: any) => (
                        <span className='span-author' key={index}>
                          {author.Name}
                        </span>
                      ))}
                    </Col>
                  </Row>
                  <Row className='row-3'>
                    {/* {product.SellPrice ? () : ()} */}
                    <div className='container-details-sale-price'>
                      <span className='price-sale'>$ {product.SellPrice}</span> &nbsp;
                      <span className='base-price'>$ {product.BasePrice}</span>
                    </div>
                    {/* <div className='container-details-base-price'>
                <span className='base-price'>$ 55</span>
            </div> */}
                  </Row>
                  <Row className='row-4'>
                    <div className='container-amount'>
                      <span className='span-amount'>Amount: </span>
                      <div className='div-amount'>
                        <input type='button' value='-' className='decrement' onClick={handleDecreaseAmount} />
                        <input
                          type='text'
                          className='amount-input'
                          value={amount}
                          onChange={(e: any) => setAmount(e.value.target)}
                        />
                        <input type='button' value='+' className='increment' onClick={handleIncreaseAmount} />
                      </div>
                      <div className='container-quantity'>
                        <span>{product.Quantity} products</span>
                      </div>
                    </div>
                  </Row>
                  <Row className='row-5'>
                    <div className='container-btn-buy'>
                      <Button icon={<BsCartPlus />} outlined className='btn-add-to-cart' onClick={handleAddToCart}>
                        &nbsp; Add To Cart
                      </Button>
                      <Button icon={<SlPaypal />} className='btn-add-to-buy-now' onClick={handleBuyNow}>
                        &nbsp; Add To Cart
                      </Button>
                    </div>
                  </Row>
                </div>
              </Col>
            </Row>
            <Row>
              <div className='container-details-product-content'>
                <Row>
                  <span className='details-title'>Details</span>
                </Row>
                <Row>
                  <div className='table'>
                    <table border={1} className='table-details'>
                      <thead>
                        <tr>
                          <th>Product Code</th>
                          <td>031271498</td>
                        </tr>
                      </thead>
                    </table>
                  </div>

                  <div className='container-description-content'>
                    <Row>
                      <span className='details-title'>Product Description</span>
                    </Row>
                    <Row>
                      <div className='description-content' dangerouslySetInnerHTML={{ __html: product.Description }} />
                    </Row>
                  </div>
                </Row>
              </div>
            </Row>
          </Container>
        )}
      </div>
      <div className='container-rating-block'>
        <Container className='container-rating'>
          <Row>
            <Col lg={12}>
              <Row className='row-rating'>
                <div className='rating-title'>Rating</div>
              </Row>
              <Row className='mt-4'>
                <div className='card-rating'>
                  {rating.map((r, index) => (
                    <CardRating key={index} rating={r} />
                  ))}
                </div>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
      <div className='container-product-similar'>
        <Container className='container-products-content'>
          <Row>Product liên quan</Row>
        </Container>
      </div>
    </>
  )
}

export default ProductDetail
