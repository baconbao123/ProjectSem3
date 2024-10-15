import React, { useEffect, useState } from 'react'
import Breadcrumb from '../../Components/Breadcrumb/Breadcrumb'
import { Col, Container, Row } from 'react-bootstrap'
import './ProductDetail.scss'
import { Button } from 'primereact/button'
import { BsCartPlus } from 'react-icons/bs'
import { SlPaypal } from 'react-icons/sl'
import { useNavigate, useParams } from 'react-router-dom'
import { Galleria, GalleriaResponsiveOptions } from 'primereact/galleria'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../Store/store'
import Swal from 'sweetalert2'
import { addProductToCart, setUserId } from '../../Store/cartSlice'
import { $axios } from '../../axios'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import { setLoaded, setLoading } from '../../Store/loadingSlice'
import { Skeleton } from 'primereact/skeleton'
import { CardProductRelated } from '../../Components/CardProduct/Related/CardProductRelated'
import { CardProduct } from '../../Components/CardProduct/Home/CardProduct'

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [amount, setAmount] = useState<number>(1)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [product, setProduct] = useState<any | null>(null)
  const [images, setImages] = useState<any[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const userId = useSelector((state: RootState) => state.auth.userId)
  const isLoading = useSelector((state: RootState) => state.loading.isLoading)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbItem[]>([])
  const home = { label: 'Home', url: '/home', page: false }

  interface BreadcrumbItem {
    label: string
    url: string
    page?: boolean
  }

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await $axios.get(`ProductFE/${id}`)
        const productData = res.data.data[0]
        setProduct(productData)
        const category = productData.Categories[0]

        if (category) {
          const items: BreadcrumbItem[] = [
            { label: category.Name, url: `/category/${category.Id}`, page: false },

            { label: productData.Name, url: `/products/details/${productData.Id}`, page: true }
          ]

          setBreadcrumbItems(items)
        }
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

        if (productData.Categories && productData.Categories.length > 0) {
          const categoryId = productData.Categories[0].Id
          const relatedRes = await $axios.get(`ProductFE/category/${categoryId}`)
          setRelatedProducts(relatedRes.data.data)
        }
      } catch {
        dispatch(setLoaded())
      } finally {
        dispatch(setLoaded())
      }
    }

    dispatch(setLoading())
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

    // Dispatch action to set the user ID
    dispatch(setUserId(userId))

    // Define the key for localStorage
    const cartKey = `cart_${userId}`

    // Get the current cart from localStorage
    const existingCartString = localStorage.getItem(cartKey)

    // Parse the existing cart, default to an empty object if null
    const existingCart = existingCartString ? JSON.parse(existingCartString) : {}

    // Ensure that the amount is treated as a number
    const currentAmount = amount

    // Check if the product already exists in the cart
    if (existingCart[product.id]) {
      // Add the new amount to the old amount
      existingCart[product.id].amount += currentAmount
    } else {
      // If it doesn't exist, add the product with the current amount
      existingCart[product.id] = { ...product, amount: currentAmount }
    }

    // Save the updated cart back to localStorage
    localStorage.setItem(cartKey, JSON.stringify(existingCart))

    // Dispatch the action to add the product to the cart in Redux
    dispatch(addProductToCart({ ...product, amount: existingCart[product.id].amount }))

    // Show a success message that the product has been added to the cart
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

    navigate('/checkout/cart')
  }

  const handlePrevImage = () => {
    console.log('Prev image clicked')
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
  }

  const handleNextImage = () => {
    console.log('Next image clicked')
    setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
  }

  const footerContent = (
    <div className='galleria-nav-buttons'>
      <Button
        className='gallery-prev'
        onClick={handlePrevImage}
        style={{ pointerEvents: 'auto', opacity: 1, cursor: 'pointer' }}
      >
        <IoIosArrowBack style={{ fontSize: '1.6rem' }} className='icon' />
      </Button>
      <Button
        className='gallery-next'
        onClick={handleNextImage}
        style={{ pointerEvents: 'auto', opacity: 1, cursor: 'pointer' }}
      >
        <IoIosArrowForward style={{ fontSize: '1.6rem' }} className='icon' />
      </Button>
    </div>
  )

  return (
    <>
      <Breadcrumb home={home} items={breadcrumbItems} />
      {isLoading ? (
        <>
          <div className='container-product-skeleton'>
            <Container>
              <Row>
                <Col lg={3}>
                  <Skeleton width='100%' height='170px'></Skeleton>
                </Col>
                <Col lg={9}>
                  <Skeleton width='100%' height='170px'></Skeleton>
                </Col>
              </Row>
              <Row className='mt-3'>
                <Col lg={12}>
                  <Skeleton width='100%' height='400px'></Skeleton>
                </Col>
              </Row>
              <Row className='mt-3'>
                <Col lg={12}>
                  <Skeleton width='100%' height='400px'></Skeleton>
                </Col>
              </Row>
            </Container>
          </div>
        </>
      ) : (
        <>
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
                      <Row className='row-2'>
                        <Col lg={6}>
                          Code: <span className='span-publishing'>{product.Code}</span>
                        </Col>
                        <Col lg={6}>
                          Category:{' '}
                          {product.Categories.map(
                            (category: any, index: any) =>
                              category.Level === 1 && (
                                <span className='span-publishing' key={index}>
                                  {category.Name} &nbsp;
                                </span>
                              )
                          )}
                        </Col>
                      </Row>
                      <Row className='row-3'>
                        <div className='container-details-sale-price'>
                          <span className='price-sale'>$ {product.SellPrice}</span>
                        </div>
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
                              onChange={(e: any) => setAmount(Number(e.target.value))}
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
                        </div>
                      </Row>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <div className='container-details-product-content'>
                    <Row>
                      <div className='container-description-content'>
                        <Row>
                          <span className='details-title'>Product Description</span>
                        </Row>
                        <Row>
                          <div
                            className='description-content'
                            dangerouslySetInnerHTML={{ __html: product.Description }}
                          />
                        </Row>
                      </div>
                    </Row>
                  </div>
                </Row>
              </Container>
            )}
          </div>
          <div className='container-product-similar'>
            <Container className='container-products-content'>
              <Row>
                <span className='title-related-products'>Related products</span>
              </Row>
              <Row>
                {relatedProducts.filter((relatedProduct) => relatedProduct.Id !== product?.Id).length > 0 ? (
                  relatedProducts
                    .filter((relatedProduct) => relatedProduct.Id !== product?.Id)
                    .map((relatedProduct) => (
                      <Col key={relatedProduct.Id} lg={2}>
                        <CardProduct product={relatedProduct} />
                      </Col>
                    ))
                ) : (
                  <Col>
                    <div className='mess-no-similar'>No similar products available.</div>
                  </Col>
                )}
              </Row>
            </Container>
          </div>
        </>
      )}
    </>
  )
}

export default ProductDetail
