import { useActionState } from 'react';
import AuthForm from '../components/AuthForm';
import { FormTypeEnum } from '../types/enums';
import { signInAction } from '../helpers/signInAction';

const Login = () => {
  const [formState, formAction, pending] = useActionState(signInAction, {
    errors: null,
  });

  return (
    <AuthForm
      formType={FormTypeEnum.SIGNIN}
      action={formAction}
      formState={formState}
      isPending={pending}
    />
  );
};

export default Login;
