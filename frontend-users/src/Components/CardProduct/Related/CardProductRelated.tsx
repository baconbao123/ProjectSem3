import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { RiPaypalLine } from 'react-icons/ri'
import { BsCartPlus } from 'react-icons/bs'
import './CardProductRelated.scss'
import { Link, useNavigate } from 'react-router-dom'
import { sliceText } from '../../../utils'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../Store/store'
import Swal from 'sweetalert2'
import { addProductToCart, setUserId } from '../../../Store/cartSlice'
import Product from '../../../Interfaces/Product'

interface CardProductProps {
  product: Product
}

export const CardProductRelated: React.FC<CardProductProps> = ({ product }) => {
  console.log(product)

  const userId = useSelector((state: RootState) => state.auth.userId)
  const dispatch = useDispatch()
  const navigate = useNavigate()

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
      Swal.fire('Sign up or log in to purchase products immediately')
      return
    }

    navigate('/checkout')
  }

  const header = (
    <div className='header-img'>
      <Link to={`/products/details/${product.Id}`}>
        <img
          alt='Card'
          src={`${import.meta.env.VITE_API_BACKEND_PATH}/${product.ImageThumbPath}`}
          className='img-card'
        />
        {product.special && <span className='badge'>{product.special}</span>}
      </Link>
    </div>
  )
  const footer = (
    <div className='card-btn'>
      <Button icon={<BsCartPlus style={{ fontSize: '16px' }} />} className='btncart' onClick={handleAddToCart} />
      <Button
        label='Buy Now'
        icon={<RiPaypalLine style={{ fontSize: '14px' }} />}
        className='btn-buynow'
        onClick={handleBuyNow}
      />
    </div>
  )

  return (
    <div className='card-product-related'>
      <Card
        title={<Link to={`/products/details/${product.Id}`}>{sliceText(product.Name, 35)}</Link>}
        subTitle={product.CompanyPartnerName}
        footer={footer}
        header={header}
      >
        {product.SellPrice && product.SellPrice !== '' && (
          <div className='card-price-sale'>
            <p className='price-sale'>$ {product.SellPrice}</p>
          </div>
        )}
      </Card>
    </div>
  )
}
