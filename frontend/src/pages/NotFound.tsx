import { Link } from 'react-router';

const NotFound = () => {
  return (
    <main className='pb-52 h-full flex justify-end items-center flex-col gap-8 bg-[url(../assets/logo.webp)] bg-contain bg-no-repeat bg-position-[center_bottom_160px]'>
      <p className='text-4xl font-bold'>404</p>
      <p className='text-4xl font-bold'>Page not found</p>
      <Link
        className='w-38 h-12 rounded-lg bg-black/90  flex justify-center items-center text-xl font-medium text-white'
        to='/'>
        Back to home
      </Link>
    </main>
  );
};

export default NotFound;
