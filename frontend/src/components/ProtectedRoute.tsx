import { Navigate, Outlet } from 'react-router';
import { useAppSelector } from '../redux/hooks';
import { selectIsAuthenticated } from '../redux/auth/selectors';

const ProtectedRoute = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  return isAuthenticated ? <Outlet /> : <Navigate to='/' />;
};

export default ProtectedRoute;
