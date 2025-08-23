import { createSlice } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { login, logout } from './operations';

type AuthState = {
  isAuthenticated: boolean;
};

const initialState: AuthState = { isAuthenticated: false };

const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state) => {
        state.isAuthenticated = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
      });
  },
});

export const authReducer = auth.reducer;

export const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['isAuthenticated'],
};
