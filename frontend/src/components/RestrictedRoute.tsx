import { Navigate, Outlet } from 'react-router';

const RestrictedRoute = () => {
  const isAuthenticated = false;

  return isAuthenticated ? <Navigate to='/chats' /> : <Outlet />;
};

export default RestrictedRoute;
