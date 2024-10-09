import { configureStore } from '@reduxjs/toolkit'
import authSlice from './authSlice'
import cartSlice from './cartSlice'
import loadingSlice from './loadingSlice'

const store = configureStore({
  reducer: {
    auth: authSlice,
    cart: cartSlice,
    loading: loadingSlice
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
