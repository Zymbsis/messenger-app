import type { FormState } from '../components/AuthForm.tsx';
import { register } from '../redux/auth/operations.ts';
import {
  isEmail,
  isNotEmpty,
  isEqualToOtherValue,
  hasMinLength,
} from './validation.ts';
import { store } from '../redux/store.ts';

export const signUpAction = async (_: FormState, formData: FormData) => {
  const email = String(formData.get('email') || '');
  const password = String(formData.get('password') || '');
  const confirmPassword = String(formData.get('confirmPassword') || '');

  const errors: string[] = [];

  if (!isEmail(email)) {
    errors.push('Please enter a valid email address.');
  }

  if (!isNotEmpty(password) || !hasMinLength(password, 8)) {
    errors.push('Please provide a password at least 8 characters length');
  }

  if (!isEqualToOtherValue(password, confirmPassword)) {
    errors.push('Passwords don`t match!');
  }

  if (!errors.length) {
    try {
      store.dispatch(
        register({
          email,
          password,
        }),
      );
    } catch {
      return { errors: null };
    }
  }

  return {
    errors,
    enteredValues: {
      email,
      password,
      confirmPassword,
    },
  };
};
