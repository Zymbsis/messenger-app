import { createApi } from '@reduxjs/toolkit/query/react';

import { axiosBaseQuery } from './axiosBaseQuery';
import { WebSocketService } from '../../services/websocketService';

import type { Message } from '../../types/types';

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
        const socket = new WebSocketService(
          `${WEBSOCKET_URL}/${chatId}`,
          updateCachedData,
        );

        await cacheDataLoaded;
        await cacheEntryRemoved;

        socket.close();
      },
    }),
    sendMessage: builder.mutation<Message, { content: string; chatId: number }>(
      {
        query: ({ content, chatId }) => ({
          url: `/messages/${chatId}`,
          method: 'post',
          data: { content },
        }),
      },
    ),
    editMessage: builder.mutation<Message, { content: string; chatId: number }>(
      {
        query: ({ content, chatId }) => ({
          url: `/messages/${chatId}`,
          method: 'put',
          data: { content },
        }),
      },
    ),
    deleteMessage: builder.mutation<void, number>({
      query: (chatId) => ({
        url: `/messages/${chatId}`,
        method: 'delete',
      }),
    }),
  }),
});

export const apiSliceReducerPath = apiSlice.reducerPath;
export const apiSliceReducer = apiSlice.reducer;
export const apiSliceMiddleware = apiSlice.middleware;
export const {
  useGetMessagesQuery,
  useSendMessageMutation,
  useDeleteMessageMutation,
  useEditMessageMutation,
} = apiSlice;
