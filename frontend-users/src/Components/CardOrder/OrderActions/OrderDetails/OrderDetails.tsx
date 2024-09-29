import React, { useEffect, useState } from 'react'
import './OrderDetails.scss'
import { Link, useParams } from 'react-router-dom'
import { Steps } from 'primereact/steps'
import axios from 'axios'
import CardProductOrder from '../../../CardProduct/Order/CardProductOrder'
import OrderActions from '../OrderActions'

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [activeTracking, setActiveTracking] = useState<number>(0)
  const [orderDetail, setOrderDetail] = useState<any>(null)

  useEffect(() => {
    const fetchOrderId = async () => {
      try {
        const res = await axios.get(`https://bookstore123.free.mockoapp.net/orders/details/${id}`)
        setOrderDetail(res.data)

        //  Set the last active step that has a datetime
        const lastActiveIndex = Object.keys(res.data.statusDetail)
          .reverse()
          .findIndex((key) => res.data.statusDetail[key])

        // Active last index has datetime
        if (lastActiveIndex !== -1) {
          setActiveTracking(Object.keys(res.data.statusDetail).length - 1 - lastActiveIndex)
        }
      } catch (err) {
        console.log(err)
      }
    }

    fetchOrderId()
  }, [id])

  // Handle Tracking Order
  const handleStepSelect = (e: { index: number }) => {
    const stepLable = items[e.index]?.label
    if (orderDetail.statusDetail[stepLable]) {
      setActiveTracking(e.index)
    }
  }

  // Model in tracking
  const items = orderDetail?.statusDetail
    ? Object.keys(orderDetail.statusDetail).map((key, index) => ({
        label: key,
        disable: !orderDetail.statusDetail[key],
        command: () => handleStepSelect({ index })
      }))
    : []

  return (
    <div className='container-order-detail'>
      {orderDetail ? (
        <>
          <div className='heading-order-detail'>
            <div className='heading-left-order'>
              <i className='pi pi-chevron-left' /> &nbsp;
              <Link to='/orders' className='back'>
                Back
              </Link>
            </div>
            <div className='heading-right-order'>
              <span>ORDERED ID: {id}</span> |&nbsp;
              <span className='status'>{orderDetail.status}</span>
            </div>
          </div>

          {/* Infor Delivery */}
          <div className='container-information'>
            <span className='infor-title'>Store Pickup:</span> &nbsp;{' '}
            <span className='infor-content'>Shradha Bookstore</span> <br />
            <span className='infor-title'>Order ID:</span> &nbsp;{' '}
            <span className='infor-content'>{orderDetail.idOrder}</span> <br />
            <span className='infor-title'>Customer Name:</span> &nbsp;{' '}
            <span className='infor-content'>{orderDetail.User.name}</span> <br />
            <span className='infor-title'>Address:</span> &nbsp;{' '}
            <span className='infor-content'>{orderDetail.User.Address}</span> <br />
            <span className='infor-title'>Phone:</span> &nbsp;{' '}
            <span className='infor-content'>{orderDetail.User.Phone}</span>
          </div>

          {/* Order Tracking */}
          <div className='container-order-tracking'>
            <Steps model={items} readOnly={false} activeIndex={activeTracking} onSelect={handleStepSelect} />
            {orderDetail && (
              <div className='active-step-info'>
                <span className='order-label'>{items[activeTracking]?.label}:</span> &nbsp;
                <span className='order-datetime'>{orderDetail.statusDetail[items[activeTracking]?.label]}</span>
              </div>
            )}
          </div>
          {/* End Order Tracking */}

          {/* Cancellation Reason */}
          <div className='container-cancellation' style={{ padding: '14px 26px' }}>
            <span className='infor-title' style={{ fontSize: '20px', fontWeight: '600' }}>
              Cancellation Reason:
            </span>
            &nbsp;{' '}
            <span className='infor-content' style={{ fontSize: '20px' }}>
              {orderDetail.CancellationReason}
            </span>
          </div>

          {/* Products In Order */}
          <div className='container-products'>
            <span className='title-product'>Products</span> <br />
            {orderDetail.Products.map((p: any, index: any) => (
              <CardProductOrder key={index} product={p} />
            ))}
            <div className='mt-4'>
              <OrderActions order={orderDetail} />
            </div>
          </div>
        </>
      ) : (
        <div>Loading</div>
      )}
    </div>
  )
}

export default OrderDetails
