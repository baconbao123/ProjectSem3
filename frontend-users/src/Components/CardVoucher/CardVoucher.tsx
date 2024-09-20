import React from 'react'
import 'primeicons/primeicons.css'
import './CardVoucher.scss'
import { Button } from 'primereact/button'
import { createVoucher } from './initCardVoucher'


export interface CardVoucherProps {
  type: 'Freeship' | 'discountByOrder' | 'discountByCategory'
  discount: string
  subCate?: string
  totalOrder?: string
}

const CardVoucher: React.FC<CardVoucherProps> = ({ type, discount, subCate, totalOrder }) => {
  const voucher = createVoucher(type, discount, subCate, totalOrder)
  const bgCard =
    type === 'Freeship' ? 'bg-Freeship' : type === 'discountByOrder' ? 'bg-discountByOrder' : 'bg-discountByCategory'

  return (
    <div className={`card-vouchers ${bgCard}`}>
      <div className='card-left'>
        <i className={voucher.icon} />
        <span className='name'>{voucher.name}</span>
      </div>
      <div className='card-right'>
        <span>
          SAVE ${voucher.discount} {voucher.desc} {voucher.subCate} ${voucher.totalOrder}
        </span>
        <br />
        <span className='text'>Save the voucher now</span>
      </div>
      <div className='card-btn'>
        <Button label='Get' className='btnGet' />
      </div>
    </div>
  )
}

export default CardVoucher
