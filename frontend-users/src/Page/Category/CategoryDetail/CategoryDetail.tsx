import React, { useEffect, useState } from 'react'
import Breadcrumb from '../../../Components/Breadcrumb/Breadcrumb'
import { useParams } from 'react-router-dom'
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator'
import { $axios } from '../../../axios'
import Loading from '../../../Components/Loading/Loading'
import { Col, Container, Row } from 'react-bootstrap'
import GenresSidebar from '../../../Components/GenresSidebar/GenresSidebar'
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown'
import { CardProduct } from '../../../Components/CardProduct/Home/CardProduct'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../Store/store'
import { setLoaded, setLoading } from '../../../Store/loadingSlice'
import './CategoryDetail.scss'

interface Filter {
  name: string
  value: string
}

const CategoryDetail: React.FC = () => {
  const [products, setProducts] = useState<any | []>([])
  const [categoriesSidebar, setCategoriesSidebar] = useState<string[]>([])
  const [parentCategoryName, setParentCategoryName] = useState<string>('')
  // Fiter
  const [selectFilter, setSelectFilter] = useState<string>('newest')
  const [filteredProduct, setFilteredProduct] = useState<any | []>([])
  // Pagination
  const [first, setFirst] = useState<number>(0)
  const [rows, setRows] = useState<number>(12)

  const dispatch = useDispatch()
  const isLoading = useSelector((state: RootState) => state.loading.isLoading)

  const { category, genres } = useParams<{ category: string; genres: string }>()

  const items = [
    {
      label: category,
      url: `/${category}`,
      page: false
    },
    {
      label: genres,
      url: `/${genres}`,
      page: true
    }
  ]
  const home = { label: 'Home', url: '/home' }

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

  //   fetch product
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await $axios.get('CategoriesFE')
        const allCategories = res.data.data
        const parentCategory = allCategories.find((cate: any) => cate.Name.toLowerCase() === category?.toLowerCase())

        if (parentCategory) {
          const allProducts = parentCategory.Products
          setParentCategoryName(parentCategory.Name)

          const childCategory = allCategories.filter(
            (cate: any) => cate.ParentId === parentCategory.Id && cate.Level === 1 && cate.Products.length > 0
          )

          setCategoriesSidebar(childCategory.map((cate: any) => cate.Name))

          // Filter products by genres
          if (genres) {
            const matchedCategory = childCategory.find(
              (child: any) => child.Name.toLowerCase() === genres.toLowerCase()
            )
            if (matchedCategory) {
              const filteredProducts = allProducts.filter((product: any) => {
                return matchedCategory.Products.some((catProd: any) => catProd.Id === product.Id)
              })
              setProducts(filteredProducts)
            } else {
              // If no matching category, set products to an empty array
              setProducts([])
            }
          } else {
            // If no genres, set all products from the parent category
            setProducts(allProducts)
          }
        }

        setSelectFilter('newest')
      } catch (err) {
        console.log(err)
      } finally {
        dispatch(setLoaded())
      }
    }

    dispatch(setLoading())
    fetchProducts()
  }, [category, genres, dispatch])

  useEffect(() => {
    let sortedProducts = [...products]

    const toTimestamp = (dateString: string) => {
      return new Date(dateString).getTime()
    }

    switch (selectFilter) {
      case 'newest':
        sortedProducts = sortedProducts.sort((a, b) => toTimestamp(b.CreatedAt) - toTimestamp(a.CreatedAt))
        break
      case 'oldest':
        sortedProducts = sortedProducts.sort((a, b) => toTimestamp(a.CreatedAt) - toTimestamp(b.CreatedAt))
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

  return (
    <div className='container-category-detail-books-master'>
      <Breadcrumb items={items} home={home} />
      <div className='container-category-detail-books'>
        {isLoading ? (
          <div className='loading-category'>
            <Loading />
          </div>
        ) : (
          <div className='container-all-books-content'>
            <Container className='all-products'>
              <Row>
                {/* Sidebar */}
                <Col lg={3} style={{ marginTop: '3px' }}>
                  <GenresSidebar
                    genres={genres || ''}
                    categoryNames={categoriesSidebar}
                    parentCategory={parentCategoryName}
                  />
                </Col>
                <Col lg={9} style={{ paddingTop: '10px', backgroundColor: 'white' }}>
                  <Row className='row-filter'>
                    {/* Filter */}
                    <Col lg={10}></Col>
                    <Col lg={2}>
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
                    </Col>
                  </Row>
                  <Row style={{ padding: '10px 20px' }}>
                    {/* Products */}
                    {paginatedProducts.map((product: any, index: any) => (
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
        )}
      </div>
    </div>
  )
}

export default CategoryDetail
