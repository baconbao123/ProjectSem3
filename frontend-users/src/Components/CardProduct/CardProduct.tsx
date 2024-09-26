import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { RiPaypalLine } from 'react-icons/ri'
import './CardProduct.scss'
import { BsCartPlus } from 'react-icons/bs'

interface CardProductProps {
  title: string
  image: string
  special: string
  author: string
  price: string
  priceSale: string
}

function sliceText ( text: string) {
  return text.length > 20 ? text.slice(0, 20) + '...' : text;
}


export const CardProduct: React.FC<CardProductProps> = ({ title, image, special, author, price, priceSale }) => {
  const header = (
    <>
      <img alt='Card' src={image} className='img-card'/>
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
      <Card title={sliceText(title)} subTitle={author} footer={footer} header={header}>
        {special && <span className='badge'>{special}</span>}
        {priceSale && priceSale !== '' && (
          <div className='card-price-sale'>
            <p className='price-base'>$ {price}</p>
            <p className='price-sale'>$ {priceSale}</p>
          </div>
        )}
        {!priceSale && priceSale == '' && (
          <div className='card-price'>
            <p className='price-base'>$ {price}</p>
          </div>
        )}
      </Card>
    </div>
  )
}
