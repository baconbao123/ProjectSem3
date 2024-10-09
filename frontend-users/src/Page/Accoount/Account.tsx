import React, { useEffect, useState } from 'react'
import './Account.scss'
import { Col, Container, Row } from 'react-bootstrap'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Avatar } from 'primereact/avatar'
import Cookies from 'js-cookie'
import axios from 'axios'
import { $axios } from '../../axios'
import Swal from 'sweetalert2'
import RequiredLogin from '../../Components/RequiredLogin/RequiredLogin'
import { useParams } from 'react-router-dom'
import { Dialog } from 'primereact/dialog'

interface AccountData {
  Id: string
  Email: string
  Username: string
  Phone: string
}

const Account: React.FC = () => {
  // Username
  const [username, setUsername] = useState<string>('')
  // Email
  const [email, setEmail] = useState<string>('')
  // Phone
  const [phone, setPhone] = useState<string>('')
  // Password
  const [showSetPassword, setShowSetPassword] = useState<boolean>(false)
  const [newPassword, setNewPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [passwordMatch, setPasswordMatch] = useState<boolean>(true)
  const [isConfirmTouched, setIsConfirmTouched] = useState<boolean>(false)
  // File - avatar
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  // Set password

  const [user, setUser] = useState<any>(null)
  const { id } = useParams<{ id: string }>()

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
      const file = e.target.files[0]
      if (file) {
        setSelectedFile(file)
        setFileName(file.name)

        const reader = new FileReader()
        reader.onloadend = () => {
          setUser((prevUser: any) => ({
            ...prevUser,
            Avatar: reader.result as string
          }))
        }
        reader.readAsDataURL(file)
      }
    }
  }

  const handleUpdateAccount = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    const accountData: AccountData = { Id: id ?? '', Email: email, Username: username, Phone: phone }

    try {
      const res = await $axios.put('UserFE', accountData)
      if (res.status === 200) {
        await Swal.fire({
          title: 'Update Success!',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500
        })
      }

      // window.location.reload()
    } catch (error) {
      let errorMess = ''

      if (axios.isAxiosError(error) && error.response?.data) {
        errorMess = Array.isArray(error.response.data) ? error.response.data.join('\n') : error.response.data
      }
      await Swal.fire({
        title: 'Update Failed!',
        text: errorMess,
        icon: 'error'
      })
    }
  }

  const getUserById = async () => {
    if (!id) return

    try {
      const res = await $axios.get(`UserFE/getUserById/${id}`)
      const userData = res.data
      setUser(userData)
      setEmail(userData.Email ? userData.Email : email)
      setUsername(userData.Username ? userData.Username : username)
      setPhone(userData.Phone ? userData.Phone : phone)
    } catch (error) {
      console.error('Error fetching user data:', error)
      Swal.fire({
        title: 'Error',
        text: 'Failed to retrieve user data.',
        icon: 'error'
      })
    }
  }

  useEffect(() => {
    getUserById()
  }, [id])

  async function handleLogout() {
    Swal.fire({
      title: 'Confirm logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          Cookies.remove('token')
          Cookies.remove('refreshToken')

          window.location.reload()
        } catch (error) {
          console.error('Logout failed:', error)
        }
      }
    })
  }

  return (
    <>
      {id ? (
        user && (
          <div className='container-master-account'>
            <Container className='container-account'>
              <Row className='row-my-profile'>
                <div className='myProfile'>My Profile</div>
                <div className='sub-myProfile'>Manage profile information for account security</div>
              </Row>
              <form onSubmit={handleUpdateAccount}>
                <Row className='row-my-profile-content'>
                  {/* avatar */}
                  <Col lg={4} className='col-avatar'>
                    <Avatar
                      image={
                        selectedFile
                          ? URL.createObjectURL(selectedFile)
                          : user?.Avatar
                            ? `${import.meta.env.VITE_API_BACKEND_IMAGE}/${user.Avatar}`
                            : '/images/no-avatar.jpg'
                      }
                      size='xlarge'
                      shape='circle'
                      className='avatar-img'
                    />
                    <div className='mt-3'></div>
                    <Button label='Select Avatar' className='btn-avatar' type='button'>
                      <input
                        type='file'
                        accept='image/png, image/jpeg'
                        onChange={handleFileChange}
                        style={{ opacity: 0, position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }}
                      />
                    </Button>

                    <div className='mt-3'></div>

                    <Button
                      type='button'
                      label='Change Password'
                      className='btn-change-pass'
                      onClick={() => setShowSetPassword(true)}
                    />
                    <Dialog
                      header='Update Password'
                      visible={showSetPassword}
                      onHide={() => {
                        if (!showSetPassword) return
                        setShowSetPassword(false)
                      }}
                      style={{ width: '50vw' }}
                      breakpoints={{ '960px': '75vw', '641px': '100vw' }}
                    >
                      <div className='profile-group-dialog'>
                        <p>New Passowrd</p>
                        <InputText
                          type='password'
                          className='p-inputtext-sm'
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                      <div className='mt-3'></div>

                      <div className='profile-group-dialog'>
                        <p>Confirm Password</p>
                        <InputText
                          type='text'
                          className='p-inputtext-sm'
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                    </Dialog>

                    <div className='mt-3'></div>
                    <Button label='Logout' onClick={() => handleLogout()} className='btn-logout' type='button' />
                  </Col>
                  <Col lg={8} className='col-profile-content'>
                    <div className='profile-group'>
                      <p>Username</p>
                      <InputText
                        type='text'
                        className='p-inputtext-sm'
                        placeholder={user.Username ? user.Username : username}
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
                      <p></p>
                      <Button type='submit' label='Save' className='btn-save' />
                    </div>
                  </Col>
                </Row>
              </form>
            </Container>
          </div>
        )
      ) : (
        <RequiredLogin />
      )}
    </>
  )
}

export default Account
