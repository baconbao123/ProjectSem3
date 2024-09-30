import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import './OrderCancel.scss'
import CardProductOrder from '../../../CardProduct/Order/CardProductOrder'
import { calculateTotalOrderPrice } from '../../../../utils'

const OrderCancel: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [orderCancel, setOrderCancel] = useState<any>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`https://bookstore123.free.mockoapp.net/orders/canceled/${id}`)
        setOrderCancel(res.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchOrder()
  }, [id])

  return (
    <div className='container-canceled-details'>
      {/* Heading Cancel */}
      {orderCancel ? (
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
              <span className='status'>{orderCancel.status}</span>
            </div>
          </div>

          {/* Bottom Heading Cancel */}
          <div className='container-cancel-compeleted'>
            <span className='cancel-compeleted'>Cancellation Completed</span> &nbsp;
            <span>on {orderCancel.statusDetail.Cancel}</span>
          </div>

          {/* Product */}
          <div className='container-products'>
            <span className='title-product'>Products</span> <br />
            {orderCancel.Products.map((p: any, index: any) => (
              <CardProductOrder key={index} product={p} />
            ))}
            <div className='container-total-price'>
              <span className='title'>Total Price Order:</span> &nbsp;&nbsp;
              <span className='order'>$ {calculateTotalOrderPrice(orderCancel.Products)}</span>
            </div>
          </div>

          {/* Cancel Detail By */}
          <div className='cancel-by'>
            <div className='req-by'>
              <div className='title-req'>Requested By</div>
              <div className='by'>{orderCancel.RequestBy}</div>
            </div>
            <div className='payment-method'>
              <div className='title-req'>Payment Method</div>
              <div className='by'>{orderCancel.Payment}</div>
            </div>
          </div>

          <div className='reason'>Cancelation Reason: {orderCancel.CancellationReason}</div>
        </>
      ) : (
        <div>Not Found Order</div>
      )}
    </div>
  )
}
export default OrderCancel
