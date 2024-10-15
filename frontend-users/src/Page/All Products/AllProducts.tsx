import React, { useEffect, useState } from 'react';
import { Col, Container, Row, Form } from 'react-bootstrap';
import { $axios } from '../../axios';
import { Link } from 'react-router-dom';
import { CardProduct } from '../../Components/CardProduct/Home/CardProduct';
import './AllProducts.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Store/store';
import { setLoaded, setLoading } from '../../Store/loadingSlice';
import { Skeleton } from 'primereact/skeleton';
import CardSkeletonProduct from '../../Components/CardSkeleton/CardSkeletonProduct/CardSkeletonProduct';

const AllProducts: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await $axios.get('CategoriesFE');
        setCategories(res.data.data);
      } catch {
        dispatch(setLoaded());
      } finally {
        dispatch(setLoaded());
      }
    };

    dispatch(setLoading());
    fetchProducts();
  }, [dispatch]);

  // Hàm loại bỏ dấu và chuyển đổi về chữ thường
  const normalizeString = (str: string) => {
    return str
      .toLowerCase()
      .replace(/[àáảãạâầấẩẫậ]|[èéẻẽẹêềếểễệ]|[ìíỉĩị]|[òóỏõọôồốổỗộ]|[ùúủũụưừứửữự]|[ỳýỷỹỵ]|[đ]/g, (match) => {
        const map: { [key: string]: string } = {
          'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
          'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
          'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
          'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
          'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
          'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
          'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
          'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
          'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
          'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
          'đ': 'd'
        };
        return map[match] || match;
      });
  };

  // Hàm tìm kiếm sản phẩm và danh mục
  const filterProducts = (categories: any[]) => {
    const normalizedSearchTerm = normalizeString(searchTerm); // Chuyển đổi searchTerm
    return categories.filter(category => {
      if (category.Level === 0) { // Chỉ lọc danh mục cha
        const hasMatchingProducts = category.Products.some(product => {
          const productNameNormalized = normalizeString(product.Name); // Chuyển đổi tên sản phẩm
          return productNameNormalized.includes(normalizedSearchTerm); // So sánh
        });

        return hasMatchingProducts || (selectedCategory === null || selectedCategory === category.Id);
      }
      return false; // Không trả về danh mục con
    });
  };

  const filteredCategories = filterProducts(categories);

  return (
    <>
     <Container className='search-container  d-flex justify-content-end'> {/* Thêm lớp d-flex và justify-content-end */}
  <div className='col-4 mt-5'>
    <Form>
      <Form.Group controlId="search">
        <Form.Control
          type="text"
          placeholder="Enter name product"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='large-input'
        />
      </Form.Group>
    </Form>
  </div>
</Container>



      {isLoading ? (
        <div style={{ minHeight: '100vh' }}>
          <div className='container-all-books-content-skeleton' style={{ paddingTop: '50px' }}>
            <Container className='container-all-books-content-container'>
              <Row>
                <Col lg={12}>
                  <Skeleton height='1rem'></Skeleton>
                </Col>
              </Row>

              {/* Hiển thị skeleton */}
              {[...Array(3)].map((_, rowIndex) => (
                <Row className='mt-3' key={rowIndex} style={{ padding: '0 5px' }}>
                  {[...Array(6)].map((_, index) => (
                    <Col key={index} lg={2} style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                      <CardSkeletonProduct />
                    </Col>
                  ))}
                </Row>
              ))}
            </Container>
          </div>
        </div>
      ) : (
        <div className='container-all-books-content'>
          <Container className='all-products'>
            <Row>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category, index) => (
                  <div key={index}>
                    {category.Level === 0 && (
                      <div className='content-category-product'>
                        <div className='category-name-container'>
                          <span className='category-name'>{category.Name}</span>
                        </div>
                        {categories
                          .filter(
                            (subCategory) =>
                              subCategory.Level === 1 &&
                              subCategory.ParentId === category.Id && subCategory.Products.length > 0
                          )
                          .map((subCategory) => ( 
                            <div key={subCategory.Id} className='block'>
                              <div className='block-wrapper'>
                                <Container>
                                  <div className='heading heading-flex mt-4'>
                                    <div className='heading-left' style={{ zIndex: '1' }}>
                                      <h2 className='title'>{subCategory.Name}</h2>
                                    </div>
                                    <div className='heading-right' style={{ zIndex: '1' }}>
                                      <Link to={`/${category.Name}/${subCategory.Name}`} className='title-link'>
                                        View more Products <i className='icon-long-arrow-right' />
                                      </Link>
                                    </div>
                                  </div>
                                  <Row>
                                    {subCategory.Products
                                      .filter(product =>
                                        normalizeString(product.Name).includes(normalizeString(searchTerm))
                                      )
                                      .slice(0, 6)
                                      .map((product, productIndex) => (
                                        <Col lg={2} key={product.Id || productIndex}>
                                          <CardProduct product={product} />
                                        </Col>
                                      ))}
                                  </Row>
                                </Container>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="no-products-found">Not found product</div>
              )}
            </Row>
          </Container>
        </div>
      )}
    </>
  );
};

export default AllProducts;
