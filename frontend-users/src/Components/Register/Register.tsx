import React, { useState } from 'react'
import { $axios } from '../../axios'
import Swal from 'sweetalert2'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { Col, Container, Row } from 'react-bootstrap'
import './Register.scss'
import { Button } from 'primereact/button'

interface RegisterData {
  Username: string
  Email: string
  Password: string
}

const Register = () => {
  const [usernameRegister, setUsernameRegister] = useState<string>('')
  const [emailRegister, setEmailRegister] = useState<string>('')
  const [passwordRegister, setPasswordRegister] = useState<string>('')

  const navigate = useNavigate()

  // Handle form register
  const handleSubmitRegister = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    const registerData: RegisterData = { Username: usernameRegister, Email: emailRegister, Password: passwordRegister }
    console.log(registerData)

    try {
      const res = await $axios.post('User', registerData)
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
          <Col lg={6} className='d-flex justify-content-center align-items-center'>
            <video className='register-video' autoPlay muted loop playsInline preload='auto' key='register-video'>
              <source src='/public/videos/register-video.mp4' type='video/mp4' />
            </video>
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
                    onChange={(e) => setPasswordRegister(e.target.value)}
                    placeholder='Enter Your Password'
                    required
                  />
                </div>
                {/* <button className='register-button'>Register</button> */}
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
