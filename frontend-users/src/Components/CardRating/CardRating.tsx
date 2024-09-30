import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { Avatar } from 'primereact/avatar'
import './CardRating.scss'
import Rating from '@mui/material/Rating'

interface RatingData {
  Name: string
  Value: string
  Desc: string
}

interface CardRatingProps {
  rating: RatingData
}

const CardRating: React.FC<CardRatingProps> = ({ rating }) => {
  return (
    <Container className='container-rating-product'>
      <Row lg={12} className='row-rating-card'>
        <Col lg={1} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Avatar icon='pi pi-user' className='mr-2' size='xlarge' shape='circle' />
        </Col>
        <Col lg={11}>
          <div className='content-rating'>
            <p>{rating.Name}</p>
            <p className='custom-rating'>
              <Rating readOnly precision={0.5} defaultValue={parseFloat(rating.Value)} />
            </p>
            <p>{rating.Desc}</p>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default CardRating
