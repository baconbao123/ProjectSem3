import React, { useRef } from 'react'
import Slider from 'react-slick'
import './CategoryCarousel.scss'
import { Button } from 'primereact/button'
import { IoIosArrowDropleft, IoIosArrowDropright } from 'react-icons/io'
import { Link } from 'react-router-dom'

const CategoryCarousel: React.FC<any> = ({ categoryParent, categories }) => {
  const sliderRef = useRef<Slider>(null)
  console.log('catgeories carousel', categories)

  const settings = {
    className: 'center',
    infinite: true,
    slidesToShow: 3,
    speed: 500
  }

  return (
    <div className='carousel-container' style={{ height: '350px' }}>
      {categories.length > 0 ? (
        <Slider {...settings} ref={sliderRef}>
          {categories.map((c: any, index: any) => (
            <div key={index}>
              <div className='banner banner-overlay-category'>
                <a>
                  <img
                    src={import.meta.env.VITE_API_BACKEND_PATH + c.imgThumbCategory}
                    style={{ height: '200px', width: '400px' }}
                    alt={c.title}
                  />
                  <div className='overlay'></div>
                </a>
                <div className='banner-content'>
                  <h3 className='banner-title text-white'>
                    <div className='category-name'>{c.Name}</div>
                  </h3>
                  <Link to={`/${categoryParent}/${c.Name}`} className='btn btn-outline-white-3 banner-link'>
                    Discover Now
                    <i className='icon-long-arrow-right' />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      ) : (
        <div>No categories available</div>
      )}
      <div className='carousel-buttons'>
        <Button
          className='carousel-btn prev-btn'
          icon={<IoIosArrowDropleft onClick={() => sliderRef.current?.slickPrev()} />}
        />
        <Button
          className='carousel-btn next-btn'
          icon={<IoIosArrowDropright onClick={() => sliderRef.current?.slickNext()} />}
        />
      </div>
    </div>
  )
}

export default CategoryCarousel
