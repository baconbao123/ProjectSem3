import React from 'react'
import 'primeicons/primeicons.css'
import './CardVoucher.scss'
import { Button } from 'primereact/button'
import createVoucher, { InitVoucherState } from './initCardVoucher'

export interface CardVoucherProps {
  initVoucher: InitVoucherState
  handleStatusGet?: (saleId: string) => void
}

const CardVoucher: React.FC<CardVoucherProps> = ({ initVoucher, handleStatusGet }) => {
  // Create voucher
  const voucher = createVoucher(initVoucher)

  const handleStatusGetVoucher = () => {
    if (voucher.Id && handleStatusGet) {
      handleStatusGet(voucher.Id.toString())
    }
  }

  const bgCard =
    initVoucher.Type === 1 ? 'bg-Freeship' : initVoucher.Type === 2 ? 'bg-discountByOrder' : 'bg-discountByCategory'
  // const isDisabledByPrice =
  //   type === 3 && subCate && productCategory && !productCategory.includes(subCate)

  return (
    <div className={`card-vouchers ${bgCard}`}>
      <div className='card-left'>
        <i className={voucher.icon} />
        <span className='name'>{voucher.name}</span>
      </div>
      <div className='card-right'>
        <div>
          <span>
            SAVE {parseFloat(voucher.Discount) * 100}% {voucher.desc} {voucher.subCate}
          </span>
          <br />
          <span className='text'>Save the voucher now</span>
        </div>
        <Button label='Get' className='btnGet' onClick={() => handleStatusGetVoucher()} />
      </div>
    </div>
  )
}

export default CardVoucher
