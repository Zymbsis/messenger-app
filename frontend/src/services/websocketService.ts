import { toast } from 'sonner';

import type { Message, EventData } from '../types';

type UpdateMessagesFn = (updateRecipe: (draft: Message[]) => void) => void;

export class WebSocketService extends WebSocket {
  constructor(url: string, updateMessagesFn: UpdateMessagesFn) {
    super(url);

    this.onmessage = (event) => {
      try {
        const { type, payload: message } = JSON.parse(event.data) as EventData;

        if (type === 'new_message') {
          updateMessagesFn((draft) => {
            draft.unshift(message);
          });
        }

        if (type === 'edit_message') {
          updateMessagesFn((draft) => {
            const existing = draft.findIndex((msg) => msg.id === message.id);
            if (existing !== -1) draft[existing] = message;
          });
        }

        if (type === 'delete_message') {
          updateMessagesFn((draft) =>
            draft.filter((msg) => msg.id !== message.id),
          );
        }
      } catch (error) {
        toast.error('WebSocket: Error receiving new message');
        console.error(error);
      }
    };

    this.onerror = (error) => {
      toast.error('WebSocket: Connection lost');
      console.error(error);
    };
  }
}
