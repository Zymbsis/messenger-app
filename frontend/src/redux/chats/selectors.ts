import type { RootState } from '../store';

export const selectChats = (state: RootState) => state.chats.chats;
