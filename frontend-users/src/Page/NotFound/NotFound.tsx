import React from 'react'
import { Container } from 'react-bootstrap'

const NotFound: React.FC = () => {
  return (
    <Container style={{ display: 'flex', justifyContent: 'center' }}>
      <img src='images/not-found.png' style={{ width: '65%' }} />
    </Container>
  )
}

export default NotFound
