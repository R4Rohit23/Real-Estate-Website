import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
  success: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.success = null;
    },
    updateUserStart: (state) => {
      state.loading = true;
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
      state.success = true;
    },
    updateUserError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.success = false;
    },
  },
});

export const { signInSuccess, signInStart, signInFailure, updateUserError, updateUserStart, updateUserSuccess } = userSlice.actions;

export default userSlice.reducer;
