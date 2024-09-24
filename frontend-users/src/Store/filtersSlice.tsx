import { createSlice } from '@reduxjs/toolkit'

interface FilterState {
    name: string
}

const initialState: FilterState = {
    name: 'newest'
}

const filtersSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        setFilter: (state, action) => {
            state.name = action.payload
        }
    }
})

export const {setFilter} = filtersSlice.actions
export default filtersSlice.reducer