import React, { useEffect, useState } from 'react'
import { Container, Row } from 'react-bootstrap'
import axios from 'axios'
import CardOrder from '../../../Components/CardOrder/CardOrder'
import './Uncompleted.scss'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../Store/store'
import { setLoaded, setLoading } from '../../../Store/loadingSlice'
import CardSkeletonOrder from '../../../Components/CardSkeleton/CardSkeletonOrder'
import NotFoundOrder from '../../../Components/NotFoundOrder/NotFoundOrder'

const Uncompleted: React.FC = () => {
  const [orders, setOrders] = useState<any | []>([])
  const dispatch = useDispatch()
  const isLoading = useSelector((state: RootState) => state.loading.isLoading)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get('https://bookstore123.free.mockoapp.net/orders')
        setOrders(res.data)
      } catch (error) {
        console.log(error)
      } finally {
        dispatch(setLoaded())
      }
    }

    dispatch(setLoading())
    fetchOrder()
  }, [dispatch])

  return (
    <div className='container-uncompleted'>
      <Container>
        {isLoading ? (
          <>
            {[...Array(4)].map((_, index) => (
              <Row className={`${index > 0 ? 'mt-5' : ''}`} key={index}>
                <CardSkeletonOrder />
              </Row>
            ))}
          </>
        ) : orders && orders.filter((o: any) => o.status === 'UNCOMPLETED').length > 0 && orders.length > 0 ? (
          orders
            .filter((o: any) => o.status === 'UNCOMPLETED')
            .map((o: any, index: any) => (
              <Row className={`row-allOrder ${index > 0 ? 'mt-4' : ''}`} key={o.idOrder}>
                <CardOrder order={o} />
              </Row>
            ))
        ) : (
          <NotFoundOrder />
        )}
      </Container>
    </div>
  )
}

export default Uncompleted
