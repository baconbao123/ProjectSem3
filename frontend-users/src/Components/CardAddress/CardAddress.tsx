import React, { useState } from 'react'
import './CardAddress.scss'
import { Col, Row } from 'react-bootstrap'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'

export interface CardAddressState {
  Id: string
  Username: string
  Phone: string
  Address: string
  DetailAddress: string
}

interface CardAddressProps {
  cardAdress: CardAddressState
  selectedId: string
  setSelectedId: (id: string) => void
}

const CardAddress: React.FC<CardAddressProps> = ({ cardAdress, selectedId, setSelectedId }) => {
  const [viewUpdateAddress, setViewUpdateAddress] = useState<boolean>(false)

  const handleChange = () => {
    setSelectedId(cardAdress.Id)
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
              <span className='name'>{cardAdress.Address}</span>
            </Col>
            <Col lg={6}>
              <span className='phone'>{cardAdress.Phone}</span>
            </Col>
          </Row>
          <Row className='mt-3'>
            <Col lg={12}  className='address'>{cardAdress.DetailAddress}</Col>
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
                <InputText id='Address'/>
              </span>
            </div>
            <div className='row-address-3'>
              <Button label='Save' className='save' onClick={() => setViewUpdateAddress(false)}/>
            </div>
          </Dialog>
        </Col>
      </Row>
    </div>
  )
}

export default CardAddress
