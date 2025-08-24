import type { RootState } from '../../types/types';

export const selectChats = (state: RootState) => state.chats.chats;
