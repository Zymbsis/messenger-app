export type Message = {
  id: number;
  chat_id: number;
  sender_id: number;
  content: string;
  message_type: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
};

export type EventData =
  | { type: 'new_message'; payload: Message }
  | { type: 'delete_message'; payload: { id: number } }
  | { type: 'edit_message'; payload: Message };
