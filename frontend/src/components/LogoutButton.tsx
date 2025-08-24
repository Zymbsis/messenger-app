import { CiLogout } from 'react-icons/ci';

import { useAppDispatch } from '../redux/hooks';
import { logout } from '../redux/auth/operations';

const LogoutButton = () => {
  const dispatch = useAppDispatch();
  const handleLogout = () => dispatch(logout());

  return (
    <button
      className='h-full w-14 px-3'
      type='button'
      title='Logout'
      onClick={handleLogout}>
      <CiLogout className='w-full h-full' />
    </button>
  );
};

export default LogoutButton;
