import { configureStore } from '@reduxjs/toolkit'
import authSlice from './authSlice'
import filtersSlice from './filtersSlice'

const store = configureStore({
  reducer: {
    auth: authSlice,
    filter: filtersSlice
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
