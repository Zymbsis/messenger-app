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
    sendMessage: builder.mutation<Message, { content: string; chatId: number }>(
      {
        query: ({ content, chatId }) => ({
          url: `/messages/${chatId}`,
          method: 'post',
          data: { content },
        }),
      },
    ),
    editMessage: builder.mutation<Message, { content: string; msgId: number }>({
      query: ({ content, msgId }) => ({
        url: `/messages/${msgId}`,
        method: 'put',
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

// Export the apiSlice itself for updateQueryData access
export { apiSlice };
