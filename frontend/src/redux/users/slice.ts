import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { getAllUsers, getCurrentUser } from './operations';

import type { UsersState, User } from '../../types/types';

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
          state.usersList = action.payload.map((user) => ({
            ...user,
            email: user.email.split('@')[0],
          }));
        },
      );
  },
});

export const usersReducer = users.reducer;
