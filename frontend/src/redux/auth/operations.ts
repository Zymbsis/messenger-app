import { AxiosError } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../axios-instance';

type AuthBody = {
  email: string;
  password: string;
};

export const register = createAsyncThunk<
  void,
  AuthBody,
  { rejectValue: string }
>('auth/register', async (body, { rejectWithValue, dispatch }) => {
  try {
    await axiosInstance.post('auth/register', body);
    await dispatch(login(body));
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
      await axiosInstance.post('auth/login', body);
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
    await axiosInstance.post('auth/refresh');
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
    await axiosInstance.post('auth/logout');
  } catch (error) {
    if (error instanceof AxiosError)
      return rejectWithValue(error.response?.data?.message || error.message);
    return rejectWithValue('Unknown error occurred');
  }
});
