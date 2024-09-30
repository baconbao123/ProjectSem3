import { Col, Container, Row } from 'react-bootstrap'
import { InputText } from 'primereact/inputtext'
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import 'primeicons/primeicons.css'
import { useState } from 'react'
import './Navigate.scss'
import { Link } from 'react-router-dom'
interface MenuItem {
  id: number
  name: string
}

export const Navigate = () => {
  const [selectItem, setSelectItem] = useState<MenuItem | null>(null)

  const items: MenuItem[] = [
    { id: 1, name: 'van hoc' },
    { id: 2, name: 'novel' },
    { id: 3, name: 'trinh tham' }
  ]

  return (
    <>
      <Container>
        <Row className='row-navigate'>
          {/* Logo */}
          <Col lg={3} md={3} sm={3}>
            <Link to='/home'>
              <img src='/images/Logo.png' style={{ width: '200px', height: '50px' }} />
            </Link>
          </Col>

          {/* Search */}
          <Col lg={6} md={5} sm={5}>
            <div className='p-inputgroup flex-1'>
              <InputText placeholder='Search...' className='inputgroup' />
              <Dropdown
                value={selectItem}
                onChange={(e: DropdownChangeEvent) => setSelectItem(e.value)}
                options={items}
                optionLabel='name'
                placeholder='All'
                className='w-full md:w-14rem'
              />
              <Button label='Search' className='btnSearch' />
            </div>
          </Col>

          {/* Account */}
          <Col lg={3} md={4} sm={4} className='navi-right'>
            <div className='navi'>
              <Link to='/store' className='url'>
                <div className='storesystem'>
                  <i className='pi pi-shop' style={{ fontSize: '1.8rem' }}></i>
                  <span style={{ fontSize: '12px' }}>Store</span>
                </div>
              </Link>
              <Link to='/orders' className='url'>
                <div className='orders'>
                  <i className='pi pi-box icon' style={{ fontSize: '1.8rem' }}></i>
                  <span style={{ fontSize: '12px' }}>Orders</span>
                </div>
              </Link>
              <Link to='' className='url'>
                <div className='account'>
                  <i className='pi pi-user icon' style={{ fontSize: '1.8rem' }}></i>
                  <span style={{ fontSize: '12px' }}>Account</span>
                </div>
              </Link>
              <Link to='/checkout/cart' className='url'>
                <div className='cart'>
                  <i className='pi pi-shopping-cart icon' style={{ fontSize: '1.8rem' }}></i>
                  <span style={{ fontSize: '12px' }}>Cart</span>
                </div>
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  )
}
