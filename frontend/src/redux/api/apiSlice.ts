import { createApi } from '@reduxjs/toolkit/query/react';

import { axiosBaseQuery } from './axiosBaseQuery';

import type { Message } from '../../types/types';

const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getMessages: builder.query<Message[], number>({
      query: (chatId) => ({ url: `/messages/${chatId}` }),
      transformResponse: (response: Message[]) => response.toReversed(),
    }),
    sendMessage: builder.mutation<Message, { chatId: number; content: string }>(
      {
        query: ({ chatId, content }) => ({
          url: `/messages/${chatId}`,
          method: 'post',
          data: { content },
        }),
      },
    ),
    editMessage: builder.mutation<Message, { id: number; content: string }>({
      query: ({ id, content }) => ({
        url: `/messages/${id}`,
        method: 'patch',
        data: { content },
      }),
    }),
    deleteMessage: builder.mutation<void, number>({
      query: (msgId) => ({
        url: `/messages/${msgId}`,
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

export { apiSlice };
