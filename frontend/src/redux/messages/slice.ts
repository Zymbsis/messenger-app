import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { getAllMessages } from './operations';

export type Message = {
  id: number;
  chat_id: number;
  sender_id: number;
  content: string;
  message_type: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
};
type MessagesState = { messages: Message[] };

const initialState: MessagesState = { messages: [] };

const messages = createSlice({
  name: 'messages',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getAllMessages.fulfilled,
      (state, action: PayloadAction<Message[]>) => {
        state.messages = action.payload.reverse();
      },
    );
  },
});

export const messagesReducer = messages.reducer;
