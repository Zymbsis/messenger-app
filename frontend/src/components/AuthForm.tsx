import type { ComponentPropsWithRef } from 'react';
import InputField from './InputField';
import PasswordField from './PasswordField';
import AuthSwitchMessage from './AuthSwitchMessage';
import type { FormTypeEnum } from './enums';
import FormValidationErrors from './FormValidationErrors';

export type FormState = {
  errors: null | string[];
  enteredValues?: {
    email: FormDataEntryValue | null;
    password: FormDataEntryValue | null;
    confirmPassword: FormDataEntryValue | null;
  };
};

type Props = ComponentPropsWithRef<'form'> & {
  formType: FormTypeEnum;
  formState: FormState;
  isPending: boolean;
};

const AuthForm = ({ formType, formState, isPending, ...props }: Props) => {
  return (
    <main className='flex justify-center items-center flex-col xs:px-8 h-full px-4 sm:px-12 md:px-24 lg:px-0'>
      <form
        className='flex flex-col w-full lg:w-1/2 gap-4 xl:w-1/3  mb-8'
        {...props}>
        <p className='text-4xl mb-4 font-medium'>{formType}</p>
        <InputField
          name='email'
          defaultValue={String(formState.enteredValues?.email || '')}>
          Email *
        </InputField>
        <PasswordField
          name='password'
          defaultValue={String(formState.enteredValues?.password || '')}>
          Password *
        </PasswordField>
        {formType === 'Sign Up' && (
          <PasswordField
            name='confirmPassword'
            defaultValue={String(
              formState.enteredValues?.confirmPassword || '',
            )}>
            Confirm Password *
          </PasswordField>
        )}
        <div className='h-14'>
          {!!formState.errors && (
            <FormValidationErrors errors={formState.errors} />
          )}
        </div>
        <button
          disabled={isPending}
          className='border rounded-lg h-12 w-1/2 self-center bg-black/90 text-white text-xl font-medium'>
          {formType}
        </button>
      </form>
      <AuthSwitchMessage formType={formType} />
    </main>
  );
};

export default AuthForm;
