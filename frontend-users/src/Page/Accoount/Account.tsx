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
import { Dialog } from 'primereact/dialog'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../Store/store'
import { setLoaded, setLoading } from '../../Store/loadingSlice'
import Loading from '../../Components/Loading/Loading'

interface AccountData {
  Id: string
  Email: string
  Username: string
  Phone: string
}

interface AccountPasswordData {
  Id: string
  Password: string
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
  const [avatar, setAvatar] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const isLoading = useSelector((state: RootState) => state.loading.isLoading)
  const dispatch = useDispatch()

  const [user, setUser] = useState<any>(null)
  const userId = useSelector((state: RootState) => state.auth.userId)

  useEffect(() => {
    dispatch(setLoading())

    const timeout = setTimeout(() => {
      dispatch(setLoaded())
    }, 1000)

    return () => clearTimeout(timeout)
  }, [dispatch])

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

  // Handle File - avatar
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0]
      if (file) {
        setSelectedFile(file)

        // Update avatar
        const formData = new FormData()
        formData.append('Id', String(userId))
        formData.append('Avatar', file)

        try {
          const res = await $axios.put('UserFE/UserUpdateAvatar', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          if (res.status === 200) {
            await Swal.fire({
              title: 'Avatar uploaded successfully!',
              icon: 'success',
              showConfirmButton: false,
              timer: 1500
            })
          }
        } catch {
          await Swal.fire({
            title: 'Avatar upload failed!',
            text: 'Please try again.',
            icon: 'error'
          })
        }
      }
    }
  }

  // Update Account Data
  const handleUpdateAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const accountData: AccountData = { Id: userId ?? '', Email: email, Username: username, Phone: phone }

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

  // Handle Change Password
  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setShowSetPassword(false)

    if (!passwordMatch) return

    const data: AccountPasswordData = { Id: userId ?? '', Password: newPassword }

    try {
      const res = await $axios.put('UserFE', data)

      if (res.status === 200) {
        await Swal.fire({
          title: 'Update Success!',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500
        })
      }

      setNewPassword('')
      setConfirmPassword('')
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

  useEffect(() => {
    getUserById()
  }, [userId])

  // fetch data user
  const getUserById = async () => {
    if (!userId) return

    try {
      const res = await $axios.get(`UserFE/getUserById/${userId}`)
      const userData = res.data
      setUser(userData)
      setEmail(userData.Email ? userData.Email : email)
      setUsername(userData.Username ? userData.Username : username)
      setPhone(userData.Phone ? userData.Phone : phone)
      setAvatar(userData.Avatar ? userData.Avatar : avatar)
    } catch (error) {
      console.error('Error fetching user data:', error)
      Swal.fire({
        title: 'Error',
        text: 'Failed to retrieve user data.',
        icon: 'error'
      })
    }
  }

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
      {userId ? (
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
                    {isLoading ? (
                      <div className='mb-5' style={{ height: '100px' }}>
                        <Loading />
                      </div>
                    ) : (
                      <Avatar
                        image={
                          selectedFile
                            ? URL.createObjectURL(selectedFile)
                            : avatar
                              ? `${import.meta.env.VITE_API_BACKEND_IMAGE}/${user.Avatar}`
                              : '/images/no-avatar.jpg'
                        }
                        size='xlarge'
                        shape='circle'
                        className='avatar-img'
                      />
                    )}

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

                    {/* Change Password */}
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
                      style={{ width: '30vw' }}
                      breakpoints={{ '960px': '75vw', '641px': '100vw' }}
                    >
                      <form onSubmit={(e) => handleChangePassword(e)}>
                        <div className='profile-group-dialog'>
                          <p>New Passowrd</p>
                          <InputText
                            type='password'
                            className='p-inputtext-sm'
                            value={newPassword}
                            onChange={handleNewPasswordChange}
                          />
                        </div>
                        <div className='mt-3'></div>

                        <div className='profile-group-dialog'>
                          <p>Confirm Password</p>
                          <InputText
                            type='password'
                            className='p-inputtext-sm'
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                          />
                        </div>
                        
                        {!passwordMatch && <p style={{ color: 'red', fontSize: '14px', marginLeft: '150px' }}>Password Do Not Match</p>}
                        

                        <div className='profile-group-dialog mt-3'>
                          <p></p>
                          <Button type='submit'className='btn-update-dialog' label='Update Password' onClick={(e: any) => handleChangePassword(e)} />
                        </div>
                      </form>
                    </Dialog>

                    <div className='mt-3'></div>
                    {/* Logout */}
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
