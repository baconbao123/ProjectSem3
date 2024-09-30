import React, { useState } from 'react'
import 'primeicons/primeicons.css'
import './GenresSidebar.scss'

// interface Category {
//   name: string
//   subCategories: string[]
// }

interface GenresSidebar {
  genres: string
  categoryNames: string[]
}

const GenresSidebar: React.FC<GenresSidebar> = ({ genres, categoryNames }) => {
  const [showSubCategory, setShowSubcategory] = useState(true)

  // const prices: Category = {
  //   name: 'Price',
  //   subCategories: ['0-$100', '$101-$200', '$300-$400']
  // }

  return (
    <div className='sidebar'>
      <ul className='category-list'>
        <li>
          <div className='category-name' onClick={() => setShowSubcategory(!showSubCategory)}>
            <span className='name'>All Categories</span>
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
              {categoryNames.map((subcategory, index) => (
                <li
                  key={index}
                  className='subcategory-item'
                  style={{ color: subcategory === genres ? 'lightseagreen' : 'black' }}
                >
                  {subcategory}
                </li>
              ))}
            </ul>
          )}
        </li>
      </ul>
      {/* <ul className='prices-list'>
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
      </ul> */}
    </div>
  )
}

export default GenresSidebar
