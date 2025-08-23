import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import type { UserType } from './slice';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/users',
  withCredentials: true,
});

export const getCurrentUser = createAsyncThunk<
  UserType,
  undefined,
  { rejectValue: string }
>('users/getCurrentUser', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance('/current-user');
    return data;
  } catch (error) {
    if (error instanceof AxiosError)
      return rejectWithValue(error.response?.data?.message || error.message);
    return rejectWithValue('Unknown error occurred');
  }
});

export const getAllUsers = createAsyncThunk<
  UserType[],
  undefined,
  { rejectValue: string }
>('users/getAllUsers', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance('/all-users');
    return data;
  } catch (error) {
    if (error instanceof AxiosError)
      return rejectWithValue(error.response?.data?.message || error.message);
    return rejectWithValue('Unknown error occurred');
  }
});
