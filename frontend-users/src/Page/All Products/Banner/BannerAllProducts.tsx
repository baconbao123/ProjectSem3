import React, { useEffect, useState } from 'react'
import './BannerAllProducts.scss'

const images = [
  '/images/banner-category-1.jpg',
  '/images/banner-category-2.png',
  '/images/banner-category-3.jpg',
  '/images/bannerCD.png'
]

const BannerAllProducts: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className='banner-container'>
      <div className='multi-layer-background'>
        <div className='layer neon1' />
        <div className='layer neon2' />
        <div className='layer neon3' />
      </div>
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`banner-${index}`}
          className={`img-all-books ${currentIndex === index ? 'active' : 'inactive'}`}
        />
      ))}
      <div className='banner-text'>
        <h1 className='title'>Explore the Colorful World</h1>
        <p className='subtitle'>A Journey with Books, Stationery, and More</p>
      </div>
    </div>
  )
}

export default BannerAllProducts
