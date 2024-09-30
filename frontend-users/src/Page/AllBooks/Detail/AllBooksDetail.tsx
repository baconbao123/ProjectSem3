import { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator'
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown'
import axios from 'axios'
import Product from '../../../Interfaces/Product'
import { CardProduct } from '../../../Components/CardProduct/Home/CardProduct'
import Breadcrumb from '../../../Components/Breadcrumb/Breadcrumb'
import GenresSidebar from '../../../Components/GenresSidebar/GenresSidebar'
import './AllBooksDetail.scss'
import { useParams } from 'react-router-dom'

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

function AllBooksDetail() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [categories, setCategories] = useState<string[]>([])
  // Fiter
  const [selectFilter, setSelectFilter] = useState<string>('newest')
  const [filteredProduct, setFilteredProduct] = useState<Product[]>([])
  // Pagination
  const [first, setFirst] = useState<number>(0)
  const [rows, setRows] = useState<number>(12)

  const { genres } = useParams<{ genres: string }>()

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

  const paginatedProducts = filteredProduct.slice(first, first + rows)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get<Product[]>('https://bookstore123.free.mockoapp.net/all-products-books')
        setProducts(res.data)
        setFilteredProduct(res.data)

        const categoryNames: string[] = Array.from(
          new Set(res.data.map((product: Product) => product.CategoryName))
        ).sort((a, b) => a.localeCompare(b)) // Sắp xếp theo bảng chữ cái

        setCategories(categoryNames)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    let sortedProducts = [...products]

    const parseDate = (dateString: string) => {
      const [day, month, year] = dateString.split('/').map(Number)
      return new Date(year, month - 1, day)
    }

    switch (selectFilter) {
      case 'newest':
        sortedProducts = sortedProducts.sort(
          (a, b) => parseDate(b.CreateAt).getTime() - parseDate(a.CreateAt).getTime()
        )
        break
      case 'oldest':
        sortedProducts = sortedProducts.sort(
          (a, b) => parseDate(a.CreateAt).getTime() - parseDate(b.CreateAt).getTime()
        )
        break
      case 'priceHighToLow':
        sortedProducts = sortedProducts.sort((a, b) => {
          const priceA = parseFloat(a.SellPrice || a.BasePrice || '0')
          const priceB = parseFloat(b.SellPrice || b.BasePrice || '0')
          return priceB - priceA
        })
        break
      case 'priceLowToHigh':
        sortedProducts = sortedProducts.sort((a, b) => {
          const priceA = parseFloat(a.SellPrice || a.BasePrice || '0')
          const priceB = parseFloat(b.SellPrice || b.BasePrice || '0')
          return priceA - priceB
        })
        break
      case 'alphabetical':
        sortedProducts = sortedProducts.sort((a, b) => a.Name.localeCompare(b.Name))
        break
    }
    setFilteredProduct(sortedProducts)
  }, [selectFilter, products])

  if (loading) return <div>Loading...</div>

  return (
    <>
      <Breadcrumb items={items} home={home} />
      <div className='container-all-books'>
        {/* <img src='/images/banner-books.png' className='img-all-books' /> */}

        <div className='container-all-books-content'>
          <Container className='all-products' >
            <Row>
              {/* Sidebar */}
              <Col lg={3} style={{ marginTop: '3px' }}>
                <GenresSidebar genres={genres || ''} categoryNames={categories} />
              </Col>
              <Col lg={9} style={{ paddingTop: '10px', backgroundColor: 'white' }}>
                <Row className='row-filter'>
                  {/* Filter */}
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
                  {/* Products */}
                  {paginatedProducts.map((product, index) => (
                    <Col lg={3} key={index} className={index >= 4 ? 'mt-4' : ''}>
                      <CardProduct product={product} />
                    </Col>
                  ))}
                </Row>
                <Row className='row-pagination'>
                  {/* Pagination */}
                  <Paginator
                    first={first}
                    rows={rows}
                    totalRecords={products.length}
                    rowsPerPageOptions={[12, 20, 24]}
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

export default AllBooksDetail
