import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import type { User } from './slice';
import { axiosInstance } from '../axios-instance';

export const getCurrentUser = createAsyncThunk<
  User,
  undefined,
  { rejectValue: string }
>('users/getCurrentUser', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance('users/current-user');
    return data;
  } catch (error) {
    if (error instanceof AxiosError)
      return rejectWithValue(error.response?.data?.message || error.message);
    return rejectWithValue('Unknown error occurred');
  }
});

export const getAllUsers = createAsyncThunk<
  User[],
  undefined,
  { rejectValue: string }
>('users/getAllUsers', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance('users/all-users');
    return data;
  } catch (error) {
    if (error instanceof AxiosError)
      return rejectWithValue(error.response?.data?.message || error.message);
    return rejectWithValue('Unknown error occurred');
  }
});
