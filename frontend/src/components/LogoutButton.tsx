import { CiLogout } from 'react-icons/ci';
import { useAppDispatch } from '../redux/hooks';
import { logout } from '../redux/auth/operations';
import { CONFIRM_MESSAGES } from '../helpers/confirmMessages';
import { useModalContext } from '../helpers/modalContext';

const LogoutButton = () => {
  const dispatch = useAppDispatch();
  const { handleSetDialogData } = useModalContext();

  const handleLogoutBtnClick = () => {
    handleSetDialogData({
      title: CONFIRM_MESSAGES.logout.title,
      onConfirm: () => dispatch(logout()),
    });
  };

  return (
    <button
      className='h-full w-14 px-3'
      type='button'
      title='Logout'
      onClick={handleLogoutBtnClick}>
      <CiLogout className='w-full h-full' />
    </button>
  );
};

export default LogoutButton;
