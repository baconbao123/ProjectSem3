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
import { Link } from 'react-router-dom'

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

  const cartItems = useSelector((state: RootState) => state.cart.items)
  const userIdAuth = useSelector((state: RootState) => state.auth.userId)

  // Set Category in Product
  const uniqueCategory = [...new Set(cartItems.map((item) => item.CategoryName))]

  const dispatch = useDispatch()

  // Set userId in cart
  useEffect(() => {
    if (userIdAuth) {
      dispatch(setUserId(userIdAuth))
    }
  }, [userIdAuth])

  // Check Items
  const handleCheck = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id])
    } else {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id))
    }

    setCountItems(selectedItems.length + (checked ? 1 : -1))
  }

  // Check All Items
  const handleCheckedAll = (checked: boolean) => {
    setSelectAllChecked(checked)

    if (checked) {
      const allItemsId = cartItems.map((item) => item.Id)
      setSelectedItems(allItemsId)
      setCountItems(cartItems.length)
    } else {
      setSelectedItems([])
      setCountItems(0)
    }
  }

  useEffect(() => {
    if (selectedItems.length === cartItems.length) {
      setSelectAllChecked(true)
    } else {
      setSelectAllChecked(false)
    }
  }, [selectedItems, cartItems.length])

  // Handle total order
  const handleTotal = (newTotal: number) => {
    setTotal((prevTotal) => prevTotal + newTotal)
  }

  // Handle Voucher
  // Fetch voucher By User Id
  useEffect(() => {
    const claimedVouchers = localStorage.getItem(`voucherClaimed_${userIdAuth}`)
    if (claimedVouchers) {
      const parsedVouchers = JSON.parse(claimedVouchers)
      // Ensure each voucher has a userId
      const vouchersWithUserId = parsedVouchers.map((v: any) => ({
        ...v,
        userId: userIdAuth // Ensure userId is included
      }))
      setVouchers(vouchersWithUserId)
      console.log(vouchersWithUserId) // Debug log
    }
  }, [userIdAuth])

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumIntegerDigits: 1,
    maximumFractionDigits: 1
  }).format(total)

  return (
    <div className='cart-container'>
      {userIdAuth ? (
        cartItems && cartItems.length > 0 ? (
          <Container>
            {/* Heading */}
            <Row className='row-heading'>
              <Col lg={4}>CART</Col>
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
                    <span className='span-amount'>Total Amount</span>
                  </Col>
                  <Col lg={1} style={{ display: 'flex', justifyContent: 'center' }}>
                    <span className='span-total'>Price</span>
                  </Col>
                  <Col lg={1}></Col>
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
                        updateTotal={handleTotal}
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
                      <span className='span-total'>{formattedPrice}</span>
                    </div>
                    <div className='payment'>
                      <Link to='/checkout'>
                        <Button label='PAYMENT' className='btn-payment' />
                      </Link>
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
