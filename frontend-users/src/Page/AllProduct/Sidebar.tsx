import React, { useState } from 'react'
import 'primeicons/primeicons.css'
import './Sidebar.scss'

interface Category {
  name: string
  subCategories: string[]
}

const Sidebar: React.FC = () => {
  const [showSubCategory, setShowSubcategory] = useState(true)

  const categories: Category = {
    name: 'All Categories',
    subCategories: [
      'Fiction',
      'Trinh thám',
      'Technology',
      'Fiction',
      'Trinh thám',
      'Fiction',
      'Trinh thám',
      'Technology',
      'Fiction',
      'Trinh thám'
    ]
  }

  const prices: Category = {
    name: 'Price',
    subCategories: ['0-$100', '$101-$200', '$300-$400']
  }

  return (
    <div className='sidebar'>
      <ul className='category-list'>
        <li key={categories.name}>
          <div className='category-name' onClick={() => setShowSubcategory(!showSubCategory)}>
            <span className='name'>{categories.name}</span>
            {!showSubCategory && (
              <span>
                <i className='pi pi-plus'></i>
              </span>
            )}
            {showSubCategory && (
              <span>
                <i className='pi pi-minus'></i>
              </span>
            )}
          </div>

          {showSubCategory && (
            <ul className='subcategory-list'>
              {categories.subCategories.map((subcategory, index) => (
                <li key={index} className='subcategory-item'>
                  {subcategory}
                </li>
              ))}
            </ul>
          )}
        </li>
      </ul>
      <ul className='prices-list'>
        <li key={prices.name}>
          <span className='price-name'>{prices.name}</span>
          <ul className='subprices-list'>
            {prices.subCategories.map((price, index) => (
              <li key={index} className='subprice-item'>
                <input type='checkbox' value={price} /> {price}
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </div>
  )
}

export default Sidebar
