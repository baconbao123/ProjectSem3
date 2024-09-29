import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  userId: string | null
  email: string
  name: string
}

const initialState: AuthState = {
  userId: null,
  email: '',
  name: ''
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ userId: string; email: string; name: string }>) => {
      state.userId = action.payload.userId
      state.email = action.payload.email
      state.name = action.payload.name
    }
  }
})

export const { setUser } = authSlice.actions
export default authSlice.reducer
