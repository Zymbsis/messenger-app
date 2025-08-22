import { isEmail, isNotEmpty, hasMinLength } from './validation.ts';

export const signInAction = (_: unknown, formData: FormData) => {
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
    return {
      errors: null,
    };
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
