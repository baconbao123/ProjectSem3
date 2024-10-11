import React from 'react'
import { Col, Container, Row, Card } from 'react-bootstrap'
import './MemberBenefits.scss'
import { Link } from 'react-router-dom'

const MemberBenefits: React.FC = () => {
  const memberDiscounts = [
    {
      condition: 'Orders over $200',
      discount: 'Get $5 OFF',
      description: 'As a member, you will receive an additional $5 discount on orders over $200.',
      icon: 'https://cdn-icons-png.flaticon.com/512/1170/1170678.png'
    },
    {
      condition: 'Orders over $300',
      discount: 'Get $10 OFF',
      description: 'As a member, you will receive an additional $10 discount on orders over $300.',
      icon: 'https://cdn-icons-png.flaticon.com/512/1170/1170677.png'
    },
    {
      condition: 'Orders over $300',
      discount: 'Get $15 OFF',
      description: 'As a member, you will receive an additional $15 discount on orders over $300.',
      icon: 'https://cdn-icons-png.flaticon.com/512/1170/1170682.png'
    },
    {
      condition: 'Orders over $400',
      discount: 'Get $20 OFF',
      description: 'As a member, you will receive an additional $20 discount on orders over $400.',
      icon: 'https://cdn-icons-png.flaticon.com/512/1170/1170679.png'
    }
  ]

  return (
    <>
      <div className='container-member-benefits'>
        <Container>
          <Row className='row-heading-member'>
            <h1>Exclusive Member Benefits</h1>
            <p>Unlock amazing discounts and rewards as a valued member!</p>
          </Row>
          <Row className='row-content-member'>
            {memberDiscounts.map((discount, index) => (
              <Col key={index} md={6} lg={6} className='col-member-discount'>
                <Card className='member-benefit-card'>
                  <div className='icon-container'>
                    <img src={discount.icon} alt='Discount icon' className='discount-icon' />
                  </div>
                  <Card.Body>
                    <Card.Title className='discount-condition'>{discount.condition}</Card.Title>
                    <Card.Subtitle className='discount-amount'>{discount.discount}</Card.Subtitle>
                    <Card.Text className='discount-description'>{discount.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <Row className='row-register'>
            <Link to='/register' className='register-btn'>
              REGISTER NOW
            </Link>
          </Row>
        </Container>
      </div>
    </>
  )
}

export default MemberBenefits
