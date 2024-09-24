import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { RiPaypalLine } from 'react-icons/ri'
import { BsCartPlus } from 'react-icons/bs'
import './CardProduct.scss'

interface CardProductProps {
  Name: string
  ProductImage: string[]
  Manufactor: string
  BasePrice: string
  SellPrice: string
  special: string
}

function sliceText(text: string) {
  return text.length > 20 ? text.slice(0, 20) + '...' : text
}

export const CardProduct: React.FC<CardProductProps> = ({
  Name,
  ProductImage,
  special,
  Manufactor,
  BasePrice,
  SellPrice
}) => {
  const header = (
    <div className='header-img'>
      <img alt='Card' src={ProductImage[0]} className='img-card' />
      {special && <span className='badge'>{special}</span>}
    </div>
  )
  const footer = (
    <div className='card-btn'>
      <Button icon={<BsCartPlus style={{ fontSize: '16px' }} />} className='btncart' />
      <Button label='Buy Now' icon={<RiPaypalLine style={{ fontSize: '14px' }} />} className='btn-buynow' />
    </div>
  )

  return (
    <div className='card-product'>
      <Card title={sliceText(Name)} subTitle={Manufactor} footer={footer} header={header} >
        {SellPrice && SellPrice !== '' && (
          <div className='card-price-sale'>
            <p className='price-base'>$ {BasePrice}</p> &nbsp;&nbsp;
            <p className='price-sale'>$ {SellPrice}</p>
          </div>
        )}
        {!SellPrice && SellPrice == '' && (
          <div className='card-price'>
            <p className='price-base'>$ {BasePrice}</p>
          </div>
        )}
      </Card>
    </div>
  )
}
