import { Col, Container, Row } from 'react-bootstrap'
import { useEffect, useRef, useState } from 'react'
import './Menu.scss'
import { Link } from 'react-router-dom'

interface CategoryItem {
  id: number
  name: string
}

export const Menu = () => {
  const [showItem, setShowItem] = useState(false)
  const [isSticky, setIsSticky] = useState(false)
  const categoryRef = useRef<HTMLDivElement>(null)

  const items: CategoryItem[] = [
    { id: 1, name: 'Novel' },
    { id: 2, name: 'Trinh thám' },
    { id: 3, name: 'Technology' }
  ]

  const itemsPage: { name: string; url: string }[] = [
    {
      name: 'All Books',
      url: '/all-products'
    },
    {
      name: 'Vouchers',
      url: '/vouchers'
    }
  ]

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setShowItem(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsSticky(true)
      } else {
        setIsSticky(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <div className={`menu-container ${isSticky ? 'sticky' : ''}`}>
        <Container>
          <Row>
            {/* Category */}
            <Col lg={3} md={3} sm={3} xs={3}>
              <div className='category' ref={categoryRef} onClick={() => setShowItem(!showItem)}>
                <div className='content'>
                  <i className='pi pi-bars icon'></i> &nbsp;&nbsp;
                  <span className='title'>CATEGORIES</span>
                </div>
                <div className='arrowitem'>
                  <i className='pi pi-angle-down' style={{ fontSize: '1.8rem' }}></i>
                </div>
                {showItem && (
                  <div className='categoryItem'>
                    {items.map((item) => (
                      <div key={item.id} className='item'>
                        <span className='name'>{item.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Col>

            {/* Page */}
            <Col lg={6} md={4} sm={5} xs={5}>
              <div className='page-container'>
                {itemsPage.map((item, index) => (
                  <div key={index} className='item'>
                    <Link to={item.url} className='url'>
                      <span className='name'>{item.name}</span>
                    </Link>
                  </div>
                ))}
              </div>
            </Col>

            {/* Sale */}
            <Col lg={3} md={5} sm={4} xs={4}>
              <div className='save-container'>
                <p style={{ paddingTop: '10px'}}>|</p> &nbsp;&nbsp; <i className='pi pi-star-fill icon' style={{ fontSize: '1.2rem' }}></i> &nbsp;
                Extra &nbsp; <span style={{ color: 'yellow' }}>10%</span> &nbsp; off for loyal customers
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}
