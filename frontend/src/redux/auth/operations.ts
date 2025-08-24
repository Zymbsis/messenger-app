import { AxiosError } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'sonner';

import { axiosInstance } from '../axios-instance';

import type { AuthBody } from '../../types/types';

const toastMessages = {
  register: {
    loading: 'Registering...',
    success: 'Registered successfully',
    error: (e: AxiosError<{ detail: string }>) =>
      e.response?.data?.detail ||
      'Error occurred while registering, please try again.',
  },
  login: {
    loading: 'Logging in...',
    success: 'Logged in successfully',
    error: (e: AxiosError<{ detail: string }>) =>
      e.response?.data?.detail ||
      'Error occurred while logging in, please check your credentials.',
  },
  refresh: {
    loading: 'Refreshing...',
    success: 'Refreshed successfully',
    error: (e: AxiosError<{ detail: string }>) =>
      e.response?.data?.detail ||
      'Error occurred while refreshing session, please login again.',
  },
  logout: {
    loading: 'Logging out...',
    success: 'Logged out successfully',
    error: (e: AxiosError<{ detail: string }>) =>
      e.response?.data?.detail || 'Error occurred while logging out.',
  },
};

export const register = createAsyncThunk<
  void,
  AuthBody,
  { rejectValue: string }
>('auth/register', async (body, { rejectWithValue, dispatch }) => {
  const promise = axiosInstance.post('auth/register', body);
  try {
    toast.promise(promise, toastMessages.register);

    await promise;
    await dispatch(login(body));
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data?.detail || error.message);
    }

    toast.error('Unknown error occurred');
    return rejectWithValue('Unknown error occurred');
  }
});

export const login = createAsyncThunk<void, AuthBody, { rejectValue: string }>(
  'auth/login',
  async (body, { rejectWithValue }) => {
    const promise = axiosInstance.post('auth/login', body);
    try {
      toast.promise(promise, toastMessages.login);

      await promise;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.detail || error.message);
      }

      toast.error('Unknown error occurred');
      return rejectWithValue('Unknown error occurred');
    }
  },
);

export const refresh = createAsyncThunk<
  void,
  undefined,
  { rejectValue: string }
>('auth/refresh', async (_, { rejectWithValue }) => {
  const promise = axiosInstance.post('auth/refresh');
  try {
    toast.promise(promise, toastMessages.refresh);

    await promise;
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
  const promise = axiosInstance.post('auth/logout');
  try {
    toast.promise(promise, toastMessages.logout);

    await promise;
  } catch (error) {
    if (error instanceof AxiosError)
      return rejectWithValue(error.response?.data?.message || error.message);
    return rejectWithValue('Unknown error occurred');
  }
});
