import { Navigate, Outlet } from 'react-router';
import { useAppSelector } from '../redux/hooks';
import { selectIsAuthenticated } from '../redux/auth/selectors';

const RestrictedRoute = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  return isAuthenticated ? <Navigate to='/chats' /> : <Outlet />;
};

export default RestrictedRoute;
