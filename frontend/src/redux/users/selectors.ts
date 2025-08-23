import type { RootState } from '../store';

export const selectCurrentUser = (state: RootState) => state.users.currentUser;
export const selectUsers = (state: RootState) => state.users.usersList;
