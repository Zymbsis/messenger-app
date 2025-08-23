import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './axiosBaseQuery';
import type { Message } from '../messages/slice';

const WEBSOCKET_URL = 'ws://localhost:8000/ws';

const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getMessages: builder.query<Message[], number>({
      query: (chatId) => ({ url: `/messages/${chatId}` }),
      transformResponse: (response: Message[]) => response.toReversed(),
      onCacheEntryAdded: async (
        chatId,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) => {
        const socket = new WebSocket(`${WEBSOCKET_URL}/${chatId}`);
        try {
          await cacheDataLoaded;
          socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            updateCachedData((draft) => {
              return [message, ...draft];
            });
          };
        } catch (error) {
          console.error(error);
        }
        await cacheEntryRemoved;
        socket.close();
      },
    }),
  }),
});

export const apiSliceReducerPath = apiSlice.reducerPath;
export const apiSliceReducer = apiSlice.reducer;
export const apiSliceMiddleware = apiSlice.middleware;
export const { useGetMessagesQuery } = apiSlice;
