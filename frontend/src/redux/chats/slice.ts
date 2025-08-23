import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { createNewChat, deleteChat, getAllChats } from './operations';

export type Chat = {
  id: number;
  user1_id: number;
  user2_id: number;
  created_at: string;
  updated_ta: string;
};
type ChatsState = { chats: Chat[] };

const initialState: ChatsState = { chats: [] };

const chats = createSlice({
  name: 'chats',
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
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
          state.chats.push(action.payload);
        },
      )
      .addCase(deleteChat.fulfilled, (state, action: PayloadAction<number>) => {
        state.chats = state.chats.filter((chat) => chat.id !== action.payload);
      }),
});

export const chatsReducer = chats.reducer;
