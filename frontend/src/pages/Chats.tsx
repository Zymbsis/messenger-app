import { Outlet } from 'react-router';
import { useAppDispatch } from '../redux/hooks';
import { useEffect } from 'react';
import { getAllChats } from '../redux/chats/operations';
import { getAllUsers, getCurrentUser } from '../redux/users/operations';
import ChatsHeader from '../components/ChatsHeader';
import ChatsList from '../components/ChatsList';

const Chats = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getCurrentUser());
    dispatch(getAllChats());
    dispatch(getAllUsers());
  }, [dispatch]);

  return (
    <>
      <ChatsHeader />
      <main className='flex h-[calc(100%-56px)]'>
        <ChatsList />
        <ul></ul>
        <Outlet />
      </main>
    </>
  );
};

export default Chats;
