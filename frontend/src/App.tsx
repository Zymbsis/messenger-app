import { Outlet } from 'react-router';

const App = () => {
  return (
    <main className='h-full'>
      <Outlet />
    </main>
  );
};

export default App;
