import { useActionState } from 'react';
import AuthForm from '../components/AuthForm';
import { FormTypeEnum } from '../types/enums';
import { signUpAction } from '../helpers/signUpAction';

const Register = () => {
  const [formState, formAction, pending] = useActionState(signUpAction, {
    errors: null,
  });

  return (
    <AuthForm
      formType={FormTypeEnum.SIGNUP}
      action={formAction}
      formState={formState}
      isPending={pending}
    />
  );
};

export default Register;
