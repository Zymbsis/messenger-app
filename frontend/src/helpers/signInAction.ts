import type { FormState } from '../components/AuthForm.tsx';
import { login } from '../redux/auth/operations.ts';
import { isEmail, isNotEmpty, hasMinLength } from './validation.ts';
import { store } from '../redux/store.ts';

export const signInAction = (_: FormState, formData: FormData) => {
  const email = String(formData.get('email') || '');
  const password = String(formData.get('password') || '');

  const errors: string[] = [];

  if (!isEmail(email)) {
    errors.push('Please enter a valid email address.');
  }

  if (!isNotEmpty(password) || !hasMinLength(password, 8)) {
    errors.push('Please provide a password at least 8 characters length');
  }

  if (!errors.length) {
    try {
      store.dispatch(login({ email, password }));
    } catch {
      return { errors: null };
    }
  }

  return {
    errors,
    enteredValues: {
      email,
      password,
      confirmPassword: null,
    },
  };
};
