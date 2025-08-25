import { createApi } from '@reduxjs/toolkit/query/react';

import { axiosBaseQuery } from './axiosBaseQuery';

import type {
  Message,
  EditMessagePayload,
  SendMessagePayload,
} from '../../types/types';

const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getMessages: builder.query<Message[], number>({
      query: (chatId) => ({ url: `/messages/${chatId}` }),
      transformResponse: (response: Message[]) => response.toReversed(),
    }),
    sendMessage: builder.mutation<Message, SendMessagePayload>({
      query: ({ chatId, ...data }) => ({
        url: `/messages/${chatId}`,
        method: 'post',
        data,
      }),
    }),
    editMessage: builder.mutation<Message, EditMessagePayload>({
      query: ({ id, content, attachments = null }) => ({
        url: `/messages/${id}`,
        method: 'patch',
        data: { content, attachments },
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
