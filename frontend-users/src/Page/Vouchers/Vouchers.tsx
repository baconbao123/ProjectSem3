import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import CardVoucher from '../../Components/CardVoucher/CardVoucher'
import './Voucher.scss'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../Store/store'
// import { addVouchers, setUserId } from '../../Store/voucherSlice'
import Swal from 'sweetalert2'
import Loading from '../../Components/Loading/Loading'
import { $axios } from '../../axios'
import { setLoaded, setLoading } from '../../Store/loadingSlice'
import { Skeleton } from '@mui/material'

const Vouchers: React.FC = () => {
  const [vouchers, setVouchers] = useState<any | []>([])
  const userId = useSelector((state: RootState) => state.auth.userId)
  const isLoading = useSelector((state: RootState) => state.loading.isLoading)
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const res = await $axios.get('SaleFE')
        setVouchers(res.data.data)
      } catch (err) {
        console.log(err)
        setLoaded()
      } finally {
        setLoaded()
      }
    }

    fetchVouchers()
  }, [userId])

  useEffect(() => {
    dispatch(setLoading())

    const timeout = setTimeout(() => {
      dispatch(setLoaded())
    }, 1000)

    return () => clearTimeout(timeout)
  }, [dispatch])

  const handleStatusGet = async (saleId: string) => {
    if (!userId) {
      Swal.fire('Please register or sign in to collect the voucher!')
      return
    }

    try {
      console.log(saleId)

      const res = await $axios.post('UserSaleFE', {
        UserId: userId,
        SaleId: parseInt(saleId)
      })

      if (res.status === 200) {
        alert('CLAIMED')
      }
    } catch {
      Swal.fire('Failed to collect voucher!')
    }
  }

  return (
    <>
      <div className='voucher-container'>
        {/* Image */}
        {isLoading ? (
          <Skeleton height='534px'/>
        ) : (
          <img src='images/vouchers.jpg' className='img-voucher' />
        )
        
      
      }

        {/* Content */}
        {/* Title */}
        <div className='container-heading'>
          <Container>
            <Row className='row-heading'>
              <h1 className='heading'>Voucher Warehouse</h1>
            </Row>
          </Container>
        </div>

        {isLoading ? (
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
                    .filter((v: any) => v.Type === 1)
                    .map((voucher: any, index: any) => (
                      <Col lg={4} key={index} className={index >= 3 ? 'mt-3' : ''}>
                        <CardVoucher initVoucher={voucher} handleStatusGet={handleStatusGet} />
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
                    .filter((v: any) => v.Type === 2)
                    .map((voucher: any, index: any) => (
                      <Col lg={4} key={index} className={index >= 3 ? 'mt-3' : ''}>
                        <CardVoucher initVoucher={voucher} handleStatusGet={handleStatusGet} />
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
                    .filter((v: any) => v.Type === 3)
                    .map((voucher: any, index: any) => (
                      <Col lg={4} key={index} className={index >= 3 ? 'mt-3' : ''}>
                        <CardVoucher initVoucher={voucher} handleStatusGet={handleStatusGet} />
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
