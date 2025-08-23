import { useParams } from 'react-router';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { useEffect } from 'react';
import { getAllMessages } from '../redux/messages/operations';
import { selectMessages } from '../redux/messages/selectors';
import { selectCurrentUser } from '../redux/users/selectors';
import clsx from 'clsx';
import { IoIosSend } from 'react-icons/io';

const ActiveChat = () => {
  const { chatId } = useParams();
  const dispatch = useAppDispatch();
  const messages = useAppSelector(selectMessages);
  const currentUser = useAppSelector(selectCurrentUser);
  const currentUserId = currentUser?.id;

  useEffect(() => {
    dispatch(getAllMessages(Number(chatId)));
  }, [dispatch, chatId]);

  return (
    <div className='overflow-hidden flex-1 flex flex-col gap-4 pl-4 pb-4'>
      <div className='flex-1 overflow-hidden '>
        {!messages.length && (
          <p className='text-center h-full content-end italic text-black/60'>
            You don't have any messages yet.
          </p>
        )}
        {!!messages.length && (
          <ul className='flex gap-4 pr-4 h-full flex-col-reverse overflow-y-auto'>
            {messages.map((message) => (
              <li
                className={clsx(
                  'max-w-2/3 border flex justify-between gap-3 p-2 rounded-lg bg-black/60 text-white',
                  {
                    'self-end': currentUserId === message.sender_id,
                  },
                )}
                key={message.id}>
                <span>{message.content}</span>
                <span>
                  <span className='block'>
                    {message.created_at.split('T')[0]}
                  </span>
                  <span className='block'>
                    {message.created_at.split('T')[1]}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <form
        onSubmit={(e) => e.preventDefault()}
        className='h-1/6 border mr-4 rounded-lg relative'>
        <textarea className='w-full h-full p-2' name='message'></textarea>
        <button className='absolute bottom-0 right-0 size-12 p-2'>
          <IoIosSend className='w-full h-full' />
        </button>
      </form>
    </div>
  );
};

export default ActiveChat;
