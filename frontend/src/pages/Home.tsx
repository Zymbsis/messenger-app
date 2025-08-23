import { Link } from 'react-router';
import { useAppSelector } from '../redux/hooks';
import { selectIsAuthenticated } from '../redux/auth/selectors';

const Home = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  return (
    <>
      <div>Welcome to the messenger app</div>
      {!isAuthenticated && (
        <ul className='flex gap-5'>
          <li>
            <Link to='/register'>Sign Up</Link>
          </li>
          <li>
            <Link to='/login'> Sign In</Link>
          </li>
        </ul>
      )}
    </>
  );
};

export default Home;
