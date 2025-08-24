import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './axiosBaseQuery';
import type { Message } from '../messages/slice';

type EventData =
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
        const socket = new WebSocket(`${WEBSOCKET_URL}/${chatId}`);
        try {
          await cacheDataLoaded;
          socket.onmessage = (event) => {
            const eventData: EventData = JSON.parse(event.data);

            if (eventData.type === 'new_message') {
              const message = eventData.payload;
              updateCachedData((draft) => {
                return [message, ...draft];
              });
            }
            if (eventData.type === 'edit_message') {
              const message = eventData.payload;
              updateCachedData((draft) => {
                const existing = draft.findIndex(
                  (msg) => msg.id === message.id,
                );
                if (existing !== -1) draft[existing] = message;
              });
            }
            if (eventData.type === 'delete_message') {
              const { id } = eventData.payload;
              updateCachedData((draft) =>
                draft.filter((message) => message.id !== id),
              );
            }
          };
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
