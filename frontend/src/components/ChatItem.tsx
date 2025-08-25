import clsx from 'clsx';
import { NavLink, useLocation } from 'react-router';
import DeleteChatButton from './DeleteChatButton';

import type { Chat } from '../types/types';
import { useGetMessagesQuery } from '../redux/api/apiSlice';

type Props = { chat: Chat & { contactEmail: string; contactId: number } };

const ChatItem = ({ chat }: Props) => {
  const { pathname } = useLocation();

  const { data: messages = [] } = useGetMessagesQuery(chat.id, {
    skip: !chat.id,
  });

  const isActive = pathname.includes(chat.id.toString());
  const unreadMessagesCount = messages.filter(
    (message) => message.sender_id === chat.contactId && !message.is_read,
  ).length;

  return (
    <>
      <NavLink
        className={({ isActive }) =>
          clsx(
            'truncate h-full w-full flex items-center justify-between hover:!transform-[scale(1)]',
            {
              isActive,
            },
          )
        }
        to={`/chats/${chat.id}`}>
        {chat.contactEmail}

        <span
          className={clsx(
            'text-sm rounded-full flex items-center justify-center opacity-0 transition-opacity duration-700',
            {
              'opacity-100': !!unreadMessagesCount,
              'text-black/90 size-6 bg-white ': isActive,
              'text-white size-6 bg-black/90': !isActive,
            },
          )}>
          {unreadMessagesCount}
        </span>
      </NavLink>
      <DeleteChatButton chatId={chat.id} />
    </>
  );
};
export default ChatItem;
