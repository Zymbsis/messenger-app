import { createBrowserRouter } from 'react-router';
import App from './App';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Chats from './pages/Chats';
import Chat from './pages/Chat';
import RestrictedRoute from './components/RestrictedRoute';
import ProtectedRoute from './components/ProtectedRoute';

export default createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      { index: true, Component: Home },
      {
        Component: RestrictedRoute,
        children: [
          { path: 'register', Component: Register },
          { path: 'login', Component: Login },
        ],
      },
      {
        Component: ProtectedRoute,
        children: [
          {
            path: 'chats',
            Component: Chats,
            children: [{ path: ':chat_id', Component: Chat }],
          },
        ],
      },
    ],
  },
]);
