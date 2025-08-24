import { NavLink } from 'react-router';
import { useAppSelector } from '../redux/hooks';
import { selectChats } from '../redux/chats/selectors';
import { selectCurrentUser, selectUsers } from '../redux/users/selectors';

import DeleteChatButton from './DeleteChatButton';

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
  return (
    <ul className='w-1/3 border-r h-full overflow-y-auto custom-scrollbar'>
      {chatsWithContacts.map((chat) => (
        <li
          className='h-16 border-b flex justify-between items-center pl-3 gap-2'
          key={chat.id}>
          <NavLink
            className='truncate h-full w-full flex items-center'
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
