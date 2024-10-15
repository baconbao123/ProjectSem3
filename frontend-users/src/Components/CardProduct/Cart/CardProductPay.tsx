import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import './CardProductPay.scss'
import Product from '../../../Interfaces/Product'
import { calculateTotalPrice, sliceText } from '../../../utils'
import { useDispatch, useSelector } from 'react-redux'
import { clearProductInCart } from '../../../Store/cartSlice'
import { RootState } from '../../../Store/store'
import { Link } from 'react-router-dom'

export interface CardProductPayProps {
  product: Product
  isChecked: boolean
  onCheck: (id: number, checked: boolean, totalPrice: number) => void
  onAmountChange: (newAmount: number) => void
  amount: number
}

const CardProductPay: React.FC<CardProductPayProps> = ({ product, onCheck, isChecked, onAmountChange, amount }) => {
  const [localChecked, setLocalChecked] = useState<boolean>(isChecked)
  const [currentAmount, setCurrentAmount] = useState<number>(amount)
  const userId = useSelector((state: RootState) => state.auth.userId)
  const totalPrice = calculateTotalPrice(product.SellPrice, amount.toString())
  const dispatch = useDispatch()

  useEffect(() => {
    setCurrentAmount(amount)
  }, [amount])

  const handleIncrease = () => {
    const newAmount = amount + 1
    setCurrentAmount(newAmount)
    onAmountChange(newAmount)
    updateLocalStorage(localChecked, newAmount)
  }

  const handleDecrease = () => {
    const newAmount = Math.max(amount - 1, 1)
    setCurrentAmount(newAmount)
    onAmountChange(newAmount)
    updateLocalStorage(localChecked, newAmount)
  }

  // Handle checked state
  useEffect(() => {
    setLocalChecked(isChecked)
  }, [isChecked])

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    setLocalChecked(checked)
    onCheck(product.Id, checked, totalPrice)

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
          <Link to={`/products/details/${product.Id}`}>
            <img src={`${import.meta.env.VITE_API_BACKEND_PATH}/${product.ImageThumbPath}`} className='img-card' />
          </Link>
        </div>
      </Col>
      <Col lg={5} className='content-books'>
        <Link to={`/products/details/${product.Id}`} className='url'>
          <span className='title'>{sliceText(product.Name, 90)}</span>
        </Link>
        {product.SellPrice && (
          <div className='card-price'>
            <span className='sell-price'>$ {product.SellPrice}</span>
          </div>
        )}
      </Col>
      <Col lg={2} className='container-amount' style={{ display: 'flex', justifyContent: 'end' }}>
        <div className='counter-amount'>
          <span className='sign-sub' onClick={handleDecrease}>
            -
          </span>
          <span>{currentAmount}</span>
          <span className='sign-plus' onClick={handleIncrease}>
            +
          </span>
        </div>
      </Col>
      <Col lg={2} className='container-price'>
        <div className='content-price'>
          {totalPrice}
          <i className='pi pi-trash' onClick={handleDeleteClick} />
        </div>
      </Col>
    </Row>
  )
}

export default CardProductPay
