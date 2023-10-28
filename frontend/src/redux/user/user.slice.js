import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error: null,
    loading: false,
    success: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
            state.success = true;
        },
        signInFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
            state.success = null;
        }
    }
})

export const { signInSuccess, signInStart, signInFailure } = userSlice.actions;

export default userSlice.reducer;