import React, { useEffect, useState } from 'react'
import './AllOders.scss'
import { Order } from '../../../Interfaces/Order'
import axios from 'axios'
import { Container, Row } from 'react-bootstrap'
import CardOrder from '../../../Components/CardOrder/CardOrder'


const AllOders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  console.log(orders)

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
    <div className='container-allOrder'>
      <Container>
        {orders.map((o, index) => (
          <Row className={`row-allOrder ${index > 0 ? 'mt-4' : ''}`} key={index}>
            <CardOrder key={o.idOrder} order={o} />
          </Row>
        ))}
      </Container>
    </div>
  )
}

export default AllOders
