import { useActionState } from 'react';
import AuthForm from '../components/AuthForm';
import { FormTypeEnum } from '../components/enums';
import { signInAction } from '../helpers/signInAction';

const Login = () => {
  const [formState, formAction] = useActionState(signInAction, {
    errors: null,
  });

  return (
    <AuthForm
      formState={formState}
      action={formAction}
      formType={FormTypeEnum.SIGNIN}
    />
  );
};

export default Login;
