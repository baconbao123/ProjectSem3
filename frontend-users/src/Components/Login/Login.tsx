import { Container } from 'react-bootstrap'
import './Login.scss'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { $axios } from '../../axios'
import Swal from 'sweetalert2'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../../Store/authSlice'
import { setLoaded, setLoading } from '../../Store/loadingSlice'
import { RootState } from '../../Store/store'
import Loading from '../Loading/Loading'

interface LoginData {
  Email: string
  Password: string
  Remember: boolean
}

const Login = () => {
  const [formRegister, setFormRegister] = useState<boolean>(false)
  const [Email, setEmail] = useState<string>('')
  const [Password, setPassword] = useState<string>('')
  const [Remember, setRemember] = useState<boolean>(true)
  const isLoading = useSelector((state: RootState) => state.loading.isLoading)

  const navigate = useNavigate()
  const dispatch = useDispatch()

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

  // Handle Submit Login
  const handleSubmitLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    const loginData: LoginData = { Email, Password, Remember }
    try {
      const res = await $axios.post('Auth/Login', loginData)

      if (res.data.token) {
        Cookies.set('token', res.data.token, { expires: 0.1 })
      }
      if (res.data.refreshToken) {
        Cookies.set('refreshToken', res.data.refreshToken, { expires: 7 })
      }

      // Decode JWT payload
      const payload = JSON.parse(atob(res.data.token.split('.')[1]))
      const userId = payload.Myapp_User_Id
      const email = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']
      const name = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']

      // Update Redux store if userId is present
      if (userId) {
        dispatch(setUser({ userId, email, name }))
      }

      navigate('/home')
    } catch {
      await Swal.fire({
        title: 'Login Failed!',
        text: 'Invalid user credentials',
        icon: 'error',
        denyButtonText: 'OK'
      })
    }
  }

  return (
    <Container>
      <div className='container-login'>
        <div className='image-container'>
          {isLoading ? (
            <Loading />
          ) : (
            <video
              className='login-video'
              autoPlay
              muted
              loop
              playsInline
              preload='auto'
              key='login-video'
              onLoad={handleLoaded}
            >
              <source src='/videos/logo-video.mp4' type='video/MP4' />
            </video>
          )}
        </div>
        {/* Form Container */}
        <div className='form-container'>
          <div className='form-content'>
            <h2>LOGIN</h2>
            <form onSubmit={handleSubmitLogin}>
              <div className='input-group'>
                <label htmlFor='email'>Email</label>
                <input
                  type='email'
                  id='email'
                  placeholder='Enter your email'
                  value={Email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='input-enter'
                  required
                />
              </div>
              <div className='input-group'>
                <label htmlFor='password'>Password</label>
                <input
                  type='password'
                  id='password'
                  placeholder='Enter your password'
                  value={Password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='input-enter'
                  required
                />
              </div>
              <div className='remember-container'>
                <input
                  type='checkbox'
                  id='rememberMe'
                  className='remember-me'
                  checked={Remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />{' '}
                &nbsp;
                <label htmlFor='rememberMe'>Remember Me</label>
              </div>
              <button type='submit'>Login</button>
            </form>
            <p className='footer-text'>
              Don't have an account? &nbsp;
              <Link to='/register' onClick={() => setFormRegister(!formRegister)} style={{ cursor: 'pointer' }}>
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default Login
