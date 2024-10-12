import React, { useEffect, useState } from 'react'
import './OrderDetails.scss'
import { Link, useParams } from 'react-router-dom'
import { Steps } from 'primereact/steps'
import CardProductOrder from '../../../CardProduct/Order/CardProductOrder'
import OrderActions from '../OrderActions'
import { $axios } from '../../../../axios'

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [activeTracking, setActiveTracking] = useState<number>(0)
  const [orderDetail, setOrderDetail] = useState<any>(null)

  useEffect(() => {
    const fetchOrderId = async () => {
      try {
        const res = await $axios.get(`OrderProductFE/GetOrderById/${id}`)
        setOrderDetail(res.data.data)
        if (res.data.data.status) {
          setActiveTracking(res.data.data.status - 1)
        }
      } catch (err) {
        console.log(err)
      }
    }

    fetchOrderId()
  }, [id])

  const steps = [{ label: 'ORDERED' }, { label: 'PROCESSING' }, { label: 'COMPLETED' }, { label: 'RETURNED' }]

  // Filter the steps based on the current order status
  const filteredSteps = steps.slice(0, orderDetail ? orderDetail.status : 0)

  // Model in tracking
  const items = filteredSteps.map((step, index) => ({
    label: step.label,
    disable: orderDetail && orderDetail.status < index + 1,
    command: () => handleStepSelect({ index })
  }))

  // Handle Tracking Order
  const handleStepSelect = (e: { index: number }) => {
    if (orderDetail && orderDetail.status >= e.index + 1) {
      // Adjust check based on status
      setActiveTracking(e.index)
    }
  }

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
              <span>ORDER CODE: {orderDetail.code}</span> |&nbsp;
              <span className='status'>
                {orderDetail.status === 1
                  ? 'ORDERED'
                  : orderDetail.status === 2
                    ? 'PROCESSING'
                    : orderDetail.status === 3
                      ? 'COMPLETED'
                      : 'RETURNED'}
              </span>
            </div>
          </div>

          {/* Info Delivery */}
          <div className='container-information'>
            <span className='infor-title'>Store Pickup:</span> &nbsp;{' '}
            <span className='infor-content'>Shradha Bookstore</span> <br />
            <span className='infor-title'>Order ID:</span> &nbsp;{' '}
            <span className='infor-content'>{orderDetail.idOrder}</span> <br />
            <span className='infor-title'>Customer Name:</span> &nbsp;{' '}
            <span className='infor-content'>{orderDetail.user_name}</span> <br />
            <span className='infor-title'>Address:</span> &nbsp; <span className='infor-content'>NVC</span> <br />
            <span className='infor-title'>Phone:</span> &nbsp; <span className='infor-content'>01234123</span>
          </div>

          <div className='container-order-tracking'>
            <Steps model={items} readOnly={false} activeIndex={activeTracking} onSelect={handleStepSelect} />
            {orderDetail && (
              <div className='active-step-info'>
                <span className='order-label'>{items[activeTracking]?.label}:</span> &nbsp;
                <span className='order-datetime'>12:12</span>
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
            {orderDetail && orderDetail.products && orderDetail.products.length > 0 ? (
              orderDetail.products.map((p: any, index: any) => <CardProductOrder key={index} product={p} />)
            ) : (
              <span>No products available for this order.</span>
            )}
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
