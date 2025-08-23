import type { ChangeEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { useNavigate } from 'react-router';
import { createNewChat } from '../redux/chats/operations';
import { selectUsers } from '../redux/users/selectors';
import { IoMdPersonAdd } from 'react-icons/io';

const ChatSelect = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const users = useAppSelector(selectUsers);

  const handleSelectUser = async ({
    target: { value },
  }: ChangeEvent<HTMLSelectElement>) => {
    const chat = await dispatch(createNewChat(Number(value))).unwrap();
    navigate(`/chats/${chat.id}`);
  };
  
  return (
    <label
      className='w-14 relative inline-flex h-full'
      title='Start new chat'
      id='users'>
      <select
        onChange={handleSelectUser}
        className='h-full w-14 cursor-pointer opacity-0'
        name='users'
        id='users'>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.email}
          </option>
        ))}
      </select>
      <IoMdPersonAdd className='w-full h-full absolute top-0 right-0 pointer-events-none' />
    </label>
  );
};

export default ChatSelect;
