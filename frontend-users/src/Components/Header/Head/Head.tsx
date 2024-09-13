import { Col, Container, Row } from 'react-bootstrap'
import './Head.scss'
// import { Link } from 'react-router-dom'

export const Head = () => {
  return (
    <Container>
      <Row  className='row-head'>
        <Col lg={3}>
          <div className='header-left'>
            <a>
              <i className='icon-phone' />
              Call: +0123 456 789
            </a>
          </div>
        </Col>
        <Col lg={7}></Col>
        <Col lg={2}>
          <div className='signIn'>
          Sign in / Sign up
          </div>
        </Col>
      </Row>
    </Container>
  )
}
