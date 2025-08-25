import ContactsSelect from './ContactsSelect';
import LogoutButton from './LogoutButton';

const ChatsHeader = () => {
  return (
    <header className='h-14 border-b border-black/10 flex justify-end py-3'>
      <ContactsSelect />
      <LogoutButton />
    </header>
  );
};

export default ChatsHeader;
