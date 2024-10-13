import React, { useState } from 'react'
import CardAddress from '../CardAddress'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import './CardAddressList.scss'
import { useSelector } from 'react-redux'
import { RootState } from '../../../Store/store'
import Swal from 'sweetalert2'
import { $axios } from '../../../axios'
import { InputSwitch } from 'primereact/inputswitch'

interface CardAddressProps {
  addresses: any
  selectedId: string
  setSelectedId: (id: string) => void
  setAddresses: any
  onSelectAddress: any
}

interface AddressData {
  UserId: number
  AssignName: string
  Assign: boolean
  Phone: string
  Index: boolean
  Address: string
  DetailAddress: string
}

const CardAddressList: React.FC<CardAddressProps> = ({
  addresses,
  selectedId,
  setSelectedId,
  setAddresses,
  onSelectAddress
}) => {
  const [viewAddAddress, setViewAddAddress] = useState<boolean>(false)
  console.log(addresses)

  const [assignName, setAssignName] = useState<string>('')
  const [assign, setAssign] = useState<boolean>(false)
  const [phone, setPhone] = useState<string>('')
  const [index, setIndex] = useState<boolean>(false)
  const [address, setAddress] = useState<string>('')
  const [detailAddress, setDetailAddress] = useState<string>('')
  const userId = useSelector((state: RootState) => state.auth.userId)

  const handleAddAddress = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const addressData: AddressData = {
      UserId: userId ? Number(userId) : 0,
      AssignName: assignName,
      Assign: assign,
      Phone: phone,
      Index: index,
      Address: address,
      DetailAddress: detailAddress
    }

    console.log(addressData)

    try {
      const res = await $axios.post('AddressUserFE', addressData)

      if (res.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Address Added Successfully',
          showConfirmButton: false,
          timer: 1500
        })
      }

      const updatedAddresses = await $axios.get(`AddressUserFE/GetAdressByUser/${userId}`)
      setAddresses(updatedAddresses.data)
      setIndex(false)
      setAssign(false)
      setAssignName('')
      setAddress('')
      setDetailAddress('')
    } catch (error) {
      console.log(error)
      Swal.fire({
        icon: 'error',
        title: 'Address Addition Failed',
        showConfirmButton: false,
        timer: 1500
      })
    }
  }

  return (
    <>
      {addresses.map((c: any, index: any) => (
        <div className='card-address-list' key={index}>
          <CardAddress
            key={c.Id}
            cardAdress={c}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            onSelectAddress={onSelectAddress}
          />
        </div>
      ))}
      <div className='div-add-address'>
        {/* Add new Address */}
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
          <form onSubmit={handleAddAddress}>
            <div className='row-address-1'>
              <span className='input-address-group'>
                <label htmlFor='Username'>AssignName</label>
                <InputText id='Username' value={assignName} onChange={(e) => setAssignName(e.target.value)} />
              </span>
              <div className='input-address-group' style={{ marginLeft: '10px' }}>
                <label htmlFor='Phone'>Phone</label>
                <InputText id='Phone' value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>
            <div className='row-address-2'>
              <span className='input-address-group'>
                <label htmlFor='Address'>Address</label>
                <InputText id='Address' value={address} onChange={(e) => setAddress(e.target.value)} />
              </span>
            </div>
            <div className='row-address-2'>
              <span className='input-address-group'>
                <label htmlFor='AddressDetail'>Address Details</label>
                <InputText
                  id='AddressDetail'
                  value={detailAddress}
                  onChange={(e) => setDetailAddress(e.target.value)}
                />
              </span>
            </div>
            <div className='row-address-2 mt-2'>
              <span className='span-default'>Set as default address</span>
              <InputSwitch checked={index} onChange={(e) => setIndex(e.value)} className='input-switch-address' />{' '}
            </div>
            <div className='row-address-2 mt-2'>
              <input
                type='checkbox'
                checked={assign}
                onChange={(e) => setAssign(e.target.checked)}
                className='checkbox-confirm'
              />
              <span className='span-confirm'>Allow someone else to receive it for you</span>
            </div>
            <div className='row-address-3 mt-3'>
              <Button type='submit' label='Save' className='save' onClick={() => setViewAddAddress(false)} />
            </div>
          </form>
        </Dialog>
      </div>
    </>
  )
}

export default CardAddressList
