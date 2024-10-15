import React, { useEffect, useState } from 'react'
import './Checkout.scss'
import { Col, Container, Row } from 'react-bootstrap'
import { IoLocationSharp } from 'react-icons/io5'
import CardCheckout from '../../Components/CardProduct/Checkout/CardCheckout'
import { Button } from 'primereact/button'
import { useNavigate } from 'react-router-dom'
import { Dialog } from 'primereact/dialog'
import CardAddressList from '../../Components/CardAddress/List/CardAddressList'
import { useSelector } from 'react-redux'
import { RootState } from '../../Store/store'
import { $axios } from '../../axios'
import Swal from 'sweetalert2'
import RequiredLogin from '../../Components/RequiredLogin/RequiredLogin'

const Checkout: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState<string>('COD')
  const [viewAddAddress, setViewAddAddress] = useState<boolean>(false)
  const [selectedAddress, setSelectedAddress] = useState<any>(null)
  const [checkedProducts, setCheckedProducts] = useState<any[]>([])
  const [addresses, setAddresses] = useState<any | []>([])
  const [selectedId, setSelectedId] = useState<string>('1')
  const userId = useSelector((state: RootState) => state.auth.userId)
  const navigate = useNavigate()

  useEffect(() => {
    const storedProducts = localStorage.getItem(`productChecked_${userId}`)
    if (storedProducts) {
      setCheckedProducts(JSON.parse(storedProducts))
    }
  }, [userId])

  useEffect(() => {
    const fetchAddressUser = async () => {
      if (!userId) return

      try {
        const res = await $axios.get(`AddressUserFE/GetAdressByUser/${userId}`)
        setAddresses(res.data)

        if (res.data.length > 0) {
          const defaultAddress = res.data[0]
          setSelectedId(defaultAddress.Id)
          setSelectedAddress(defaultAddress)
        }
      } catch (error) {
        console.error('Error fetching user addresses:', error)
      }
    }

    fetchAddressUser()
  }, [userId])

  const handlePayment = async () => {
    if (selectedAddress == null) {
      Swal.fire({
        title: 'Please Enter A Shipping Address!',
        icon: 'error',
        showConfirmButton: false,
        timer: 1500
      })
      return
    }

    const orderData = {
      UserId: userId,
      AddressId: selectedAddress.Id,
      BasePrice: totalAmount.toString(),
      TotalPrice: totalAmount.toString(),
      Products: checkedProducts.map((product) => ({
        ProductId: product.Id,
        Quantity: product.quantity,
        SellPrice: product.SellPrice,
        BasePrice: product.BasePrice
      }))
    }

    try {
      await $axios.post('OrderProductFE', orderData)

      const storedProducts = localStorage.getItem(`productChecked_${userId}`)
      if (storedProducts) {
        const checkedProductIds = JSON.parse(storedProducts).map((product: any) => product.Id)

        const cartItems = localStorage.getItem(`cart_${userId}`)
        if (cartItems) {
          const updatedCart = JSON.parse(cartItems).filter((item: any) => !checkedProductIds.includes(item.Id))
          localStorage.setItem(`cart_${userId}`, JSON.stringify(updatedCart))
        }

        localStorage.removeItem(`productChecked_${userId}`)
      }

      navigate('/checkout/compeleted')
    } catch (error) {
      console.error('errorMess', error)
      Swal.fire({
        title: 'Order Failed!',
        icon: 'error',
        showConfirmButton: false,
        timer: 1500
      })
    }
  }

  const totalAmount = checkedProducts.reduce((acc, product) => {
    return acc + parseFloat(product.SellPrice) * product.quantity
  }, 0)

  const totalPrice = checkedProducts.reduce((acc, product) => {
    return acc + parseFloat(product.SellPrice) * product.quantity
  }, 0)

  return (
    <>
      {userId ? (
        <div className='conatiner-checkout-products'>
          <Container className='container-checkout-content'>
            <Row className='row-checkout'>
              <span>PAYMENT</span>
            </Row>

            <Row className='row-address'>
              <div className='row-address-1'>
                <div className='div-address-heading'>
                  <IoLocationSharp className='icon' />
                  <span>Delivery Address</span>
                </div>
                <div className='div-address-change'>
                  {/* Dialog Address */}
                  <span onClick={() => setViewAddAddress(true)}>Change</span>
                  <Dialog
                    header='My Address'
                    visible={viewAddAddress}
                    style={{ width: '40vw' }}
                    onHide={() => {
                      if (!viewAddAddress) return
                      setViewAddAddress(false)
                    }}
                  >
                    <CardAddressList
                      setAddresses={setAddresses}
                      addresses={addresses}
                      selectedId={selectedId}
                      setSelectedId={setSelectedId}
                      onSelectAddress={(address: any) => {
                        setSelectedAddress(address)
                      }}
                    />
                  </Dialog>
                </div>
              </div>
              <div className='row-address-content'>
                <Row>
                  {selectedAddress ? (
                    <>
                      <Col lg={3}>
                        <span className='name'>{selectedAddress.AssignName}</span> &nbsp;
                      </Col>
                      <Col lg={2}>
                        <span className='phone'>{selectedAddress.Phone}</span>
                      </Col>
                      <Col lg={7}>
                        <span className='address'>{selectedAddress.DetailAddress}</span>
                      </Col>
                    </>
                  ) : (
                    <span>No address selected</span>
                  )}
                </Row>
              </div>
            </Row>

            <Row className='row-products'>
              <div className='row-heading'>
                <Row>
                  <Col lg={6} className='product-title'>
                    Products
                  </Col>
                  <Col lg={2} className='price'>
                    Price
                  </Col>
                  <Col lg={2} className='quantity'>
                    Quantity
                  </Col>
                  <Col lg={2} className='total'>
                    Total
                  </Col>
                </Row>
                <Row>
                  {checkedProducts.length > 0 ? (
                    checkedProducts.map((product) => <CardCheckout key={product.Id} product={product} />)
                  ) : (
                    <span>No products in cart</span>
                  )}
                </Row>
              </div>
            </Row>

            <Row className='row-payment-method'>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className='payment-method-heading'>
                  <span>Payment Method</span>
                </div>

                <div style={{ marginLeft: '20px', marginRight: '30px' }}>
                  <div className='div-cod'>
                    <input
                      type='radio'
                      className='radio'
                      name='paymentMethod'
                      value={paymentMethod}
                      onChange={(e: any) => setPaymentMethod(e.value)}
                      checked
                    />{' '}
                    &nbsp; &nbsp; <span>Cash On Delivery</span>
                  </div>
                </div>
              </div>
            </Row>

            <Row className='row-bill'>
              <div className='heading-content'>
                <span>Payment</span>
              </div>
              <div className='row-bill-content'>
                <Row>
                  <Col lg={6}></Col>
                  <Col lg={6}>
                    <div className='bill-content mt-5'>
                      <span>Total Product</span>
                      <span>$ 0</span>
                    </div>
                    <div className='bill-content'>
                      <span>Delivery fee</span>
                      <span>$ 0</span>
                    </div>
                    <div className='bill-content-bottom'>
                      <span>Total Order</span>
                      <span>$ {totalPrice}</span>
                    </div>
                    <div className='btn-payment'>
                      <Button label='Payment' className='btn-pay' onClick={handlePayment} />
                    </div>
                  </Col>
                </Row>
              </div>
            </Row>
          </Container>
        </div>
      ) : (
        <RequiredLogin />
      )}
    </>
  )
}

export default Checkout
