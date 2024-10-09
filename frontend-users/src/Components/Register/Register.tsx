import React, { useEffect, useState } from 'react'
import { $axios } from '../../axios'
import Swal from 'sweetalert2'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { Col, Container, Row } from 'react-bootstrap'
import './Register.scss'
import { Button } from 'primereact/button'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../Store/store'
import { setLoaded, setLoading } from '../../Store/loadingSlice'
import Loading from '../Loading/Loading'

interface RegisterData {
  Username: string
  Email: string
  Password: string
}

const Register = () => {
  const [usernameRegister, setUsernameRegister] = useState<string>('')
  const [emailRegister, setEmailRegister] = useState<string>('')
  const [passwordRegister, setPasswordRegister] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [isConfirmTouched, setIsConfirmTouched] = useState<boolean>(false)
  const [passwordMatch, setPasswordMatch] = useState<boolean>(true)
  const isLoading = useSelector((state: RootState) => state.loading.isLoading)
  const dispatch = useDispatch()

  const navigate = useNavigate()

  useEffect(() => {
    dispatch(setLoading())

    const timeoutId = setTimeout(() => {
      dispatch(setLoaded())
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [dispatch])

  const handleLoaded = () => {
    dispatch(setLoaded())
  }

  // Handle match Password
  const handlePasswordRegister = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordRegister(e.target.value)
    if (isConfirmTouched) {
      setPasswordMatch(e.target.value === confirmPassword)
    }
  }

  const handleConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setConfirmPassword(e.target.value)
    setIsConfirmTouched(true)
    setPasswordMatch(passwordRegister === value)
  }

  // Handle form register
  const handleSubmitRegister = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    if (!passwordMatch) {
      return
    }

    const registerData: RegisterData = { Username: usernameRegister, Email: emailRegister, Password: passwordRegister }

    try {
      const res = await $axios.post('UserFe', registerData)
      console.log(res)

      if (res.status === 200) {
        await Swal.fire({
          title: 'Register Success!',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500
        })
        setUsernameRegister('')
        setEmailRegister('')
        setPasswordRegister('')
      }

      navigate('/login')
    } catch (error) {
      let errorMess = ''

      if (axios.isAxiosError(error) && error.response?.data) {
        errorMess = error.response.data
      }
      await Swal.fire({
        title: 'Register Failed!',
        text: errorMess,
        icon: 'error'
      })
    }
  }

  return (
    <Container className='container-register'>
      <div className='form-box-register'>
        <Row>
          <Col lg={6} className='col-video-register'>
            <div className='image-container'>
              {isLoading ? (
                <Loading />
              ) : (
                <>
                  <video
                    className='register-video'
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload='auto'
                    key='register-video'
                    onLoad={handleLoaded}
                  >
                    <source src='/videos/register-video.mp4' type='video/mp4' />
                  </video>
                </>
              )}
            </div>
          </Col>
          <Col lg={6}>
            <div className='form-content'>
              <h2>CREATE AN ACCOUNT</h2>
              <form onSubmit={handleSubmitRegister}>
                <div className='form-group'>
                  <label htmlFor='username'>Username</label>
                  <input
                    type='text'
                    id='username'
                    value={usernameRegister}
                    onChange={(e) => setUsernameRegister(e.target.value)}
                    placeholder='Enter Your Username'
                    required
                  />
                </div>
                <div className='form-group'>
                  <label htmlFor='email'>Email</label>
                  <input
                    type='email'
                    id='email'
                    value={emailRegister}
                    onChange={(e) => setEmailRegister(e.target.value)}
                    placeholder='Enter Your Email'
                    required
                  />
                </div>
                <div className='form-group'>
                  <label htmlFor='password'>Password</label>
                  <input
                    type='password'
                    id='password'
                    value={passwordRegister}
                    onChange={handlePasswordRegister}
                    placeholder='Enter Your Password'
                    required
                  />
                </div>
                <div className='form-group'>
                  <label htmlFor='password'>Confirm Password</label>
                  <input
                    type='password'
                    id='password'
                    value={confirmPassword}
                    onChange={handleConfirmPassword}
                    placeholder='Enter Your Password'
                    required
                  />
                  {!passwordMatch && <p style={{ color: 'red', fontSize: '14px' }}>Password Do Not Match</p>}
                </div>
                <Button label='Register' className='register-button' />
                <p className='footer-text'>
                  Already have an account? &nbsp;
                  <Link to='/login' style={{ cursor: 'pointer' }}>
                    Login
                  </Link>
                </p>
              </form>
            </div>
          </Col>
        </Row>
      </div>
    </Container>
  )
}

export default Register
