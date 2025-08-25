import { useAppSelector } from '../redux/hooks';
import { selectChats } from '../redux/chats/selectors';
import { selectCurrentUser, selectUsers } from '../redux/users/selectors';
import ChatItem from './ChatItem';

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
    <ul className='w-1/3 border-r border-black/10 h-full overflow-y-auto custom-scrollbar'>
      {chatsWithContacts.map((chat) => (
        <li
          className='has-[.isActive]:bg-black/90 has-[.isActive]:text-white h-16 flex justify-between items-center pl-3 border-b border-black/10 group/chat'
          key={chat.id}>
          <ChatItem chat={chat} />
        </li>
      ))}
    </ul>
  );
};

export default ChatsList;
