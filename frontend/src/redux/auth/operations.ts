import axios, { AxiosError } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/auth',
  withCredentials: true,
});

type AuthBody = {
  email: string;
  password: string;
};

export const register = createAsyncThunk<
  void,
  AuthBody,
  { rejectValue: string }
>('auth/register', async (body, { rejectWithValue }) => {
  try {
    await axiosInstance.post('/register', body);
  } catch (error) {
    if (error instanceof AxiosError)
      return rejectWithValue(error.response?.data?.message || error.message);
    return rejectWithValue('Unknown error occurred');
  }
});

export const login = createAsyncThunk<void, AuthBody, { rejectValue: string }>(
  'auth/login',
  async (body, { rejectWithValue }) => {
    try {
      await axiosInstance.post('/login', body);
    } catch (error) {
      if (error instanceof AxiosError)
        return rejectWithValue(error.response?.data?.message || error.message);
      return rejectWithValue('Unknown error occurred');
    }
  },
);

export const refresh = createAsyncThunk<
  void,
  undefined,
  { rejectValue: string }
>('auth/refresh', async (_, { rejectWithValue }) => {
  try {
    await axiosInstance.post('/refresh');
  } catch (error) {
    if (error instanceof AxiosError)
      return rejectWithValue(error.response?.data?.message || error.message);
    return rejectWithValue('Unknown error occurred');
  }
});

export const logout = createAsyncThunk<
  void,
  undefined,
  { rejectValue: string }
>('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await axiosInstance.post('/logout');
  } catch (error) {
    if (error instanceof AxiosError)
      return rejectWithValue(error.response?.data?.message || error.message);
    return rejectWithValue('Unknown error occurred');
  }
});
