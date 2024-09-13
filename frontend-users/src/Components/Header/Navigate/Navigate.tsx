import { Col, Container, Row } from 'react-bootstrap'
import { InputText } from 'primereact/inputtext'
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import 'primeicons/primeicons.css'
import { useState } from 'react'
import './Navigate.scss'

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
          <Col lg={3}>
            <img src='images/Logo.png' style={{ width: '200px', height: '50px'}}/>
          </Col>

          {/* Search */}
          <Col lg={6}>
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
              <Button label='Search' className='btnSearch'/>
            </div>
          </Col>

          {/* Account */}
          <Col lg={3} className='navi-right'>
            <div className='navi'>
              <div className='account'>
                <i className='pi pi-user icon' style={{ fontSize: '1.8rem' }}></i>
                <span style={{ fontSize: '12px'}}>Account</span>
              </div>
              <div className='wishlist'>
                <i className='pi pi-heart icon' style={{ fontSize: '1.8rem' }}></i>
                <span style={{ fontSize: '12px'}}>Wishlist</span>
              </div>
              <div className='cart'>
                <i className='pi pi-shopping-cart icon' style={{ fontSize: '1.8rem' }}></i>
                <span style={{ fontSize: '12px'}}>Cart</span>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  )
}
