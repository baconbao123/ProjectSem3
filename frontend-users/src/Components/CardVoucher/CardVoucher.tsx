import React from 'react'
import 'primeicons/primeicons.css'
import './CardVoucher.scss'
import { Button } from 'primereact/button'
import { createVoucher } from './initCardVoucher'
export interface CardVoucherProps {
  type: 'Freeship' | 'discountByOrder' | 'discountByCategory'
  id?: string
  discount: string
  status: string
  subCate?: string
  totalOrder?: string
  userId?: string
  quantity: string
  selectedType: string
  isDisabled?: boolean
  total?: number
  productCategory?: string[]
  handleCancel: (id: string, type: string) => void
  handleStatusBelong: (id: string, type: string) => void
  handleStatusGet: (id: string) => void
}

const CardVoucher: React.FC<CardVoucherProps> = ({
  id, //
  type, //
  discount, //
  status, //
  subCate, //
  totalOrder, //
  userId,
  quantity, //
  total,
  isDisabled,
  productCategory,
  handleCancel,
  handleStatusBelong,
  handleStatusGet
}) => {
  // Create voucher
  const voucher = createVoucher(
    id ?? '',
    type,
    discount,
    quantity,
    status,
    userId ?? '',
    subCate ?? '',
    totalOrder ?? ''
  )

  const bgCard =
    type === 'Freeship' ? 'bg-Freeship' : type === 'discountByOrder' ? 'bg-discountByOrder' : 'bg-discountByCategory'

  const isDisabledByPrice =
    (total !== undefined && total < Number(totalOrder ?? 0)) ||
    (type === 'discountByCategory' && subCate && productCategory && !productCategory.includes(subCate))

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
        {!id ? <span className='text'>Save the voucher now</span> : <span className='text'>Use the voucher now</span>}
      </div>
      {/* voucher in voucher page, status === 'GET */}
      {status === 'GET' ? (
        <div className='card-btn'>
          <Button label='Get' className='btnGet' onClick={() => handleStatusGet(id ?? '')} />
        </div>
      ) : status === 'CLAIMED' ? (
        <div className='card-btn'>
          <span className='claimed'>CLAIMED</span>
        </div>
      ) : null}
      {/* voucher in cart, status === 'BELONG */}
      {status === 'BELONG' ? (
        <div className='card-btn'>
          <Button
            label='USE'
            className='btnUse'
            onClick={() => handleStatusBelong(id ?? '', type)}
            disabled={Boolean(isDisabled) || Boolean(isDisabledByPrice)}
          />
        </div>
      ) : status === 'USED' ? (
        <div className='card-btn'>
          <Button label='Cancel' className='btnCancel' onClick={() => handleCancel(id ?? '', type)} />
        </div>
      ) : null}
    </div>
  )
}

export default CardVoucher
