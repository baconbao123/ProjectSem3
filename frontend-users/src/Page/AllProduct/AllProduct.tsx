import { Col, Container, Row } from "react-bootstrap"
import { BreadCrumb } from 'primereact/breadcrumb';
import Sidebar from "./Sidebar"


function AllProduct() {
  return (
    <Container>
      Breadcrum
        <Row>
            <Col lg={3}>
                <Sidebar />
            </Col>
            <Col lg={9}>
                All product
            </Col>

        </Row>
    </Container>
  )
}

export default AllProduct