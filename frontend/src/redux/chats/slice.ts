import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import {
  createNewChat,
  deleteChatById,
  getAllChats,
  getChatById,
} from './operations';

import type { ChatsState, Chat } from '../../types/types';

const initialState: ChatsState = { chats: [] };

const chats = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    deleteChat: (state, action: PayloadAction<number>) => {
      state.chats = state.chats.filter((chat) => chat.id !== action.payload);
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(getChatById.fulfilled, (state, action: PayloadAction<Chat>) => {
        state.chats = state.chats.filter(
          (chat) => chat.id !== action.payload.id,
        );
        state.chats.unshift(action.payload);
      })
      .addCase(
        getAllChats.fulfilled,
        (state, action: PayloadAction<Chat[]>) => {
          state.chats = action.payload;
        },
      )
      .addCase(
        createNewChat.fulfilled,
        (state, action: PayloadAction<Chat>) => {
          const existingChat = state.chats.some(
            (chat) => chat.id === action.payload.id,
          );
          if (existingChat) return;
          state.chats.unshift(action.payload);
        },
      )
      .addCase(
        deleteChatById.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.chats = state.chats.filter(
            (chat) => chat.id !== action.payload,
          );
        },
      ),
});

export const chatsReducer = chats.reducer;
export const { deleteChat } = chats.actions;
