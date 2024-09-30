import React, { useRef } from 'react'
import Slider from 'react-slick'
import './CategoryCarousel.scss'
import { Button } from 'primereact/button'
import { IoIosArrowDropleft, IoIosArrowDropright } from 'react-icons/io'

const carouselcategory = [
  {
    url: '/images/books-children.png',
    subTitle: 'A Perfect Choice For Your Children',
    title: "Children's Bestselling Books"
  },
  {
    url: '/images/books-selfhelp.png',
    subTitle: 'Mental Health Awareness Week',
    title: 'Self-Help For Your Future.'
  },
  {
    url: '/images/banner-8.jpg',
    subTitle: 'New York Times Bestsellers',
    title: 'Bestselling Food and Drink Books.'
  },
  {
    url: '/images/Logo.png',
    subTitle: 'A Perfect Choice For Your Children',
    title: "Children's Bestselling Books"
  },
  {
    url: '/images/vouchers.jpg',
    subTitle: 'Mental Health Awareness Week',
    title: 'Self-Help For Your Future.'
  },
  {
    url: '/images/banner-1.jpg',
    subTitle: 'New York Times Bestsellers',
    title: 'Bestselling Food and Drink Books.'
  }
]

const CategoryCarousel: React.FC = () => {
    const sliderRef = useRef<Slider>(null);

  const settings = {
    className: 'center',
    centerMode: true,
    infinite: true,
    centerPadding: '55px',
    slidesToShow: 3,
    speed: 500
  }

  return (
    <div className='carousel-container' style={{ height: '350px' }}>
      <Slider {...settings} ref={sliderRef}>
        {carouselcategory.map((c, index) => (
          <div key={index}>
            <div className='banner banner-overlay-category'>
              <a>
                <img src={c.url} style={{ height: '200px', width: '400px' }} alt={c.title} />
              </a>
              <div className='banner-content'>
                <h4 className='banner-subtitle text-white'>
                  <a>{c.subTitle}</a>
                </h4>
                <h3 className='banner-title text-white'>
                  <a>{c.title}</a>
                </h3>
                <a className='btn btn-outline-white-3 banner-link'>
                  Discover Now
                  <i className='icon-long-arrow-right' />
                </a>
              </div>
            </div>
          </div>
        ))}
      </Slider>
      <div className='carousel-buttons'>
        <Button className='carousel-btn prev-btn' icon={<IoIosArrowDropleft onClick={() => sliderRef.current?.slickPrev()}/>} />
        <Button className='carousel-btn next-btn' icon={<IoIosArrowDropright onClick={() => sliderRef.current?.slickNext()}/>} />
      </div>
    </div>
  )
}

export default CategoryCarousel
