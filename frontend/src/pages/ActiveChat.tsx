import { useParams } from 'react-router';
import { useAppSelector } from '../redux/hooks';
import { selectCurrentUser } from '../redux/users/selectors';
import { useGetMessagesQuery } from '../redux/api/apiSlice';
import SendMessageForm from '../components/SendMessageForm';
import clsx from 'clsx';
import ChatMessage from '../components/ChatMessage';

const ActiveChat = () => {
  const params = useParams();
  const chatId = Number(params.chatId);
  const currentUser = useAppSelector(selectCurrentUser);
  const currentUserId = currentUser?.id;

  const {
    data: messages = [],
    isLoading,
    isError,
  } = useGetMessagesQuery(chatId, {
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
          <ul className='flex gap-4 pr-4 h-full flex-col-reverse overflow-y-auto custom-scrollbar'>
            {messages.map((message) => {
              const isOwnMessage = currentUserId === message.sender_id;
              return (
                <li
                  className={clsx(
                    'w-2/3 border flex flex-col gap-3 p-2 rounded-lg bg-black/60 text-white',
                    {
                      'self-end': isOwnMessage,
                    },
                  )}
                  key={message.id}>
                  <ChatMessage message={message} isOwnMessage={isOwnMessage} />
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {chatId && <SendMessageForm chatId={chatId} />}
    </div>
  );
};

export default ActiveChat;
