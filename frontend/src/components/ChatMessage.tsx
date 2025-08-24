import { MdDeleteOutline, MdModeEditOutline } from 'react-icons/md';
import { useDeleteMessageMutation } from '../redux/api/apiSlice';
import type { Message } from '../redux/messages/slice';
import { formattedDateTimeEn } from '../helpers/formatting';
import { CiEdit } from 'react-icons/ci';

type Props = {
  message: Message;
  isOwnMessage: boolean;
};

const ChatMessage = ({ message, isOwnMessage }: Props) => {
  const createdAt = new Date(message.created_at);
  const updatedAt = new Date(message.created_at);
  const isMessageEdited = +createdAt !== +updatedAt;

  const [deleteMessage] = useDeleteMessageMutation();
  const handleDeleteMessage = () => deleteMessage(message.id);

  return (
    <>
      <span>{message.content}</span>
      <div className='flex flex-nowrap gap-4 items-center justify-end'>
        <span className='gap-2 italic text-sm inline-flex shrink-0 md:whitespace-nowrap'>
          {isMessageEdited && <CiEdit style={{ height: 20 }} title='Edited' />}{' '}
          {formattedDateTimeEn(updatedAt)}
        </span>

        {isOwnMessage && (
          <div className='flex h-full gap-1.5'>
            <button className='size-5' type='button' title='Edit message'>
              <MdModeEditOutline />
            </button>
            <button
              onClick={handleDeleteMessage}
              className='size-5'
              type='button'
              title='Delete message'>
              <MdDeleteOutline />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatMessage;
