// src/store/slices/counterSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const appSlice = createSlice({
    name: 'app',
    initialState: {
        loading: true,
        toast: {status: 'info', message: 'This is toast', data: ''},
        showToast: false,
    },
    reducers: {
       setLoading: (state, action) => {
           state.loading = action.payload;
       },
        setToast: (state, action) => {
           state.toast = action.payload;
           state.showToast = true
        },
        closeToast: (state) => {
           state.showToast = false
        }
    },
});

export const {setLoading, setToast,closeToast } = appSlice.actions;

export default appSlice.reducer;
