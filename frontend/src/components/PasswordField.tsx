import {
  useState,
  type ComponentPropsWithRef,
  type PropsWithChildren,
} from 'react';
import { FaEye } from 'react-icons/fa';
import { FaEyeSlash } from 'react-icons/fa6';
import InputField from './InputField';

type Props = PropsWithChildren<ComponentPropsWithRef<'input'>>;

const PasswordField = ({ children, ...props }: Props) => {
  const [isPwdVisible, setIsPwdVisible] = useState(false);

  const handlePwdToggle = () => setIsPwdVisible(!isPwdVisible);

  return (
    <div className='relative'>
      <InputField type={isPwdVisible ? 'text' : 'password'} {...props}>
        {children}
      </InputField>
      <button
        onClick={handlePwdToggle}
        className='absolute right-0 size-14 px-3.5 top-6'
        type='button'>
        {isPwdVisible ? (
          <FaEyeSlash className='size-full' />
        ) : (
          <FaEye className='size-full' />
        )}
      </button>
    </div>
  );
};

export default PasswordField;
