import React, { useState } from 'react'
import './CardAddress.scss'
import { Col, Row } from 'react-bootstrap'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { InputSwitch } from 'primereact/inputswitch'

export interface CardAddressState {
  Id: string
  UserId: string
  AssignName: string
  Assign: boolean
  Phone: string
  Address: string
  DetailAddress: string
  Index: boolean
}

interface CardAddressProps {
  cardAdress: CardAddressState
  selectedId: string
  setSelectedId: (id: string) => void
  onSelectAddress: any
}

const CardAddress: React.FC<CardAddressProps> = ({ cardAdress, selectedId, setSelectedId, onSelectAddress }) => {
  const [viewUpdateAddress, setViewUpdateAddress] = useState<boolean>(false)
  const [assignName, setAssignName] = useState<string>(cardAdress.AssignName)
  const [assign, setAssign] = useState<boolean>(cardAdress.Assign)
  const [phone, setPhone] = useState<string>(cardAdress.Phone)
  const [index, setIndex] = useState<boolean>(cardAdress.Index)
  const [address, setAddress] = useState<string>(cardAdress.Address)
  const [detailAddress, setDetailAddress] = useState<string>(cardAdress.DetailAddress)

  const handleChange = () => {
    setSelectedId(cardAdress.Id)
    onSelectAddress(cardAdress)
  }

  const handleUpdateAddress = (e: any) => {
    e.preventDefault()
    // setViewUpdateAddress(false)

    try {

    } catch(error) {
      console.log(error);
      
    }
  
  }

  return (
    <div className='container-card-address-master'>
      <Row>
        <Col lg={1} style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
          <input
            type='radio'
            value={cardAdress.Id}
            onChange={() => handleChange()}
            checked={selectedId === cardAdress.Id}
          />
        </Col>
        <Col lg={9}>
          <Row>
            <Col lg={6} style={{ borderRight: '1px solid gainsboro' }}>
              <span className='name'>{cardAdress.AssignName}</span>
            </Col>
            <Col lg={6}>
              <span className='phone'>{cardAdress.Phone}</span>
            </Col>
          </Row>
          <Row className='mt-3'>
            <Col lg={12} className='address'>
              {cardAdress.Address}
            </Col>
          </Row>
          <Row className='mt-3'>
            <Col lg={12} className='address'>
              Address Details: {cardAdress.DetailAddress}
            </Col>
          </Row>
        </Col>
        <Col lg={2} style={{ display: 'flex', justifyContent: 'center' }}>
          <span className='update' onClick={() => setViewUpdateAddress(true)}>
            Update
          </span>
          <Dialog
            header='Update Address'
            visible={viewUpdateAddress}
            style={{ width: '40vw' }}
            onHide={() => {
              if (!viewUpdateAddress) return
              setViewUpdateAddress(false)
            }}
          >
            <form>
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
                <InputSwitch
                  checked={index}
                  onChange={(e) => setIndex(e.value)}
                  className='input-switch-address'
                />{' '}
              </div>
              <div className='row-address-2 mt-3'>
                <input
                  type='checkbox'
                  checked={assign}
                  onChange={(e) => setAssign(e.target.checked)}
                  className='checkbox-confirm'
                />
                <span className='span-confirm'>Allow someone else to receive it for you</span>
              </div>
              <div className='row-address-3 mt-3'>
                <Button type='submit' label='Save' className='save' onClick={(e) => handleUpdateAddress(e)} />
              </div>
            </form>
          </Dialog>
        </Col>
      </Row>
    </div>
  )
}

export default CardAddress
