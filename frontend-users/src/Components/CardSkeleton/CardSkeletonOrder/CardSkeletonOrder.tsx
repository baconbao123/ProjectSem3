import React from 'react'
import './CardSkeletonOrder.scss'
import { Skeleton } from 'primereact/skeleton'

const CardSkeletonOrder: React.FC = () => {
  return (
    <div className='card-skeleton-order-master'>
      <Skeleton shape='circle' size='8rem' className='card-order-circle'></Skeleton>
      <div className='card-skeleton-left'>
        <Skeleton width='16rem' height='2rem'></Skeleton>
        <Skeleton width='114rem' className='mt-3'></Skeleton>
        <Skeleton height='5rem' className='mt-3'></Skeleton>
      </div>
    </div>
  )
}

export default CardSkeletonOrder
