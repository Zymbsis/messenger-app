import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { getAllUsers, getCurrentUser } from './operations';

export type User = { id: number; email: string; created_at: string };
type UsersState = { currentUser?: User; usersList: User[] };

const initialState: UsersState = { currentUser: undefined, usersList: [] };

const users = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        getCurrentUser.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.currentUser = action.payload;
        },
      )
      .addCase(
        getAllUsers.fulfilled,
        (state, action: PayloadAction<User[]>) => {
          state.usersList = action.payload;
        },
      );
  },
});

export const usersReducer = users.reducer;
