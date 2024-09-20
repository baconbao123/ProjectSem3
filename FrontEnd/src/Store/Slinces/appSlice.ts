// src/store/slices/counterSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const appSlice = createSlice({
    name: 'app',
    initialState: {
        loading: false,
        toast: {status: 'info', message: 'This is toast', data: ''},
        showToast: false,
        showMenu: false,
        showModal: false,
        modalComponent: ''
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
        },
        setShowMenu: (state, action) => {
           state.showMenu = action.payload;
        },
        setShowModal: (state, action) => {
           state.showModal = action.payload;
        },
        setModalComponent: (state, action) => {
           state.modalComponent = action.payload;
        }
    },
});

export const
    {
        setLoading,
        setToast,
        closeToast,
        setShowMenu ,
        setShowModal,
        setModalComponent
    }
    = appSlice.actions;

export default appSlice.reducer;
