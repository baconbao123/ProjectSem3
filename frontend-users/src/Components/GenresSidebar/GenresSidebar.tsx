import React, { useState } from 'react'
import 'primeicons/primeicons.css'
import './GenresSidebar.scss'
import { Link } from 'react-router-dom'

interface GenresSidebar {
  genres: string
  categoryNames: string[]
  parentCategory: any
}

const GenresSidebar: React.FC<GenresSidebar> = ({ genres, categoryNames, parentCategory }) => {
  const [showSubCategory, setShowSubcategory] = useState(true)
  console.log(parentCategory)

  return (
    <div className='sidebar'>
      <ul className='category-list'>
        <li>
          <div className='category-name' onClick={() => setShowSubcategory(!showSubCategory)}>
            <span className='name'>{parentCategory}</span>
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
                <li key={index} className='subcategory-item'>
                  <Link
                    to={`/${parentCategory}/${subcategory}`}
                    style={{ color: subcategory === genres ? 'lightseagreen' : 'black', textDecoration: 'none' }}
                  >
                    <span className='span-subcategry-item'>{subcategory}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      </ul>
    </div>
  )
}

export default GenresSidebar
