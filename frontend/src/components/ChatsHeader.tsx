import ContactsSelect from './ContactsSelect';
import LogoutButton from './LogoutButton';

const ChatsHeader = () => {
  return (
    <header className='h-14 border-b flex justify-end py-3'>
      <ContactsSelect />
      <LogoutButton />
    </header>
  );
};

export default ChatsHeader;
