import React, { useEffect, useState } from 'react'
import { Container, Row } from 'react-bootstrap'
import { Order } from '../../../Interfaces/Order'
import axios from 'axios'
import CardOrder from '../../../Components/CardOrder/CardOrder'
import './Completed.scss'

const Completed: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get('https://bookstore123.free.mockoapp.net/orders')
        setOrders(res.data)
        console.log(res.data)
      } catch (error) {
        console.log(error)
      }
      // finally {
      //   <h1>Loading ....</h1>
      // }
    }

    fetchOrder()
  }, [])

  return (
    <div className='container-completed'>
      <Container>
        {orders
          .filter((o) => o.status === 'COMPLETED')
          .map((o, index) => (
            <Row className={`row-allOrder ${index > 0 ? 'mt-4' : ''}`} key={index}>
              <CardOrder key={o.idOrder} order={o} />
            </Row>
          ))}
      </Container>
    </div>
  )
}

export default Completed
