import { Link } from 'react-router';
import { FormTypeEnum } from './enums';

type Props = { formType: FormTypeEnum };

const signUpMessage = 'Don`t have an account yet?';
const signInMessage = 'Already have an account?';

const AuthSwitchMessage = ({ formType }: Props) => {
  const isFormTypeSignUp = formType === FormTypeEnum.SIGNUP;
  return (
    <p>
      {isFormTypeSignUp ? signInMessage : signUpMessage}{' '}
      <Link
        className='underline'
        to={isFormTypeSignUp ? '/login' : '/register'}>
        {isFormTypeSignUp ? FormTypeEnum.SIGNIN : FormTypeEnum.SIGNUP}
      </Link>
    </p>
  );
};

export default AuthSwitchMessage;
