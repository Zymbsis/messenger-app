import { Navigate, Outlet } from 'react-router';

const ProtectedRoute = () => {
  const isAuthenticated = false;

  return isAuthenticated ? <Outlet /> : <Navigate to='/' />;
};

export default ProtectedRoute;
