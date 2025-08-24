import { MdDeleteOutline } from 'react-icons/md';

import { deleteChat } from '../redux/chats/operations';
import { useAppDispatch } from '../redux/hooks';
import { useNavigate } from 'react-router';

const DeleteChatButton = ({ chatId }: { chatId: number }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleDeleteChat = async () => {
    await dispatch(deleteChat(chatId)).unwrap();
    navigate('/chats', { replace: true });
  };

  return (
    <button
      onClick={handleDeleteChat}
      className='h-full w-11 py-4 pr-3 pl-1'
      type='button'
      title='Delete chat'>
      <MdDeleteOutline className='w-full h-full' />
    </button>
  );
};

export default DeleteChatButton;
