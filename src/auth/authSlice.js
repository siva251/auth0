import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  user: null,
  isLoading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action to set the user and authentication status
    setAuth: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
      state.isLoading = false;
    },
    // Action to reset the state on logout
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.isLoading = false;
    },
    // Action to handle loading state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    }
  },
});

export const { setAuth, logout, setLoading } = authSlice.actions;

export default authSlice.reducer;