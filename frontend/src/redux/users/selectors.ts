import type { RootState } from '../store';

export const selectCurrentUser = (state: RootState) => state.users.currentUser;
export const selectAllUsers = (state: RootState) => state.users.usersList;
