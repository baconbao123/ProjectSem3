import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { RiPaypalLine } from 'react-icons/ri'
import './CardProduct.scss'
import { BsCartPlus } from 'react-icons/bs'
import Product from '../../Interfaces/Product'

interface CardProductProps {
  product: Product
}

function sliceText(text: string) {
  return text.length > 20 ? text.slice(0, 20) + '...' : text
}

export const CardProduct: React.FC<CardProductProps> = ({ product }) => {
  const header = (
    <>
      {/* <img alt='Card' src={product.ProductImage[0]} className='img-card' /> */}
      <img alt='Card' src="https://itbook.store/img/books/9781617291609.png" className='img-card' />

    </>
  )
  const footer = (
    <div className='card-btn'>
      <Button icon={<BsCartPlus style={{ fontSize: '16px' }} />} className='btncart' />
      <Button label='Buy Now' icon={<RiPaypalLine style={{ fontSize: '14px' }} />} className='btn-buynow' />
    </div>
  )

  return (
    <div className='card-product'>
      <Card title={sliceText(product.Name)} subTitle={product.Author} footer={footer} header={header}>
        {/* {special && <span className='badge'>{special}</span>} */}
        {product.SellPrice && product.SellPrice !== '' && (
          <div className='card-price-sale'>
            <p className='price-base'>$ {product.BasePrice}</p>
            <p className='price-sale'>$ {product.SellPrice}</p>
          </div>
        )}
        {!product.SellPrice && product.SellPrice == '' && (
          <div className='card-price'>
            <p className='price-base'>$ {product.BasePrice}</p>
          </div>
        )}
      </Card>
    </div>
  )
}
