import React, { useState } from 'react'
import CardAddress from '../CardAddress'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import './CardAddressList.scss'

interface CardAddressProps {
  addresses: any
  selectedId: string;
  setSelectedId: (id: string) => void;
}

const CardAddressList: React.FC<CardAddressProps> = ({ addresses, selectedId, setSelectedId }) => {
  const [viewAddAddress, setViewAddAddress] = useState<boolean>(false)

  return (
    <>
      {addresses.map((c: any, index: any) => (
        <div className='card-address-list' key={index}>
          <CardAddress key={c.Id} cardAdress={c} selectedId={selectedId} setSelectedId={setSelectedId} />
        </div>
      ))}
      <div className='div-add-address'>
        <Button label='Add New Address' className='btn-add-address' onClick={() => setViewAddAddress(true)} />
        <Dialog
          header='Add New Address'
          visible={viewAddAddress}
          style={{ width: '40vw' }}
          onHide={() => {
            if (!viewAddAddress) return
            setViewAddAddress(false)
          }}
        >
          <div className='row-address-1'>
            <span className='input-address-group'>
              <label htmlFor='Username'>Username</label>
              <InputText id='Username' />
            </span>
            <div className='input-address-group' style={{ marginLeft: '10px' }}>
              <label htmlFor='Phone'>Phone</label>
              <InputText id='Phone' />
            </div>
          </div>
          <div className='row-address-2'>
            <span className='input-address-group'>
              <label htmlFor='Address'>Address</label>
              <InputText id='Address' />
            </span>
          </div>
          <div className='row-address-3'>
            <Button label='Save' className='save' onClick={() => setViewAddAddress(false)} />
          </div>
        </Dialog>
      </div>
    </>
  )
}

export default CardAddressList
