import type { RootState } from '../../types/types';

export const selectCurrentUser = (state: RootState) => state.users.currentUser;
export const selectUsers = (state: RootState) => state.users.usersList;
