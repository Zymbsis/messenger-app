import { Link } from 'react-router';

const Home = () => {
  const isAuthenticated = false;
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
