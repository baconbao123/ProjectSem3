import React, { useEffect, useState } from 'react'
import './Cart.scss'
import { Col, Container, Row } from 'react-bootstrap'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import CardVoucher, { CardVoucherProps } from '../../Components/CardVoucher/CardVoucher'
import CardProductPay from '../../Components/CardProduct/Cart/CardProductPay'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../Store/store'
import { setUserId } from '../../Store/cartSlice'
import RequiredLogin from '../../Components/RequiredLogin/RequiredLogin'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { calculateTotalPrice } from '../../utils'

const Cart: React.FC = () => {
  // Voucher
  const [vouchers, setVouchers] = useState<CardVoucherProps[]>([])
  const [dialogVoucher, setDialogVoucher] = useState<boolean>(false)

  // Checked
  const [countItems, setCountItems] = useState<number>(0)
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false)

  // Total
  const [total, setTotal] = useState<number>(0)
  const [amounts, setAmounts] = useState<{ [key: string]: number }>({})

  const cartItems = useSelector((state: RootState) => state.cart.items)
  const userIdAuth = useSelector((state: RootState) => state.auth.userId)

  const navigate = useNavigate()

  const dispatch = useDispatch()

  // Set userId in cart
  useEffect(() => {
    if (userIdAuth) {
      dispatch(setUserId(userIdAuth))
    }
  }, [userIdAuth])

  useEffect(() => {
    if (userIdAuth) {
      const storeProducts = JSON.parse(localStorage.getItem(`productChecked_${userIdAuth}`) || '[]')
      const ids = storeProducts.map((item: any) => item.Id)
      const amountsFromStorage = storeProducts.reduce((acc: { [key: string]: number }, item: any) => {
        acc[item.Id] = item.quantity
        return acc
      }, {})

      setSelectedItems(ids)
      setCountItems(ids.length)
      setSelectAllChecked(ids.length === cartItems.length)
      setAmounts(amountsFromStorage)
    }
  }, [cartItems, userIdAuth])

  // Check Items
  const handleCheck = (id: number, checked: boolean, totalPrice: number) => {
    let newSelectedItems
    if (checked) {
      newSelectedItems = [...selectedItems, id]
      setTotal(total + totalPrice)
    } else {
      newSelectedItems = selectedItems.filter((itemId) => itemId !== id)
      setTotal(total - totalPrice)
    }

    // Cập nhật selectedItems
    setSelectedItems(newSelectedItems)
    setCountItems(newSelectedItems.length)

    // Kiểm tra nếu tất cả các mục đã được chọn
    setSelectAllChecked(newSelectedItems.length === cartItems.length)
  }

  const handleAmountChange = (productId: string, newAmount: number) => {
    setAmounts((prev) => ({
      ...prev,

      [productId]: newAmount
    }))
  }

  // Check All Items
  const handleCheckedAll = (checked: boolean) => {
    setSelectAllChecked(checked)

    if (checked) {
      const allItemsId = cartItems.map((item) => item.Id)
      setSelectedItems(allItemsId)
      setCountItems(cartItems.length)

      localStorage.removeItem(`productChecked_${userIdAuth}`)

      const productsToStore = cartItems.map((item) => ({
        ...item,

        quantity: amounts[item.Id] || 1
      }))

      localStorage.setItem(`productChecked_${userIdAuth}`, JSON.stringify(productsToStore))
    } else {
      setSelectedItems([])
      setCountItems(0)
      localStorage.removeItem(`productChecked_${userIdAuth}`)
    }
  }

  useEffect(() => {
    let newTotal = 0
    selectedItems.forEach((itemId) => {
      const item = cartItems.find((p) => p.Id === itemId)
      const itemAmount = amounts[itemId] || 1
      if (item) {
        const cardTotalPrice = calculateTotalPrice(item.SellPrice, itemAmount.toString())
        newTotal += cardTotalPrice
      }
    })

    setTotal(newTotal)
  }, [selectedItems, cartItems, amounts])

  const handlePaymentClick = () => {
    if (selectedItems.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Select product',
        text: 'Please select a product to proceed with payment.',
        confirmButtonText: 'OK'
      })
    } else {
      navigate('/checkout')
    }
  }

  // Handle Voucher
  // Fetch voucher By User Id
  useEffect(() => {
    const claimedVouchers = localStorage.getItem(`voucherClaimed_${userIdAuth}`)
    if (claimedVouchers) {
      const parsedVouchers = JSON.parse(claimedVouchers)
      const vouchersWithUserId = parsedVouchers.map((v: any) => ({
        ...v,
        userId: userIdAuth
      }))
      setVouchers(vouchersWithUserId)
    }
  }, [userIdAuth])

  return (
    <div className='cart-container'>
      {userIdAuth ? (
        cartItems && cartItems.length > 0 ? (
          <Container>
            {/* Heading */}
            <Row className='row-heading'>
              <Col lg={4}>
                <span style={{ fontWeight: '600' }}>CART</span>
              </Col>
            </Row>

            {/* Content */}
            <Row>
              {/* Container Left */}
              <Col lg={8}>
                {/* Row select */}
                <Row className='row-select'>
                  {/* Checked All */}
                  <Col lg={8} style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type='checkbox'
                      className='check-items'
                      checked={selectAllChecked}
                      onChange={(e) => handleCheckedAll(e.target.checked)}
                    />
                    <span className='span-select'>Select All ({countItems} items)</span>
                  </Col>
                  <Col lg={2} style={{ display: 'flex', justifyContent: 'center' }}>
                    <span className='span-amount'> Amount</span>
                  </Col>
                  <Col lg={2} style={{ display: 'flex', justifyContent: 'start' }}>
                    <span className='span-total'>Price</span>
                  </Col>
                </Row>

                {/* Cart products items */}
                {/* Container items */}
                <Row className='container-item'>
                  {cartItems.map((p, index) => (
                    <Row key={index} className='row-item'>
                      <CardProductPay
                        product={p}
                        onCheck={handleCheck}
                        isChecked={selectedItems.includes(p.Id)}
                        onAmountChange={(newAmount: number) => handleAmountChange(p.Id.toString(), newAmount)}
                        amount={amounts[p.Id] || 1} // Pass amount from state; default to 1 if not found
                      />
                    </Row>
                  ))}
                </Row>
              </Col>

              {/* Container Right - Vouchers and Total */}
              <Col lg={4}>
                <div className='container-right'>
                  {/* Voucher */}
                  <Row className='row-voucher'>
                    <div className='select-voucher'>
                      <span className='span-select'>Select Voucher</span>
                      <Button label='Select' className='btn-select' onClick={() => setDialogVoucher(!dialogVoucher)} />
                      <Dialog
                        header='Select Voucher'
                        visible={dialogVoucher}
                        onHide={() => {
                          if (!dialogVoucher) return
                          setDialogVoucher(false)
                        }}
                        style={{ width: '30vw' }}
                        breakpoints={{ '960px': '75vw', '641px': '100vw' }}
                      >
                        {vouchers.map((v: any, index: any) => (
                          <div className='mt-4' key={index}>
                            <CardVoucher key={v.Id} initVoucher={v} />
                          </div>
                        ))}
                      </Dialog>
                    </div>

                    <div className='solid'></div>

                    <div className='show-vouchers'>
                      {/* {vouchers
                        .filter((v) => v.status === 'USED')
                        .map((v, index) => (
                          <div className='mt-4' key={index}>
                            <CardVoucher key={v.id}  />
                          </div>
                        ))} */}
                    </div>
                  </Row>
                  {/* End Select Voucher */}

                  <Row className='row-payment'>
                    <div className='payment-heading'>
                      <span className='span-title'>Total</span>
                      <span className='span-total'>$ {total}</span>
                    </div>
                    <div className='payment'>
                      <Button label='PAYMENT' className='btn-payment' onClick={handlePaymentClick} />
                    </div>
                  </Row>
                </div>
              </Col>
            </Row>
          </Container>
        ) : (
          <div className='notfound-product'>
            <img src='/images/not-found-cart.png' alt='not found' />
          </div>
        )
      ) : (
        <RequiredLogin />
      )}
    </div>
  )
}

export default Cart
