import { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator'
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown'
import axios from 'axios'
import Product from '../../../Interfaces/Product'
import Sidebar from '../Sidebar/Sidebar'
import { CardProduct } from '../../../Components/CardProduct/Home/CardProduct'
import './AllBooksDetail.scss'
import Breadcrumb from '../../../Components/Breadcrumb/Breadcrumb'

const items = [
  {
    label: 'Books',
    url: '/all-books-detail',
    page: true
  }
]
const home = { icon: 'pi pi-home', url: '/home' }

interface Filter {
  name: string
  value: string
}

function AllBooks() {
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
        const res = await axios.get('https://bookstore123.free.mockoapp.net/all-products-books')
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
      <div className='container-all-books'>
        <img src='/images/banner-books.png' className='img-all-books' />

        <div className='container-all-books-content'>
          <Container className='all-products' style={{ marginTop: '10px' }}>
            <Row>
              <Col lg={3} style={{ marginTop: '3px' }}>
                <Sidebar />
              </Col>
              <Col lg={9} style={{ paddingTop: '10px', backgroundColor: 'white' }}>
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
                <Row style={{ padding: '10px 20px' }}>
                  {products.map((product, index) => (
                    <Col lg={3} key={product.Id} className={index >= 4 ? 'mt-4' : ''}>
                      <CardProduct product={product} />
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
        </div>
      </div>
    </>
  )
}

export default AllBooks
