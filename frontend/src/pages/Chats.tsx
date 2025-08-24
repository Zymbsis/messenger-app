import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { useAppDispatch } from '../redux/hooks';
import { getAllChats } from '../redux/chats/operations';
import { getAllUsers, getCurrentUser } from '../redux/users/operations';
import { WebSocketService } from '../services/websocketService';
import ChatsHeader from '../components/ChatsHeader';
import ChatsList from '../components/ChatsList';
import ModalProvider from '../components/ModalProvider';

const Chats = () => {
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();

  useEffect(() => {
    (async () => {
      await Promise.all([
        dispatch(getCurrentUser()),
        dispatch(getAllChats()),
        dispatch(getAllUsers()),
      ]);
    })();

    WebSocketService.connect();

    return () => {
      WebSocketService.disconnect();
    };
  }, [dispatch]);

  return (
    <ModalProvider>
      <ChatsHeader />
      <main className='flex h-[calc(100%-56px)]'>
        <ChatsList />
        {pathname === '/chats' && (
          <div className='h-full bg-black/5 flex-1 justify-end bg-[url(../assets/logo.webp)] bg-contain bg-no-repeat bg-position-[center_bottom_60px]'></div>
        )}
        <Outlet />
      </main>
    </ModalProvider>
  );
};

export default Chats;
