import { createApi } from '@reduxjs/toolkit/query/react';

import { axiosBaseQuery } from './axiosBaseQuery';
import { WebSocketService } from '../../services/websocketService';

import type { Message } from '../../types';

export type EventData =
  | {
      type: 'new_message';
      payload: Message;
    }
  | {
      type: 'delete_message';
      payload: { id: number };
    }
  | {
      type: 'edit_message';
      payload: Message;
    };

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
        const url = `${WEBSOCKET_URL}/${chatId}`;
        const socket = new WebSocketService(url, updateCachedData);

        try {
          await cacheDataLoaded;
        } catch (error) {
          console.error(error);
        }
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
