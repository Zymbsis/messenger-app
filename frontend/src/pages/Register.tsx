import { useActionState } from 'react';
import AuthForm from '../components/AuthForm';
import { FormTypeEnum } from '../components/enums';
import { signUpAction } from '../helpers/signUpAction';

const Register = () => {
  const [formState, formAction] = useActionState(signUpAction, {
    errors: null,
  });

  return (
    <AuthForm
      formType={FormTypeEnum.SIGNUP}
      action={formAction}
      formState={formState}
    />
  );
};

export default Register;
