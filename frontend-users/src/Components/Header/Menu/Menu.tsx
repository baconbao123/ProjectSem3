import { Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { InputText } from 'primereact/inputtext'
import { InputIcon } from 'primereact/inputicon'
import { IconField } from 'primereact/iconfield'
import './Menu.scss'
import { useEffect, useRef, useState } from 'react'
import { $axios } from '../../../axios'

export const Menu = () => {
  // const [itemCategories, setItemCategories] = useState<any | []>([])
  // const [expandedCategoryId, setExpandedCategoryId] = useState<number | null>(null)
  const expandedCategoryRef = useRef<HTMLDivElement>(null)

  const itemsPage: { name: string; url: string }[] = [
    {
      name: 'All Products',
      url: '/all-products'
    },
    {
      name: 'Vouchers',
      url: '/vouchers'
    },
    {
      name: 'FAQ',
      url: '/faq'
    }
  ]

  useEffect(() => {
    const fetchItem = async () => {
      const res = await $axios.get('CategoriesFE/getCategories')
      // setItemCategories(res.data.data)
    }

    fetchItem()
  }, [])

  // const toggleSubcategory = (parentId: number) => {
  //   setExpandedCategoryId((prevId) => (prevId === parentId ? null : parentId))
  // }

  // const handleClickOutside = (e: MouseEvent) => {
  //   if (expandedCategoryRef.current && !expandedCategoryRef.current.contains(e.target as Node)) {
  //     setExpandedCategoryId(null)
  //   }
  // }

  // useEffect(() => {
  //   document.addEventListener('mousedown', handleClickOutside)

  //   return () => document.removeEventListener('mousedown', handleClickOutside)
  // }, [])

  return (
    <>
      <div className='menu-container'>
        <Container>
          <Row>
            {/* Page */}
            <Col lg={9}>
              <div className='page-right-container'>
                {/* {itemCategories
                  .filter((item: any) => item.Level === 0)
                  .map((parentCategory: any, index: any) => (
                    <div key={index} className='items'>
                      <div className='item' onClick={() => toggleSubcategory(parentCategory.Id)}>
                        <span className='name'>{parentCategory.Name}</span>
                        <div className='arrowitem'>
                          <i className='pi pi-angle-down' style={{ fontSize: '1.8rem' }}></i>
                        </div>
                      </div>

                      // Display subcategory
                      {expandedCategoryId === parentCategory.Id && (
                        <div className='subcategories' ref={expandedCategoryRef}>
                          {itemCategories
                            .filter((subItem: any) => subItem.ParentId === parentCategory.Id)
                            .map((subCategory: any, subIndex: any) => (
                              <Link to={`/${parentCategory.Name}/${subCategory.Name}`} className='url-categories'>
                                <div className='subcategory' key={subIndex}>
                                  <span className='name'>{subCategory.Name}</span>
                                </div>
                              </Link>
                            ))}
                        </div>
                      )}
                    </div>
                  ))} */}

                {itemsPage.map((item, index) => (
                  <div key={index} className='items'>
                    <Link to={item.url} className='url'>
                      <div className='item'>
                        <span className='name'>{item.name}</span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </Col>

            {/* Search */}
            <Col lg={3} className='col-search-left'>
              <IconField iconPosition='left'>
                <InputIcon className='pi pi-search'> </InputIcon>
                <InputText placeholder='Search' className='inputgroup'/>
              </IconField>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}
