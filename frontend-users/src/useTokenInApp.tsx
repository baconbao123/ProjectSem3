import { useEffect } from 'react'
import Cookies from 'js-cookie'
import { useDispatch } from 'react-redux'
import { setUser } from './Store/authSlice'

const useTokenInApp = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      try {
        // Decode JWT payload
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        // Extract user details from payload
        const userId = payload.Myapp_User_Id;
        const email = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
        const name = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];

        // Update Redux store if userId is present
        if (userId) {
          dispatch(setUser({ userId, email, name }));
        }
      } catch {
        // Handle decoding errors silently
      }
    }
  }, [dispatch]);
}

export default useTokenInApp
