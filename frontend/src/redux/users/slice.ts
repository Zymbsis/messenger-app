import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { getAllUsers, getCurrentUser } from './operations';

export type UserType = { id: number; email: string; created_at: string };
type UsersState = { currentUser?: UserType; usersList: UserType[] };

const initialState: UsersState = { currentUser: undefined, usersList: [] };

const users = createSlice({
  name: 'users',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        getCurrentUser.fulfilled,
        (state, action: PayloadAction<UserType>) => {
          state.currentUser = action.payload;
        },
      )
      .addCase(
        getAllUsers.fulfilled,
        (state, action: PayloadAction<UserType[]>) => {
          state.usersList = action.payload;
        },
      );
  },
});

export const usersReducer = users.reducer;
