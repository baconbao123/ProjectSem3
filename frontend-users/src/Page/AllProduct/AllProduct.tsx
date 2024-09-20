import { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator'
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown'
import axios from 'axios'
import Sidebar from './Sidebar'
import { CardProduct } from '../../Components/CardProduct/CardProduct'
import Product from '../../Interfaces/Product'
import Breadcrumb from '../../Components/Breadcrumb/Breadcrumb'
import './AllProducts.scss'

const items = [
  {
    label: 'All Products',
    url: '/all-products',
    page: true
  }
]
const home = { icon: 'pi pi-home', url: '/home' }

interface Filter {
  name: string
  value: string
}

function AllProduct() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [selectFilter, setSelectFilter] = useState<string>('newest')
  const [first, setFirst] = useState<number>(0)
  const [rows, setRows] = useState<number>(10)

  const filterItems: Filter[] = [
    { name: 'Newest', value: 'newest' },
    { name: 'Oldest', value: 'oldest' },
    { name: 'Price High to Low', value: 'priceHighToLow' },
    { name: 'Price Low to High', value: 'priceLowToHigh' },
    { name: 'Alphabetical', value: 'alphabetical' }
  ]

  const onPageChange = (event: PaginatorPageChangeEvent) => {
    setFirst(event.first)
    setRows(event.rows)
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('https://bookstore123.free.mockoapp.net/all-products')
        setProducts(res.data)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <>
      <Breadcrumb items={items} home={home} />
      <Container className='all-products' style={{ paddingTop: '3px' }}>
        <Row>
          <Col lg={3}>
            <Sidebar />
          </Col>
          <Col lg={9} style={{ paddingTop: '10px' }}>
            <Row className='row-filter'>
              <div className='filter'>
                <Dropdown
                  value={selectFilter}
                  onChange={(e: DropdownChangeEvent) => setSelectFilter(e.value)}
                  options={filterItems}
                  optionLabel='name'
                  optionValue='value'
                  className=''
                />
              </div>
            </Row>
            <Row>
              {products.map((product, index) => (
                <Col lg={3} key={product.Id} className={index >= 4 ? 'mt-4' : ''}>
                  <CardProduct {...product} />
                </Col>
              ))}
            </Row>
            <Row className='row-pagination'>
              <Paginator
                first={first}
                rows={rows}
                totalRecords={120}
                rowsPerPageOptions={[10, 20, 30]}
                onPageChange={onPageChange}
                style={{ fontSize: '14px' }}
              />
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default AllProduct
