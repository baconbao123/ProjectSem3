// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import appSlice from "@src/Store/Slinces/appSlice.ts";
const store = configureStore({
    reducer: {
        app: appSlice,
    },
});

export default store;
