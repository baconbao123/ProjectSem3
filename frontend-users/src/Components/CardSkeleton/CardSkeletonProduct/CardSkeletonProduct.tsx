import { Skeleton } from 'primereact/skeleton'
import React from 'react'
import { Row } from 'react-bootstrap'

const CardSkeletonProduct: React.FC = () => {
  return (
    <>
      <Row>
        <Skeleton width='100%' height='150px'></Skeleton>
      </Row>
      <Row className='mt-2'>
        <Skeleton width='100%' height='.5rem'></Skeleton>
      </Row>
      <Row className='mt-2'>
        <Skeleton width='40%' height='.5rem'></Skeleton>
      </Row>
      <Row className='mt-2  justify-content-end'>
        <Skeleton width='40%' height='.5rem'></Skeleton>
      </Row>
      <Row className='mt-2' style={{display: 'flex', justifyContent: 'space-between'}}>
        <Skeleton width='6rem' height='2rem'></Skeleton>
        <Skeleton width='12rem' height='2rem'></Skeleton>
      </Row>
    </>
  )
}

export default CardSkeletonProduct
