import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import CardVoucher, { CardVoucherProps } from '../../Components/CardVoucher/CardVoucher'
import './Voucher.scss'
import axios from 'axios'
import Breadcrumb from '../../Components/Breadcrumb/Breadcrumb'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../Store/store'
import { addVouchers, setUserId } from '../../Store/voucherSlice'
import Swal from 'sweetalert2'
import Loading from '../../Components/Loading/Loading'

const Vouchers: React.FC = () => {
  const [vouchers, setVouchers] = useState<CardVoucherProps[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const items = [{ label: 'Vouchers', url: '/vouchers', page: true }]
  const home = { icon: 'pi pi-home', url: '/home' }
  const userId = useSelector((state: RootState) => state.auth.userId)
  const dispatch = useDispatch()

  useEffect(() => {
    if (userId) {
      dispatch(setUserId(userId))
    }
  }, [userId, dispatch])

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const res = await axios.get('https://bookstore123.free.mockoapp.net/vouchers')
        let fetchedVouchers = res.data

        // Lấy voucher đã CLAIMED từ localStorage
        const claimedVouchers = localStorage.getItem(`voucherClaimed_${userId}`)
        if (claimedVouchers) {
          const claimedVouchersArray = JSON.parse(claimedVouchers)

          // Cập nhật trạng thái các voucher đã CLAIMED
          fetchedVouchers = fetchedVouchers.map((voucher: CardVoucherProps) => {
            const isClaimed = claimedVouchersArray.some((claimed: CardVoucherProps) => claimed.id === voucher.id)
            return isClaimed ? { ...voucher, status: 'CLAIMED' } : voucher
          })
        }

        setVouchers(fetchedVouchers)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    fetchVouchers()
  }, [userId])

  const handleStatusGet = (id: string) => {
    if (!userId) {
      Swal.fire('Please register or sign in to collect the voucher!')
      return
    }

    setVouchers((prev) => {
      const updatedVouchers = prev.map((v) => (v.id === id && v.status === 'GET' ? { ...v, status: 'CLAIMED' } : v))

      // Lưu voucher đã CLAIMED vào localStorage
      const claimedVouchers = updatedVouchers.filter((v) => v.status === 'CLAIMED')

      // Chuyển trạng thái CLAIMED thành BELONG cho claimedVouchers
      const claimedVouchersBelong = claimedVouchers.map((v) => ({
        ...v,
        status: 'BELONG'
      }))

      localStorage.setItem(`voucherClaimed_${userId}`, JSON.stringify(claimedVouchersBelong))

      // Lưu toàn bộ voucher
      const allVouchersKey = `voucher_${userId}`
      localStorage.setItem(allVouchersKey, JSON.stringify(updatedVouchers))

      return updatedVouchers
    })

    if (userId) {
      dispatch(addVouchers({ userId, vouchers }))
    }
  }

  return (
    <>
      <Breadcrumb items={items} home={home} />

      <div className='voucher-container'>
        {/* Image */}
        <img src='images/vouchers.jpg' className='img-voucher' />

        {/* Content */}
        {/* Title */}
        <div className='container-heading'>
          <Container>
            <Row className='row-heading'>
              <h1 className='heading'>Voucher Warehouse</h1>
            </Row>
          </Container>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <>
            {/* Show Voucher */}
            {/* Freeship */}
            <div className='voucher-content-f'>
              <Container>
                <Row>
                  <h1 className='title-type'>FREE SHIPPING VOUCHERS</h1>
                </Row>
                <Row>
                  {vouchers
                    .filter((v) => v.type === 'Freeship' && (v.status === 'GET' || v.status === 'CLAIMED'))
                    .map((voucher, index) => (
                      <Col lg={4} key={index} className={index >= 3 ? 'mt-3' : ''}>
                        <CardVoucher {...voucher} handleStatusGet={handleStatusGet} />
                      </Col>
                    ))}
                </Row>
              </Container>
            </div>
            {/* End Freeship */}

            {/* Voucher by Order */}
            <div className='voucher-content-o'>
              <Container>
                <Row>
                  <h1 className='title-type'>ORDER-BASED VOUCHERS</h1>
                </Row>
                <Row>
                  {vouchers
                    .filter((v) => v.type === 'discountByOrder' && (v.status === 'GET' || v.status === 'CLAIMED'))
                    .map((voucher, index) => (
                      <Col lg={4} key={index} className={index >= 3 ? 'mt-3' : ''}>
                        <CardVoucher {...voucher} handleStatusGet={handleStatusGet} />
                      </Col>
                    ))}
                </Row>
              </Container>
            </div>
            {/* End Voucher by Order */}

            {/* Voucher by Category */}
            <div className='voucher-content-c'>
              <Container>
                <Row>
                  <h1 className='title-type'>CATEGORY-BASED VOUCHERS</h1>
                </Row>
                <Row>
                  {vouchers
                    .filter((v) => v.type === 'discountByCategory' && (v.status === 'GET' || v.status === 'CLAIMED'))
                    .map((voucher, index) => (
                      <Col lg={4} key={index} className={index >= 3 ? 'mt-3' : ''}>
                        <CardVoucher {...voucher} handleStatusGet={handleStatusGet} />
                      </Col>
                    ))}
                </Row>
              </Container>
            </div>

            {/* End Voucher by Category */}
          </>
        )}
      </div>
    </>
  )
}

export default Vouchers
