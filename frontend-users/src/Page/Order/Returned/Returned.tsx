import React, { useEffect, useState } from 'react'
import { Container, Row } from 'react-bootstrap'
import CardOrder from '../../../Components/CardOrder/CardOrder'
import { useDispatch, useSelector } from 'react-redux'
import { setLoaded, setLoading } from '../../../Store/loadingSlice'
import CardSkeletonOrder from '../../../Components/CardSkeleton/CardSkeletonOrder'
import NotFoundOrder from '../../../Components/NotFoundOrder/NotFoundOrder'
import { RootState } from '../../../Store/store'
import { $axios } from '../../../axios'

const Returned: React.FC = () => {
  const [orders, setOrders] = useState<any | []>([])
  const dispatch = useDispatch()
  const isLoading = useSelector((state: RootState) => state.loading.isLoading)
  const userId = useSelector((state: RootState) => state.auth.userId)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await $axios.get(`OrderProductFE/GetOrderByUser/${userId}`)
        setOrders(res.data.data)
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
    <div className='container-completed'>
      <Container>
        {isLoading ? (
          <>
            {[...Array(4)].map((_, index) => (
              <Row className={`${index > 0 ? 'mt-5' : ''}`} key={index}>
                <CardSkeletonOrder />
              </Row>
            ))}
          </>
        ) : orders && orders.length > 0 ? (
          orders.filter((o: any) => o.status === 4).length > 0 ? (
            orders
              .filter((o: any) => o.status === 4)
              .map((o: any, index: any) => (
                <Row className={`row-allOrder ${index > 0 ? 'mt-4' : ''}`} key={index}>
                  <CardOrder key={o.idOrder} order={o} />
                </Row>
              ))
          ) : (
            <NotFoundOrder />
          )
        ) : (
          <NotFoundOrder />
        )}
      </Container>
    </div>
  )
}

export default Returned
