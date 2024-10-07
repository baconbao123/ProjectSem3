import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import './CardProductPay.scss'
import Product from '../../../Interfaces/Product'
import { calculateTotalPrice, sliceText } from '../../../utils'
import { useDispatch, useSelector } from 'react-redux'
import { clearProductInCart } from '../../../Store/cartSlice'
import { RootState } from '../../../Store/store'

export interface CardProductPayProps {
  product: Product
  isChecked: boolean
  onCheck: (id: number, checked: boolean) => void
  updateTotal: (newTotal: number) => void
}

const CardProductPay: React.FC<CardProductPayProps> = ({ product, onCheck, isChecked, updateTotal }) => {
  const [localChecked, setLocalChecked] = useState<boolean>(isChecked)
  const [amount, setAmount] = useState<number>(1)
  const userId = useSelector((state: RootState) => state.auth.userId)

  const dispatch = useDispatch()

  // Handle Click Increase and Decrease
  const handleDecrease = () => {
    if (amount > 1) {
      setAmount((prev) => {
        const newAmount = prev - 1
        updateLocalStorage(localChecked, newAmount)
        return newAmount
      })
    }
  }

  const handleIncrease = () => {
    setAmount((prev) => {
      const newAmount = prev + 1
      updateLocalStorage(localChecked, newAmount)
      return newAmount
    })
  }

  // Handle checked state
  useEffect(() => {
    setLocalChecked(isChecked)
  }, [isChecked])

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    setLocalChecked(checked)
    onCheck(product.Id, checked)

    // Only update the total based on the checkbox state
    if (checked) {
      updateTotal(totalPrice)
    } else {
      updateTotal(-totalPrice)
    }

    // Update localStorage
    updateLocalStorage(checked)
  }

  // Retrieve existing checked products from localStorage
  const getCheckedProducts = () => {
    const storeProducts = localStorage.getItem(`productChecked_${userId}`)
    return storeProducts ? JSON.parse(storeProducts) : []
  }

  // Update localStorage when the checkbox is changed
  const updateLocalStorage = (checked: boolean, updatedAmount: number = amount) => {
    let storedProducts = getCheckedProducts()

    if (checked) {
      const exists = storedProducts.some((p: any) => p.Id === product.Id)

      if (!exists) {
        storedProducts.push({ ...product, quantity: updatedAmount })
      } else {
        storedProducts = storedProducts.map((p: any) => (p.Id === product.Id ? { ...p, quantity: updatedAmount } : p))
      }
    } else {
      storedProducts = storedProducts.filter((p: any) => p.Id !== product.Id)
    }

    localStorage.setItem(`productChecked_${userId}`, JSON.stringify(storedProducts))
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

  const handleDeleteClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    handleRemoveAPoduct(product.Id)
  }

  return (
    <Row>
      <Col lg={3}>
        <div className='div-left'>
          <input type='checkbox' className='check-items' checked={localChecked} onChange={handleCheckboxChange} />
          <img src='https://itbook.store/img/books/9781617291609.png' className='img-card' />
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
        <i className='pi pi-trash' onClick={handleDeleteClick} />
      </Col>
    </Row>
  )
}

export default CardProductPay
