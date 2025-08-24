import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

import { authPersistConfig, authReducer } from './auth/slice';
import { usersReducer } from './users/slice';
import { chatsReducer } from './chats/slice';
import {
  apiSliceMiddleware,
  apiSliceReducer,
  apiSliceReducerPath,
} from './api/apiSlice';

const rootReducer = {
  auth: persistReducer(authPersistConfig, authReducer),
  users: usersReducer,
  chats: chatsReducer,
  [apiSliceReducerPath]: apiSliceReducer,
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSliceMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
