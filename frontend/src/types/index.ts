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
