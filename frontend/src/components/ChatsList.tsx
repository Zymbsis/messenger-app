import { NavLink } from 'react-router';
import { useAppSelector } from '../redux/hooks';
import { selectChats } from '../redux/chats/selectors';
import { selectCurrentUser, selectUsers } from '../redux/users/selectors';

import DeleteChatButton from './DeleteChatButton';
import clsx from 'clsx';

const ChatsList = () => {
  const chats = useAppSelector(selectChats);
  const users = useAppSelector(selectUsers);
  const currentUser = useAppSelector(selectCurrentUser);
  const currentUserId = currentUser?.id;

  const usersById = Object.fromEntries(users.map((u) => [u.id, u.email]));
  const chatsWithContacts = chats.map((chat) => {
    const contactId =
      chat.user1_id === currentUserId ? chat.user2_id : chat.user1_id;

    return {
      ...chat,
      contactId,
      contactEmail: usersById[contactId],
    };
  });

  if (!chatsWithContacts.length)
    return (
      <p className='w-1/3 border-r p-4 text-center italic text-black/60 pt-8'>
        Your chats will be displayed here.
      </p>
    );

  return (
    <ul className='w-1/3 border-r h-full overflow-y-auto custom-scrollbar p-2'>
      {chatsWithContacts.map((chat) => (
        <li
          className='has-[.isActive]:bg-black/20 h-16 border-b-2 bg-black/5 flex justify-between items-center pl-3 gap-2 mb-2 rounded-lg'
          key={chat.id}>
          <NavLink
            className={({ isActive }) =>
              clsx('truncate h-full w-full flex items-center', {
                isActive,
              })
            }
            to={`/chats/${chat.id}`}>
            {chat.contactEmail}
          </NavLink>{' '}
          <DeleteChatButton chatId={chat.id} />
        </li>
      ))}
    </ul>
  );
};

export default ChatsList;
