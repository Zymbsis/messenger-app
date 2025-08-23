import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Message } from './slice';
import { axiosInstance } from '../axios-instance';
import { AxiosError } from 'axios';

export const getAllMessages = createAsyncThunk<
  Message[],
  number,
  { rejectValue: string }
>('messages/getAllMessages', async (chatId, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance(`/messages/${chatId}`);
    return data;
  } catch (error) {
    if (error instanceof AxiosError)
      return rejectWithValue(error.response?.data?.message || error.message);
    return rejectWithValue('Unknown error occurred');
  }
});
