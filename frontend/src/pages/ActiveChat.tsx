import { useParams } from 'react-router';
import { useAppSelector } from '../redux/hooks';
import { selectCurrentUser } from '../redux/users/selectors';
import { useGetMessagesQuery } from '../redux/api/apiSlice';
import SendMessageForm from '../components/SendMessageForm';
import clsx from 'clsx';

const ActiveChat = () => {
  const { chatId } = useParams();
  const currentUser = useAppSelector(selectCurrentUser);
  const currentUserId = currentUser?.id;

  const {
    data: messages = [],
    isLoading,
    isError,
  } = useGetMessagesQuery(chatId ?? '', {
    skip: !chatId,
  });

  if (isLoading)
    return <div className='flex-1 text-center p-4'>Loading...</div>;
  if (isError)
    return <div className='flex-1 text-center p-4 text-red-500'>Error...</div>;

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
      {chatId && <SendMessageForm chatId={chatId} />}
    </div>
  );
};

export default ActiveChat;
