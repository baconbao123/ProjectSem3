// src/store/slices/counterSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const appSlice = createSlice({
    name: 'app',
    initialState: {
        loading: true,
        toast: {status: 'info', message: 'This is toast', data: ''},
        showToast: false,
        showMenu: false,
        showModal: false,
        modalComponent: '',
        skeleton: false,
        userName: '',
        userEmail: '',
        userPhone: '',
        userId: '',
        permission: [],
        isInit: false
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
        },
        setUserName: (state, action) => {
            state.userName = action.payload;
        },
        setUserEmail: (state, action) => {
            state.userEmail = action.payload;
        },
        setUserId: (state, action) => {
            state.userId = action.payload;
        },
        setUserPhone: (state, action) => {
            state.userPhone = action.payload;
        },
        setPermission: (state, action) => {
            state.permission = action.payload;
        },
        setIsInit: (state, action) => {
            state.isInit = action.payload;
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
        setModalComponent,
        setUserName,
        setUserEmail,
        setUserId,
        setUserPhone,
        setPermission,
        setIsInit
    }
    = appSlice.actions;

export default appSlice.reducer;
