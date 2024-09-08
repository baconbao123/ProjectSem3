// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import {counterSlice} from "@src/Store/Slinces/counterSlice.ts";
import appSlice from "@src/Store/Slinces/appSlice.ts";
const store = configureStore({
    reducer: {
        counter: counterSlice.reducer,
        app: appSlice,
    },
});

export default store;
