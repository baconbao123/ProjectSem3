import React from 'react'
import { Link } from 'react-router-dom'
import './RequiredLogin.scss'

const RequiredLogin: React.FC = () => {
  return (
    <div className='center-message'>
      <div className='message-container'>
        <p>Please log in or register for an account to access and use this feature</p>
        <div className='link-container'>
          <Link to='/login' className='button'>
            Login
          </Link>
          <Link to='/register' className='button'>
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}

export default RequiredLogin
