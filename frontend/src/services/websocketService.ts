import { toast } from 'sonner';

import { store } from '../redux/store';
import { apiSlice } from '../redux/api/apiSlice';
import { deleteChat } from '../redux/chats/slice';
import { getChatById } from '../redux/chats/operations';
import { refresh } from '../redux/auth/operations';

import type { EventData, NavigateFn } from '../types/types';

const WEBSOCKET_URL = 'ws://localhost:8000/ws';

export class WebSocketService {
  private static ws: WebSocket | null = null;

  private static dispatch = store.dispatch;
  private static updateQueryData = apiSlice.util.updateQueryData;
  private static navigateFn: NavigateFn = window.location.replace;
  private static reconnectTimeout: NodeJS.Timeout | null = null;
  private static reconnectAttempts = 0;
  private static readonly maxReconnectAttempts = 3;
  private static readonly reconnectDelay = 1000;

  private constructor() {}

  static connect(): void {
    if (this.ws || this.isConnecting || this.isConnected) return;

    console.log('Connecting WebSocket...');
    try {
      this.ws = new WebSocket(WEBSOCKET_URL);
      this.setupListeners();
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.reconnect();
    }
  }

  static disconnect(): void {
    if (this.isConnected) {
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }

      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }

      this.reconnectAttempts = 0;
    }
  }

  static send(type: string, payload: EventData['payload']): void {
    if (!this.ws || !this.isConnected) return;

    this.ws.send(JSON.stringify({ type, payload }));
  }

  static setNavigateFn(navigateFn: NavigateFn): void {
    this.navigateFn = navigateFn;
  }

  static reconnect(): void {
    if (this.isConnected) return;

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      toast.error('WebSocket: Failed to reconnect after multiple attempts');
      return;
    }

    if (this.reconnectAttempts == 1) this.dispatch(refresh());

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectAttempts++;

      this.connect();
    }, this.reconnectDelay * this.reconnectAttempts);
  }

  static forceReconnect = (): void => {
    console.log('User is back, checking connection...');
    if (WebSocketService.isConnected) return;
    toast.info('Reconnecting to chat...');

    WebSocketService.reconnectAttempts = 0;

    if (WebSocketService.reconnectTimeout) {
      clearTimeout(WebSocketService.reconnectTimeout);
      WebSocketService.reconnectTimeout = null;
    }

    try {
      WebSocketService.connect();
      console.log('Force reconnect successful');
    } catch (error) {
      console.error('Force reconnect failed:', error);
      WebSocketService.reconnect();
    }
  };

  private static get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  private static get isConnecting(): boolean {
    return this.ws?.readyState === WebSocket.CONNECTING;
  }

  private static setupListeners(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      console.log('WebSocket connected');
    };

    this.ws.onmessage = (event) => {
      const { type, payload } = JSON.parse(event.data) as EventData;

      switch (type) {
        case 'new_message': {
          const { chat_id } = payload;

          const allChatsIds = store.getState().chats.chats.map(({ id }) => id);

          if (!allChatsIds.includes(chat_id)) {
            this.dispatch(getChatById(chat_id));
          } else {
            this.dispatch(
              this.updateQueryData('getMessages', chat_id, (draft) => {
                draft.unshift(payload);
              }),
            );
          }
          break;
        }

        case 'edit_message': {
          this.dispatch(
            this.updateQueryData('getMessages', payload.chat_id, (draft) => {
              const targetIndex = draft.findIndex((m) => m.id === payload.id);

              if (targetIndex !== -1) draft[targetIndex] = payload;
              return draft;
            }),
          );
          break;
        }

        case 'delete_message': {
          this.dispatch(
            this.updateQueryData('getMessages', payload.chat_id, (draft) => {
              const targetIndex = draft.findIndex((m) => m.id === payload.id);

              if (targetIndex !== -1) draft.splice(targetIndex, 1);
            }),
          );
          break;
        }

        case 'message_read': {
          this.dispatch(
            this.updateQueryData('getMessages', payload.chat_id, (draft) => {
              const targetIndex = draft.findIndex((m) => m.id === payload.id);

              if (targetIndex !== -1) draft[targetIndex].is_read = true;
            }),
          );

          break;
        }

        case 'delete_chat': {
          const deletedChatId = payload.id;

          this.dispatch(deleteChat(deletedChatId));

          const currentChatId = Number(
            window.location.pathname.split('/').pop(),
          );

          if (currentChatId === deletedChatId) this.navigateFn('/chats');

          break;
        }
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected, attempting to reconnect...');
      this.reconnect();
    };

    this.ws.onerror = () => {
      console.error('WebSocket error occurred');
      this.reconnect();
    };
  }
}
