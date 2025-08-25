import { useNavigate } from 'react-router';
import { IoMdPersonAdd } from 'react-icons/io';
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { createNewChat } from '../redux/chats/operations';
import { selectUsers } from '../redux/users/selectors';

const ContactsSelect = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const users = useAppSelector(selectUsers);

  const handleSelectUser = async (value: string) => {
    const chat = await dispatch(createNewChat(Number(value))).unwrap();
    navigate(`/chats/${chat.id}`);
  };

  return (
    <Listbox onChange={handleSelectUser}>
      <ListboxButton className='w-11 pl-3' title='Start new chat'>
        <IoMdPersonAdd />
      </ListboxButton>
      <ListboxOptions
        anchor='bottom end'
        className='py-2 rounded-lg min-w-36 bg-white focus-visible:outline-0 custom-shadow'>
        <ListboxOption
          hidden={Boolean(users.length)}
          disabled
          value=''
          className='data-focus:cursor-default px-3 py-1 max-w-80'>
          It looks like you're the first one here!
          <br /> New contacts will appear here as soon as other users join.
        </ListboxOption>
        {users.map((user) => (
          <ListboxOption
            key={user.id}
            value={user.id}
            className='data-focus:bg-black/15 data-focus:cursor-pointer px-3 py-1'>
            {user.email}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
};

export default ContactsSelect;
