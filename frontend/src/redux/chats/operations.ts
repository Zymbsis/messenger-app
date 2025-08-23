import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../axios-instance';
import { AxiosError } from 'axios';
import type { Chat } from './slice';

export const getAllChats = createAsyncThunk<
  Chat[],
  undefined,
  { rejectValue: string }
>('chats/getAllChats', async (body, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance('/chats', body);
    return data;
  } catch (error) {
    if (error instanceof AxiosError)
      return rejectWithValue(error.response?.data?.message || error.message);
    return rejectWithValue('Unknown error occurred');
  }
});

export const createNewChat = createAsyncThunk<
  Chat,
  number,
  { rejectValue: string }
>('chats/createNewChat', async (user2_id, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post('/chats', { user2_id });
    return data;
  } catch (error) {
    if (error instanceof AxiosError)
      return rejectWithValue(error.response?.data?.message || error.message);
    return rejectWithValue('Unknown error occurred');
  }
});

export const deleteChat = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>('chats/deleteChat', async (chatId, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/chats/${chatId}`);
    return chatId;
  } catch (error) {
    if (error instanceof AxiosError)
      return rejectWithValue(error.response?.data?.message || error.message);
    return rejectWithValue('Unknown error occurred');
  }
});
