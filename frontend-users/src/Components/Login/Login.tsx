import { Container } from 'react-bootstrap'
import './Login.scss'
import { useState } from 'react'

const Login = () => {
  const [formRegister, setFormRegister] = useState(false)

  return (
    <div style={{ paddingTop: '100px' }}>
      <Container className='container-login'>
        <div className='image-container'>
          {/* Login Video */}
          {!formRegister && (
            <video className='login-video' autoPlay muted loop playsInline>
              <source src='videos/logo-video.mp4' type='video/MP4' />
            </video>
          )}
          {/* Register Video */}
          {formRegister && (
            <div className='video-wrapper'>
              <video className='register-video' autoPlay muted loop playsInline>
                <source src='videos/register-video.mp4' type='video/MP4' />
              </video>
            </div>
          )}
        </div>
        {/* Form Container */}
        <div className='form-container'>
          {/* Login Form */}
          {!formRegister && (
            <div className='form-content'>
              <h2 className='login-title'>Login</h2>
              <form>
                <div className='input-group'>
                  <label htmlFor='email'>Email</label>
                  <input type='email' id='email' placeholder='Enter your email' required />
                </div>
                <div className='input-group'>
                  <label htmlFor='password'>Password</label>
                  <input type='password' id='password' placeholder='Enter your password' required />
                </div>
                <button type='submit'>Login</button>
              </form>
              <p className='footer-text'>
                Don't have an account? &nbsp;
                <a href='javascript:void(0)' onClick={() => setFormRegister(!formRegister)}>
                  Register
                </a>
              </p>
            </div>
          )}

          {/* Register Form */}
          {formRegister && (
            <div className='form-content'>
              <h2 className='login-title'>Register</h2>
              <form>
                <div className='input-group'>
                  <label htmlFor='email'>Email</label>
                  <input type='email' id='email' placeholder='Enter your email' required />
                </div>
                <div className='input-group'>
                  <label htmlFor='password'>Password</label>
                  <input type='password' id='password' placeholder='Enter your password' required />
                </div>
                <button type='submit'>Register</button>
              </form>
              <p className='footer-text'>
                Already have an account? &nbsp;
                <a href='javascript:void(0)' onClick={() => setFormRegister(!formRegister)}>
                  Login
                </a>
              </p>
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}

export default Login
