import { Link } from 'react-router';

import { useAppSelector } from '../redux/hooks';
import { selectIsAuthenticated } from '../redux/auth/selectors';

const routes = [
  { path: '/register', name: 'Sign Up' },
  { path: '/login', name: 'Sign In' },
];

const Home = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  return (
    <main className=' pb-52 h-full flex justify-end items-center flex-col gap-12 bg-[url(../assets/logo.webp)] bg-contain bg-no-repeat bg-position-[center_bottom_160px]'>
      <h1 className='text-4xl font-bold'>Welcome to the messenger app</h1>
      {!isAuthenticated && (
        <ul className='flex gap-5'>
          {routes.map((route) => (
            <li key={route.name}>
              <Link
                className='w-34 h-12 rounded-lg bg-black/90  flex justify-center items-center text-xl font-medium text-white'
                to={route.path}>
                {route.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
      {isAuthenticated && (
        <Link
          className='rounded-lg w-34 h-12 bg-black/90 flex justify-center items-center text-xl font-medium text-white'
          to='/chats'>
          Back to Chat
        </Link>
      )}
    </main>
  );
};

export default Home;
