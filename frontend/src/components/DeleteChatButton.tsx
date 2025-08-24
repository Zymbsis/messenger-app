import { useNavigate } from 'react-router';
import { MdDeleteOutline } from 'react-icons/md';
import { useAppDispatch } from '../redux/hooks';
import { deleteChat } from '../redux/chats/operations';
import { CONFIRM_MESSAGES } from '../helpers/confirmMessages';
import { useModalContext } from '../helpers/modalContext';

const DeleteChatButton = ({ chatId }: { chatId: number }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { handleSetDialogData } = useModalContext();

  const handleDeleteChat = async () => {
    await dispatch(deleteChat(chatId)).unwrap();
    navigate('/chats', { replace: true });
  };

  const handleDeleteBtnClick = () =>
    handleSetDialogData({
      title: CONFIRM_MESSAGES.deleteChat.title,
      description: CONFIRM_MESSAGES.deleteChat.description,
      onConfirm: handleDeleteChat,
    });

  return (
    <button
      onClick={handleDeleteBtnClick}
      className='h-full w-11 py-4 pr-3 pl-1'
      type='button'
      title='Delete chat'>
      <MdDeleteOutline className='w-full h-full' />
    </button>
  );
};

export default DeleteChatButton;
