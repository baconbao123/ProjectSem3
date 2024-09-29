import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import './CardProductPay.scss'
import Product from '../../../Interfaces/Product'
import { calculateTotalPrice, sliceText } from '../../../utils'
import { useDispatch } from 'react-redux'
import { clearProductInCart } from '../../../Store/cartSlice'

export interface CardProductPayProps {
  product: Product
  isChecked: boolean
  onCheck: (id: number, checked: boolean) => void
  updateTotal: (newTotal: number) => void
}

const CardProductPay: React.FC<CardProductPayProps> = ({ product, onCheck, isChecked, updateTotal }) => {
  const [localChcked, setLocalChecked] = useState<boolean>(isChecked)
  const [amount, setAmount] = useState<number>(1)

  const dispatch = useDispatch()

  // Handle Click Increase and Decrease
  const handleDecrease = () => {
    if (amount > 1) {
      setAmount(amount - 1)
    }
  }

  const handleIncrease = () => {
    setAmount(amount + 1)
  }

  // hanle checked
  useEffect(() => {
    setLocalChecked(isChecked)
  }, [isChecked])

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    setLocalChecked(checked)
    onCheck(product.Id, checked)

    if(checked) {
      updateTotal(totalPrice)
    } else {
      updateTotal(-totalPrice)
    }
  }


  // Total Price By Item
  const totalPrice = product.SellPrice
    ? calculateTotalPrice(product.SellPrice, amount.toString())
    : calculateTotalPrice(product.BasePrice, amount.toString())

  // Update Total Price Of Order
  useEffect(() => {
    if (isChecked) {
      updateTotal(totalPrice)
    } else {
      updateTotal(0)
    }

    return () => {
      if (isChecked) {
        updateTotal(-totalPrice)
      }
    }
  }, [amount, isChecked, totalPrice, updateTotal])

    // Handle remove a product
    const handleRemoveAPoduct = (productId: number) => {
      dispatch(clearProductInCart(productId))
    }

    const handleDeleteClick = (e:  React.MouseEvent<HTMLElement>) => {
      e.stopPropagation()
      handleRemoveAPoduct(product.Id)
    }
  

  return (
    <Row>
      <Col lg={3}>
        <div className='div-left'>
          <input type='checkbox' className='check-items' checked={localChcked} onChange={handleCheckboxChange} />
          <img src={product.ProductImage[0]} className='img-card' />
        </div>
      </Col>
      <Col lg={5} className='content-books'>
        <span className='title'>{sliceText(product.Name, 90)}</span>
        {product.SellPrice ? (
          <div className='card-price'>
            <span className='sell-price'>$ {product.SellPrice}</span>
            <span className='base-price'>$ {product.BasePrice}</span>
          </div>
        ) : (
          <div className='card-price-1'>
            <span className='base-price'>$ {product.BasePrice}</span>
          </div>
        )}
      </Col>
      <Col lg={2} className='container-amount'>
        <div className='counter-amount'>
          <span className='sign-sub' onClick={handleDecrease}>
            -
          </span>
          <span>{amount}</span>
          <span className='sign-plus' onClick={handleIncrease}>
            +
          </span>
        </div>
      </Col>
      <Col lg={1} className='container-price'>
        {totalPrice.toFixed(1)}
      </Col>
      <Col lg={1} className='container-trash'>
        <i className='pi pi-trash' onClick={handleDeleteClick}/>
      </Col>
    </Row>
  )
}

export default CardProductPay
