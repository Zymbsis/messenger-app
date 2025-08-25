import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { store } from '../redux/store';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type BaseQuery = {
  url: string;
  method?: AxiosRequestConfig['method'];
  data?: AxiosRequestConfig['data'];
  params?: AxiosRequestConfig['params'];
};

export type SendMessagePayload = {
  chatId: number;
  content: string;
  attachments: AttachmentMetadata[];
};

export type EditMessagePayload = {
  id: number;
  content: string;
};

export type ApiResult = AxiosResponse['data'];

export type ApiError = {
  status: number | undefined;
  data: { detail?: string } | string;
};

export type AuthBody = {
  email: string;
  password: string;
};

export type AuthState = {
  isAuthenticated: boolean;
};

export type FormState = {
  errors: null | string[];
  enteredValues?: {
    email: FormDataEntryValue | null;
    password: FormDataEntryValue | null;
    confirmPassword: FormDataEntryValue | null;
  };
};

export type User = { id: number; email: string; created_at: string };

export type UsersState = { currentUser?: User; usersList: User[] };

export type Message = {
  id: number;
  chat_id: number;
  sender_id: number;
  content: string;
  message_type: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  attachments: AttachmentMetadata[];
};

export type EventData =
  | { type: 'new_message'; payload: Message }
  | { type: 'delete_chat'; payload: Pick<Chat, 'id'> }
  | { type: 'delete_message'; payload: Pick<Message, 'id' | 'chat_id'> }
  | { type: 'edit_message'; payload: Message }
  | { type: 'message_read'; payload: Pick<Message, 'id' | 'chat_id'> };

export type Chat = {
  id: number;
  user1_id: number;
  user2_id: number;
  created_at: string;
  updated_at: string;
};

export type ChatsState = { chats: Chat[] };

export type DialogData = {
  title: string;
  description?: string;
  onCancel?: () => void;
  onConfirm: () => void;
};

export type NavigateFn = (path: string | URL) => void;

export type AttachmentMetadata = {
  public_id: string;
  original_url: string;
  full_image_url: string;
  thumbnail_url: string;
  file_name: string;
  file_size: number;
  width: number;
  height: number;
  format: string;
  cloudinary_created_at: string;
};
