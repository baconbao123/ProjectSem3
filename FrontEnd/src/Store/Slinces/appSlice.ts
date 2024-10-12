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
        showModal2: false,
        showModal3: false,
        modalComponent: '',
        skeleton: false,
        userName: '',
        userEmail: '',
        userPhone: '',
        userId: '',
        permission: [],
        isInit: false,
        theme: 'lara-light-blue',
        defaultColor: '#3b82f6'
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
        setShowModal2: (state, action) => {
            state.showModal2 = action.payload;
        },
        setShowModal3: (state, action) => {
            state.showModal3 = action.payload;
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
        },
        setTheme: (state, action) => {
            state.theme = action.payload;
        },
        setDefaultColor: (state, action) => {
            state.defaultColor = action.payload;
        },
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
        setIsInit,
        setShowModal2,
        setShowModal3,
        setTheme,
        setDefaultColor

    }
    = appSlice.actions;

export default appSlice.reducer;
