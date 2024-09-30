import { configureStore } from '@reduxjs/toolkit'
import authSlice from './authSlice'
import cartSlice from './cartSlice'
import voucherSlice from './voucherSlice'

const store = configureStore({
  reducer: {
    auth: authSlice,
    cart: cartSlice,
    voucher: voucherSlice
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
