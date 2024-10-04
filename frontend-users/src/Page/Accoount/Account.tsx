import React, { useState } from 'react'
import './Account.scss'
import { Col, Container, Row } from 'react-bootstrap'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Avatar } from 'primereact/avatar'
import { GiCancel } from 'react-icons/gi'
// import { useSelector } from 'react-redux'
// import { RootState } from '../../Store/store'

// interface AccountUpdateData {
//   Id: number
//   Email: string
//   Password: string
//   Username: string
//   Phone: string
//   Avatar: File | null
// }

const Account: React.FC = () => {
  const [username, setUsername] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [newPassword, setNewPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [passwordMatch, setPasswordMatch] = useState<boolean>(true)
  const [isConfirmTouched, setIsConfirmTouched] = useState<boolean>(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  // const userId = useSelector((state: RootState) => state.auth.userId)
  
  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value)
    if (isConfirmTouched) {
      setPasswordMatch(e.target.value === confirmPassword)
    }
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setConfirmPassword(e.target.value)
    setIsConfirmTouched(true)
    setPasswordMatch(newPassword === value)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (e.target.value && e.target.files[0]) {
        const file = e.target.files[0]
        setSelectedFile(file)
        setFileName(file.name)
      }
    }
  }

  const handleCancel = () => {
    setSelectedFile(null)
    setFileName(null)
  }

  const handleUpdateAccount = async (e:  React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

      // const data: AccountUpdateData = {Id: userId, Email: email, Password: newPassword, Username: username, Phone: phone, Avatar: selectedFile}
  }

  return (
    <div className='container-master-account'>
      <Container className='container-account'>
        <Row className='row-my-profile'>
          <div className='myProfile'>My Profile</div>
          <div className='sub-myProfile'>Manage profile information for account security</div>
        </Row>
        <form onSubmit={handleUpdateAccount}>
          <Row className='row-my-profile-content'>
            <Col lg={8} className='col-profile-content'>
              <div className='profile-group'>
                <p>Username</p>
                <InputText
                  type='text'
                  className='p-inputtext-sm'
                  placeholder={username}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className='profile-group'>
                <p>Email</p>
                <InputText
                  type='text'
                  className='p-inputtext-sm'
                  placeholder={email}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className='profile-group'>
                <p>Phone</p>
                <InputText
                  type='text'
                  className='p-inputtext-sm'
                  placeholder={phone}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className='profile-group'>
                <p>New Password</p>
                <InputText
                  type='password'
                  className='p-inputtext-sm'
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                />
              </div>
              <div className='profile-group'>
                <p>Confirm Password</p>
                <InputText
                  type='password'
                  className='p-inputtext-sm'
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                />
                {!passwordMatch && <p style={{ color: 'red', fontSize: '12px' }}>Passwords do not match</p>}
              </div>
              <div className='profile-group'>
                <p></p>
                <Button label='Save' severity='success' outlined className='btn-save' />
              </div>
            </Col>
            {/* avatar */}
            <Col lg={4} className='col-avatar'>
              <Avatar image='images/no-avatar.png' size='xlarge' shape='circle' className='avatar-img' /> <br />
              <Button label='Select Avatar' severity='success' outlined className='btn-avatar'>
                <input
                  type='file'
                  accept='image/png, image/jpeg'
                  onChange={handleFileChange}
                  style={{ opacity: 0, position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }}
                />
              </Button>
              {selectedFile && (
                <>
                  <Row className='avatar-selected'>
                    <Col lg={2}>
                      <img src={URL.createObjectURL(selectedFile)} alt='Selected Avatar' />
                    </Col>
                    <Col lg={8}>
                      <div style={{ fontSize: '12px' }}>{fileName}</div>
                    </Col>
                    <Col lg={2} className='col-cancel-img'>
                      <GiCancel className='icon-cancel' onClick={handleCancel} />
                    </Col>
                  </Row>
                </>
              )}
            </Col>
          </Row>
        </form>
      </Container>
    </div>
  )
}

export default Account
